import { PDFDocument } from "pdf-lib";

type LoadOptions = Parameters<typeof PDFDocument.load>[1];

export type ProgressCallback = (progress: number, message?: string) => void;

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}

/**
 * Load a PDF File into a mutable PDFDocument (pdf-lib).
 * `ignoreEncryption` is passed through so callers can opt into best-effort
 * loading of protected PDFs for tools like repair/unlock.
 */
export async function loadPdfDocument(
  file: File,
  options?: LoadOptions,
): Promise<PDFDocument> {
  const buffer = await readFileAsArrayBuffer(file);
  return PDFDocument.load(buffer, {
    updateMetadata: false,
    ...options,
  });
}

export async function savePdfToBlob(doc: PDFDocument): Promise<Blob> {
  const bytes = await doc.save({ useObjectStreams: true });
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: "application/pdf" });
}

export function stripPdfExtension(name: string): string {
  return name.replace(/\.pdf$/i, "");
}

/**
 * Parse a string like "1-5, 8, 12-15" into a sorted, deduped list of
 * zero-based page indices, clamped to [0, totalPages-1].
 */
export function parsePageList(input: string, totalPages: number): number[] {
  const indices = new Set<number>();
  const cleaned = input.replace(/\s+/g, "");
  if (!cleaned) return [];

  for (const token of cleaned.split(",")) {
    if (!token) continue;

    const rangeMatch = token.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      for (let i = lo; i <= hi; i++) {
        if (i >= 1 && i <= totalPages) indices.add(i - 1);
      }
      continue;
    }

    const single = parseInt(token, 10);
    if (Number.isFinite(single) && single >= 1 && single <= totalPages) {
      indices.add(single - 1);
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Parse ranges into grouped ranges (each group becomes a separate output).
 * "1-5, 8, 12-15" -> [[0,1,2,3,4], [7], [11,12,13,14]]
 */
export function parsePageRanges(
  input: string,
  totalPages: number,
): number[][] {
  const groups: number[][] = [];
  const cleaned = input.replace(/\s+/g, "");
  if (!cleaned) return [];

  for (const token of cleaned.split(",")) {
    if (!token) continue;

    const rangeMatch = token.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      const lo = Math.max(1, Math.min(start, end));
      const hi = Math.min(totalPages, Math.max(start, end));
      const group: number[] = [];
      for (let i = lo; i <= hi; i++) group.push(i - 1);
      if (group.length) groups.push(group);
      continue;
    }

    const single = parseInt(token, 10);
    if (Number.isFinite(single) && single >= 1 && single <= totalPages) {
      groups.push([single - 1]);
    }
  }

  return groups;
}

export async function getPageCount(file: File): Promise<number> {
  try {
    const doc = await loadPdfDocument(file, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch {
    return 0;
  }
}

/**
 * Lazily configure and return the pdfjs library with a pinned worker URL.
 * Only runs in the browser. Cached for the session.
 */
type PdfJsModule = typeof import("pdfjs-dist");
let pdfjsPromise: Promise<PdfJsModule> | null = null;

export function getPdfJs(): Promise<PdfJsModule> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("pdfjs is only available in the browser"));
  }
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import("pdfjs-dist");
      const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}
