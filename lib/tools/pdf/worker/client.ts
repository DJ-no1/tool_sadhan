/**
 * Main-thread facade for the heavy PDF worker.
 *
 * Wraps the worker's message protocol in promise-based async helpers so the
 * tool pages can `await` a worker job and still receive progress callbacks.
 */

import type { ProgressCallback } from "../core";

export interface WorkerPdfResult {
  blob: Blob;
  name: string;
  size: number;
}

type OutMsg =
  | { type: "progress"; id: string; progress: number; message?: string }
  | { type: "done"; id: string; blob: Blob; name: string; size: number }
  | { type: "error"; id: string; message: string };

interface Pending {
  resolve: (v: WorkerPdfResult) => void;
  reject: (e: Error) => void;
  onProgress?: ProgressCallback;
}

let worker: Worker | null = null;
const pending = new Map<string, Pending>();

function ensureWorker(): Worker {
  if (worker) return worker;
  // Served from /public so Next.js ships it verbatim with the correct MIME
  // type. The worker is a module worker that lazily imports pdf-lib,
  // pdfjs-dist and jszip from a CDN — keeps the main bundle small and
  // avoids bundler-specific worker transforms.
  worker = new Worker("/workers/pdf-heavy.worker.js", { type: "module" });
  worker.addEventListener("message", (ev: MessageEvent<OutMsg>) => {
    const msg = ev.data;
    const entry = pending.get(msg.id);
    if (!entry) return;

    if (msg.type === "progress") {
      entry.onProgress?.(msg.progress, msg.message);
    } else if (msg.type === "done") {
      pending.delete(msg.id);
      entry.resolve({ blob: msg.blob, name: msg.name, size: msg.size });
    } else if (msg.type === "error") {
      pending.delete(msg.id);
      entry.reject(new Error(msg.message));
    }
  });
  worker.addEventListener("error", (ev) => {
    for (const entry of pending.values()) {
      entry.reject(new Error(ev.message || "PDF worker crashed."));
    }
    pending.clear();
    worker?.terminate();
    worker = null;
  });
  return worker;
}

/**
 * Returns true when the browser can host the heavy PDF worker. Required
 * surface: Web Workers + OffscreenCanvas + crypto.randomUUID.
 */
export function canUsePdfWorker(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof Worker === "undefined") return false;
  if (typeof OffscreenCanvas === "undefined") return false;
  if (typeof crypto === "undefined" || !crypto.randomUUID) return false;
  return true;
}

function newId(): string {
  return crypto.randomUUID();
}

export function runRasterizeInWorker(
  buffer: ArrayBuffer,
  opts: {
    scale: number;
    quality: number;
    grayscale: boolean;
    outputName: string;
  },
  onProgress?: ProgressCallback,
): Promise<WorkerPdfResult> {
  const id = newId();
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress });
    try {
      ensureWorker().postMessage(
        { type: "rasterize", id, buffer, opts },
        [buffer],
      );
    } catch (err) {
      pending.delete(id);
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}

export function runPdfToJpgInWorker(
  buffer: ArrayBuffer,
  opts: {
    format: "jpg" | "png" | "webp";
    quality: number;
    scale: number;
    pages?: number[];
    baseName: string;
  },
  onProgress?: ProgressCallback,
): Promise<WorkerPdfResult> {
  const id = newId();
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress });
    try {
      ensureWorker().postMessage(
        { type: "pdfToJpg", id, buffer, opts },
        [buffer],
      );
    } catch (err) {
      pending.delete(id);
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
