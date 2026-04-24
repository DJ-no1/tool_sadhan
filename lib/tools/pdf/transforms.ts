import { degrees } from "pdf-lib";
import {
  loadPdfDocument,
  parsePageList,
  savePdfToBlob,
  stripPdfExtension,
  type ProgressCallback,
} from "./core";
import type { PdfResult } from "./page-ops";

export type RotateAngle = 90 | 180 | 270;

export interface RotateOptions {
  angle: RotateAngle;
  /** Apply to selected pages only; if omitted or empty → all pages. */
  pagesExpression?: string;
  /** Alternative: per-page deltas in degrees. */
  perPage?: Record<number, number>;
}

export async function rotatePdf(
  file: File,
  options: RotateOptions,
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const doc = await loadPdfDocument(file, { ignoreEncryption: true });
  const pages = doc.getPages();
  const total = pages.length;

  const selected = options.pagesExpression
    ? new Set(parsePageList(options.pagesExpression, total))
    : null;

  const perPage = options.perPage ?? {};

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const current = page.getRotation().angle;
    let delta = 0;

    if (perPage[i + 1] !== undefined) {
      delta = perPage[i + 1];
    } else if (!selected || selected.has(i)) {
      delta = options.angle;
    }

    if (delta !== 0) {
      const next = (((current + delta) % 360) + 360) % 360;
      page.setRotation(degrees(next));
    }

    if (i % 10 === 0) {
      onProgress?.(Math.round(((i + 1) / total) * 90));
    }
  }

  const blob = await savePdfToBlob(doc);
  onProgress?.(100, "Done");
  return {
    blob,
    name: `${stripPdfExtension(file.name)}_rotated.pdf`,
    size: blob.size,
  };
}

export interface CropMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CropOptions {
  /** Per-edge margins in points. 1 mm ≈ 2.8346 pt. */
  margins?: CropMargins;
  /** Explicit crop box in points: [x, y, width, height] (applied to every page). */
  box?: [number, number, number, number];
  /** Limit crop to the specified 1-based page numbers. */
  onlyPages?: number[];
}

export const MM_PER_POINT = 1 / 2.8346456693;
export const POINTS_PER_MM = 2.8346456693;

/**
 * Crop pages by applying a CropBox. Content is preserved — viewers render
 * only the cropped region.
 */
export async function cropPdf(
  file: File,
  options: CropOptions,
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const doc = await loadPdfDocument(file, { ignoreEncryption: true });
  const pages = doc.getPages();
  const total = pages.length;
  const onlyPages = options.onlyPages
    ? new Set(options.onlyPages.map((n) => n - 1))
    : null;

  for (let i = 0; i < total; i++) {
    if (onlyPages && !onlyPages.has(i)) continue;

    const page = pages[i];
    if (options.box) {
      const [x, y, w, h] = options.box;
      page.setCropBox(x, y, w, h);
    } else if (options.margins) {
      const { width, height } = page.getSize();
      const { top, right, bottom, left } = options.margins;
      const x = Math.max(0, Math.min(left, width));
      const y = Math.max(0, Math.min(bottom, height));
      const w = Math.max(1, width - x - Math.max(0, right));
      const h = Math.max(1, height - y - Math.max(0, top));
      page.setCropBox(x, y, w, h);
    }
    if (i % 10 === 0) {
      onProgress?.(Math.round(((i + 1) / total) * 90));
    }
  }

  const blob = await savePdfToBlob(doc);
  onProgress?.(100, "Done");
  return {
    blob,
    name: `${stripPdfExtension(file.name)}_cropped.pdf`,
    size: blob.size,
  };
}
