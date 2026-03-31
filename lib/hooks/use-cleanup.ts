"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  blobRegistry,
  CleanupManager,
  createTrackedBlobURL,
  revokeTrackedBlobURL,
  requestGCHint,
} from "@/lib/memory";

/**
 * Hook for managing blob URL cleanup
 * Automatically revokes all tracked URLs on unmount
 */
export function useBlobCleanup() {
  const urlsRef = useRef<Set<string>>(new Set());

  const createURL = useCallback((blob: Blob): string => {
    const url = createTrackedBlobURL(blob);
    urlsRef.current.add(url);
    return url;
  }, []);

  const revokeURL = useCallback((url: string): void => {
    if (urlsRef.current.has(url)) {
      revokeTrackedBlobURL(url);
      urlsRef.current.delete(url);
    }
  }, []);

  const revokeAll = useCallback((): void => {
    for (const url of urlsRef.current) {
      revokeTrackedBlobURL(url);
    }
    urlsRef.current.clear();
    requestGCHint();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const url of urlsRef.current) {
        revokeTrackedBlobURL(url);
      }
      urlsRef.current.clear();
    };
  }, []);

  return { createURL, revokeURL, revokeAll, count: urlsRef.current.size };
}

/**
 * Hook for managing cleanup functions
 */
export function useCleanupManager() {
  const managerRef = useRef<CleanupManager>(new CleanupManager());

  const addCleanup = useCallback((cleanup: () => void): void => {
    managerRef.current.add(cleanup);
  }, []);

  const addBlobURL = useCallback((url: string): void => {
    managerRef.current.addBlobURL(url);
  }, []);

  const cleanup = useCallback((): void => {
    managerRef.current.cleanup();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const manager = managerRef.current;
    return () => {
      manager.cleanup();
    };
  }, []);

  return { addCleanup, addBlobURL, cleanup };
}

/**
 * Hook for AbortController management
 * Automatically aborts on unmount or when creating a new controller
 */
export function useAbortController() {
  const controllerRef = useRef<AbortController | null>(null);

  const createController = useCallback((): AbortController => {
    // Abort previous controller if exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return controllerRef.current;
  }, []);

  const abort = useCallback((): void => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }, []);

  const getSignal = useCallback((): AbortSignal | undefined => {
    return controllerRef.current?.signal;
  }, []);

  // Abort on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return { createController, abort, getSignal };
}

/**
 * Hook for memory-efficient state that cleans up on changes
 * Useful for blob arrays that should be cleaned up when replaced
 */
export function useCleanupState<T>(
  cleanupFn: (value: T) => void
): [T | undefined, (value: T | undefined) => void] {
  const valueRef = useRef<T | undefined>(undefined);
  const cleanupRef = useRef(cleanupFn);
  
  // Keep cleanup function up to date
  cleanupRef.current = cleanupFn;

  const setValue = useCallback((newValue: T | undefined): void => {
    // Cleanup old value
    if (valueRef.current !== undefined) {
      cleanupRef.current(valueRef.current);
    }
    valueRef.current = newValue;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (valueRef.current !== undefined) {
        cleanupRef.current(valueRef.current);
      }
    };
  }, []);

  return [valueRef.current, setValue];
}

/**
 * Hook to track visible items for virtualization
 * @param totalItems Total number of items
 * @param visibleCount Number of items visible at once
 */
export function useVirtualization(totalItems: number, visibleCount: number = 20) {
  const startIndexRef = useRef(0);

  const setStartIndex = useCallback((index: number) => {
    startIndexRef.current = Math.max(0, Math.min(index, totalItems - visibleCount));
  }, [totalItems, visibleCount]);

  const getVisibleRange = useCallback(() => {
    const start = startIndexRef.current;
    const end = Math.min(start + visibleCount, totalItems);
    return { start, end };
  }, [totalItems, visibleCount]);

  return { setStartIndex, getVisibleRange, startIndex: startIndexRef.current };
}

/**
 * Hook to detect memory pressure
 */
export function useMemoryWarning(thresholdMB: number = 200) {
  const checkMemory = useCallback((): boolean => {
    // @ts-expect-error - performance.memory is non-standard
    const memory = performance?.memory;
    if (memory?.jsHeapSizeLimit && memory?.usedJSHeapSize) {
      const availableMB = (memory.jsHeapSizeLimit - memory.usedJSHeapSize) / (1024 * 1024);
      return availableMB < thresholdMB;
    }
    // Check blob registry as fallback heuristic
    return blobRegistry.size > 500;
  }, [thresholdMB]);

  return { isMemoryLow: checkMemory };
}
