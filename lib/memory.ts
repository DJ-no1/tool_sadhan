/**
 * Memory management utilities for RAM-efficient processing
 * Handles blob cleanup, memory estimation, and garbage collection hints
 */

// Memory thresholds
export const MEMORY_WARNING_THRESHOLD_MB = 200;
export const MEMORY_CRITICAL_THRESHOLD_MB = 400;
export const DEFAULT_CHUNK_SIZE = 50;
export const MAX_CONCURRENT_BLOBS = 100;

/**
 * Estimate memory usage for extracted frames
 * @param frameCount Number of frames to extract
 * @param width Frame width in pixels
 * @param height Frame height in pixels
 * @param format Output format (affects compression)
 * @returns Estimated memory in MB
 */
export function estimateFrameMemory(
  frameCount: number,
  width: number,
  height: number,
  format: "png" | "jpg" | "webp" = "jpg"
): number {
  // Base estimate: raw pixel data (4 bytes per pixel for RGBA)
  const rawPixelSize = width * height * 4;
  
  // Compression ratios vary by format
  const compressionRatios: Record<string, number> = {
    png: 0.5,   // PNG compresses ~50% typically
    jpg: 0.15,  // JPEG compresses ~85% typically
    webp: 0.12, // WebP is most efficient
  };
  
  const ratio = compressionRatios[format] || 0.2;
  const estimatedBlobSize = rawPixelSize * ratio;
  
  // Account for blob URL overhead (~100 bytes per URL)
  // Plus browser rendering overhead (roughly 2x for displayed images)
  const perFrameOverhead = 100 + estimatedBlobSize;
  
  const totalBytes = frameCount * perFrameOverhead;
  return Math.ceil(totalBytes / (1024 * 1024));
}

/**
 * Check if extraction would exceed memory thresholds
 */
export function checkMemoryRisk(
  frameCount: number,
  width: number,
  height: number,
  format: "png" | "jpg" | "webp" = "jpg"
): {
  estimatedMB: number;
  risk: "low" | "medium" | "high" | "critical";
  message: string;
} {
  const estimatedMB = estimateFrameMemory(frameCount, width, height, format);
  
  if (estimatedMB > MEMORY_CRITICAL_THRESHOLD_MB) {
    return {
      estimatedMB,
      risk: "critical",
      message: `Extracting ${frameCount} frames will use ~${estimatedMB}MB of memory. This may crash your browser. Consider reducing frame count or narrowing the time range.`,
    };
  }
  
  if (estimatedMB > MEMORY_WARNING_THRESHOLD_MB) {
    return {
      estimatedMB,
      risk: "high",
      message: `Extracting ${frameCount} frames will use ~${estimatedMB}MB of memory. This may slow down your browser.`,
    };
  }
  
  if (frameCount > 500) {
    return {
      estimatedMB,
      risk: "medium",
      message: `Extracting ${frameCount} frames (~${estimatedMB}MB). Processing may take a while.`,
    };
  }
  
  return {
    estimatedMB,
    risk: "low",
    message: "",
  };
}

/**
 * Blob URL registry for tracking and cleanup
 */
class BlobURLRegistry {
  private urls = new Set<string>();
  private cleanupQueue: string[] = [];
  private isProcessingQueue = false;

  /**
   * Register a blob URL for tracking
   */
  register(url: string): void {
    this.urls.add(url);
  }

  /**
   * Revoke a single blob URL
   */
  revoke(url: string): void {
    if (this.urls.has(url)) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // URL may already be revoked
      }
      this.urls.delete(url);
    }
  }

  /**
   * Queue URL for async cleanup (non-blocking)
   */
  queueRevoke(url: string): void {
    if (this.urls.has(url)) {
      this.cleanupQueue.push(url);
      this.processQueue();
    }
  }

  /**
   * Process cleanup queue in batches to avoid blocking
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.cleanupQueue.length > 0) {
      const batch = this.cleanupQueue.splice(0, 10);
      for (const url of batch) {
        this.revoke(url);
      }
      // Yield to main thread
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    this.isProcessingQueue = false;
  }

  /**
   * Revoke all tracked URLs
   */
  revokeAll(): void {
    for (const url of this.urls) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // URL may already be revoked
      }
    }
    this.urls.clear();
    this.cleanupQueue = [];
  }

  /**
   * Get count of tracked URLs
   */
  get size(): number {
    return this.urls.size;
  }
}

// Global registry instance
export const blobRegistry = new BlobURLRegistry();

/**
 * Create a blob URL and register it for tracking
 */
export function createTrackedBlobURL(blob: Blob): string {
  const url = URL.createObjectURL(blob);
  blobRegistry.register(url);
  return url;
}

/**
 * Revoke a tracked blob URL
 */
export function revokeTrackedBlobURL(url: string): void {
  blobRegistry.revoke(url);
}

/**
 * Request garbage collection hint (not guaranteed)
 * Works in some browsers when memory pressure is high
 */
export function requestGCHint(): void {
  // Try to hint GC by creating and clearing a large temporary array
  // This is a heuristic, not a guaranteed GC trigger
  try {
    const temp = new Array(1000000);
    temp.fill(0);
    temp.length = 0;
  } catch {
    // Ignore allocation failures
  }
}

/**
 * Create cleanup function for a set of blob URLs
 */
export function createBlobCleanup(urls: string[]): () => void {
  return () => {
    for (const url of urls) {
      revokeTrackedBlobURL(url);
    }
    requestGCHint();
  };
}

/**
 * Process items in chunks with cleanup between batches
 * @param items Items to process
 * @param chunkSize Items per chunk
 * @param processor Function to process each item
 * @param onChunkComplete Callback after each chunk (for progress, cleanup)
 * @param signal AbortSignal for cancellation
 */
export async function processInChunks<T, R>(
  items: T[],
  chunkSize: number,
  processor: (item: T, index: number) => Promise<R>,
  onChunkComplete?: (results: R[], chunkIndex: number, totalChunks: number) => void,
  signal?: AbortSignal
): Promise<R[]> {
  const results: R[] = [];
  const totalChunks = Math.ceil(items.length / chunkSize);

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    // Check for cancellation
    if (signal?.aborted) {
      throw new DOMException("Processing cancelled", "AbortError");
    }

    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, items.length);
    const chunkItems = items.slice(start, end);

    // Process chunk
    const chunkResults: R[] = [];
    for (let i = 0; i < chunkItems.length; i++) {
      if (signal?.aborted) {
        throw new DOMException("Processing cancelled", "AbortError");
      }
      const result = await processor(chunkItems[i], start + i);
      chunkResults.push(result);
    }

    results.push(...chunkResults);

    // Callback for progress updates and intermediate cleanup
    onChunkComplete?.(chunkResults, chunkIndex, totalChunks);

    // Yield to main thread between chunks
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return results;
}

/**
 * Cleanup manager for tracking multiple cleanup functions
 */
export class CleanupManager {
  private cleanupFunctions: (() => void)[] = [];

  /**
   * Add a cleanup function
   */
  add(cleanup: () => void): void {
    this.cleanupFunctions.push(cleanup);
  }

  /**
   * Add a blob URL to cleanup
   */
  addBlobURL(url: string): void {
    this.add(() => revokeTrackedBlobURL(url));
  }

  /**
   * Run all cleanup functions
   */
  cleanup(): void {
    for (const fn of this.cleanupFunctions) {
      try {
        fn();
      } catch {
        // Ignore cleanup errors
      }
    }
    this.cleanupFunctions = [];
    requestGCHint();
  }

  /**
   * Get count of registered cleanup functions
   */
  get size(): number {
    return this.cleanupFunctions.length;
  }
}

/**
 * Memory-efficient frame storage that keeps blobs but lazily creates URLs
 */
export interface LazyFrame {
  id: string;
  timestamp: number;
  filename: string;
  blob: Blob;
  _url?: string;
}

/**
 * Get URL for a lazy frame, creating it only when needed
 */
export function getLazyFrameURL(frame: LazyFrame): string {
  if (!frame._url) {
    frame._url = createTrackedBlobURL(frame.blob);
  }
  return frame._url;
}

/**
 * Revoke URL for a lazy frame
 */
export function revokeLazyFrameURL(frame: LazyFrame): void {
  if (frame._url) {
    revokeTrackedBlobURL(frame._url);
    frame._url = undefined;
  }
}

/**
 * Check available memory (when supported)
 * Returns null if not supported
 */
export function getAvailableMemoryMB(): number | null {
  // @ts-expect-error - performance.memory is non-standard (Chrome only)
  const memory = performance?.memory;
  if (memory?.jsHeapSizeLimit && memory?.usedJSHeapSize) {
    const available = memory.jsHeapSizeLimit - memory.usedJSHeapSize;
    return Math.floor(available / (1024 * 1024));
  }
  return null;
}

/**
 * Check if we're running low on memory
 */
export function isMemoryLow(): boolean {
  const available = getAvailableMemoryMB();
  if (available === null) return false;
  return available < MEMORY_WARNING_THRESHOLD_MB;
}
