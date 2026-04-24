import { PDFDocument, degrees } from "pdf-lib";
import JSZip from "jszip";
import {
  loadPdfDocument,
  parsePageList,
  parsePageRanges,
  savePdfToBlob,
  stripPdfExtension,
  type ProgressCallback,
} from "./core";

export interface PdfResult {
  blob: Blob;
  name: string;
  size: number;
}

/** Merge an ordered list of PDF files into a single PDF. */
export async function mergePdfs(
  files: File[],
  onProgress?: ProgressCallback,
  outputName = "merged_document.pdf",
): Promise<PdfResult> {
  if (files.length === 0) {
    throw new Error("Select at least one PDF to merge.");
  }

  const out = await PDFDocument.create();
  out.setCreator("tool_sadhan");
  out.setProducer("tool_sadhan");

  for (let i = 0; i < files.length; i++) {
    const src = await loadPdfDocument(files[i], { ignoreEncryption: true });
    const pages = await out.copyPages(src, src.getPageIndices());
    for (const page of pages) out.addPage(page);
    onProgress?.(
      Math.round(((i + 1) / files.length) * 90),
      `Copied ${files[i].name}`,
    );
  }

  const blob = await savePdfToBlob(out);
  onProgress?.(100, "Done");
  return { blob, name: outputName, size: blob.size };
}

async function buildPdfFromIndices(
  src: PDFDocument,
  indices: number[],
): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  for (const p of pages) out.addPage(p);
  return await out.save({ useObjectStreams: true });
}

/** Extract a subset of pages into a single PDF. */
export async function extractPages(
  file: File,
  pagesExpression: string,
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const src = await loadPdfDocument(file, { ignoreEncryption: true });
  const total = src.getPageCount();
  const indices = parsePageList(pagesExpression, total);
  if (indices.length === 0) {
    throw new Error(
      "No valid pages selected. Use formats like \"1, 3, 5\" or \"2-10\".",
    );
  }
  onProgress?.(30, `Extracting ${indices.length} page(s)`);
  const bytes = await buildPdfFromIndices(src, indices);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const blob = new Blob([buffer], { type: "application/pdf" });
  const name = `${stripPdfExtension(file.name)}_extracted.pdf`;
  onProgress?.(100, "Done");
  return { blob, name, size: blob.size };
}

/** Remove a subset of pages and return the remaining PDF. */
export async function removePages(
  file: File,
  pagesExpression: string | number[],
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const src = await loadPdfDocument(file, { ignoreEncryption: true });
  const total = src.getPageCount();
  const toRemove = new Set(
    Array.isArray(pagesExpression)
      ? pagesExpression
          .filter((n) => Number.isFinite(n) && n >= 1 && n <= total)
          .map((n) => n - 1)
      : parsePageList(pagesExpression, total),
  );
  const kept: number[] = [];
  for (let i = 0; i < total; i++) {
    if (!toRemove.has(i)) kept.push(i);
  }
  if (kept.length === 0) {
    throw new Error("You cannot remove every page.");
  }
  onProgress?.(30, `Keeping ${kept.length} page(s)`);
  const bytes = await buildPdfFromIndices(src, kept);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const blob = new Blob([buffer], { type: "application/pdf" });
  const name = `${stripPdfExtension(file.name)}_edited.pdf`;
  onProgress?.(100, "Done");
  return { blob, name, size: blob.size };
}

/** Reorder pages according to an explicit 1-based page-number order. */
export async function reorderPages(
  file: File,
  newOrder: number[],
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const src = await loadPdfDocument(file, { ignoreEncryption: true });
  const total = src.getPageCount();
  const indices = newOrder
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= total)
    .map((n) => n - 1);
  if (indices.length === 0) {
    throw new Error("No valid pages selected.");
  }
  onProgress?.(40, "Rebuilding document");
  const bytes = await buildPdfFromIndices(src, indices);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const blob = new Blob([buffer], { type: "application/pdf" });
  const name = `${stripPdfExtension(file.name)}_organized.pdf`;
  onProgress?.(100, "Done");
  return { blob, name, size: blob.size };
}

export interface OrganizeStep {
  /** Original 1-based page number from the source PDF. */
  sourcePage: number;
  /** Absolute rotation to apply on output (0/90/180/270). */
  rotation?: number;
}

/**
 * Build a new PDF from a reordered+rotated subset of source pages.
 * Only pages present in `steps` are kept, in the given order.
 */
export async function organizePdf(
  file: File,
  steps: OrganizeStep[],
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  if (steps.length === 0) {
    throw new Error("Keep at least one page.");
  }
  const src = await loadPdfDocument(file, { ignoreEncryption: true });
  const total = src.getPageCount();
  const sanitized = steps.filter(
    (s) => s.sourcePage >= 1 && s.sourcePage <= total,
  );
  if (sanitized.length === 0) {
    throw new Error("No valid pages selected.");
  }

  const out = await PDFDocument.create();
  const indices = sanitized.map((s) => s.sourcePage - 1);
  const copied = await out.copyPages(src, indices);

  for (let i = 0; i < copied.length; i++) {
    const page = copied[i];
    const step = sanitized[i];
    if (step.rotation !== undefined) {
      const current = page.getRotation().angle;
      const target = step.rotation;
      const delta = (((target - current) % 360) + 360) % 360;
      if (delta !== 0) {
        page.setRotation(degrees((current + delta) % 360));
      }
    }
    out.addPage(page);
    if (i % 10 === 0) {
      onProgress?.(Math.round(((i + 1) / copied.length) * 90));
    }
  }

  const blob = await savePdfToBlob(out);
  onProgress?.(100, "Done");
  return {
    blob,
    name: `${stripPdfExtension(file.name)}_organized.pdf`,
    size: blob.size,
  };
}

export type SplitMode = "range" | "extract" | "every";

export interface SplitOptions {
  mode: SplitMode;
  /** For mode="range": e.g. "1-5, 8, 12-15". Each group becomes a file. */
  ranges?: string;
  /** For mode="extract": e.g. "1, 3, 5". Combined into a single output file. */
  pages?: string;
  /** For mode="every": chunk size in pages. */
  every?: number;
}

/**
 * Split a PDF. Returns either a single result PDF (extract mode / single
 * chunk) or a ZIP of multiple PDFs.
 */
export async function splitPdf(
  file: File,
  options: SplitOptions,
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const src = await loadPdfDocument(file, { ignoreEncryption: true });
  const total = src.getPageCount();
  const baseName = stripPdfExtension(file.name);

  if (options.mode === "extract") {
    return extractPages(file, options.pages ?? "", onProgress);
  }

  let groups: number[][] = [];

  if (options.mode === "range") {
    groups = parsePageRanges(options.ranges ?? "", total);
    if (groups.length === 0) {
      throw new Error(
        "No valid page ranges. Use formats like \"1-5, 10-15, 20\".",
      );
    }
  } else {
    const every = Math.max(1, options.every ?? 1);
    for (let start = 0; start < total; start += every) {
      const group: number[] = [];
      for (let i = start; i < Math.min(start + every, total); i++) {
        group.push(i);
      }
      groups.push(group);
    }
  }

  if (groups.length === 1) {
    onProgress?.(40, "Building output");
    const bytes = await buildPdfFromIndices(src, groups[0]);
    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);
    const blob = new Blob([buffer], { type: "application/pdf" });
    const [lo, hi] = [groups[0][0] + 1, groups[0][groups[0].length - 1] + 1];
    const suffix = lo === hi ? `p${lo}` : `p${lo}-${hi}`;
    return {
      blob,
      name: `${baseName}_${suffix}.pdf`,
      size: blob.size,
    };
  }

  const zip = new JSZip();
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const bytes = await buildPdfFromIndices(src, group);
    const [lo, hi] = [group[0] + 1, group[group.length - 1] + 1];
    const suffix = lo === hi ? `p${lo}` : `p${lo}-${hi}`;
    zip.file(`${baseName}_${suffix}.pdf`, bytes);
    onProgress?.(
      Math.round(((i + 1) / groups.length) * 90),
      `Wrote part ${i + 1}/${groups.length}`,
    );
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  onProgress?.(100, "Done");
  return {
    blob: zipBlob,
    name: `${baseName}_split.zip`,
    size: zipBlob.size,
  };
}
