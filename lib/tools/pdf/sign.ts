import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  loadPdfDocument,
  savePdfToBlob,
  stripPdfExtension,
  type ProgressCallback,
} from "./core";

export type SignatureKind = "image" | "text";

export interface SignPdfOptions {
  kind: SignatureKind;
  /** Data URL (image/png) when kind is "image", plain text when kind is "text". */
  data: string;
  /** X position, 0-100 % of page width (left→right). */
  xPct: number;
  /** Y position, 0-100 % of page height (top→bottom). */
  yPct: number;
  /** 1-based page number. Use -1 for "last page" or 0 for "all pages". */
  page: number;
  /** Text-only: font size in points. Defaults to 24. */
  fontSize?: number;
  /** Text or image tint. Defaults to black. */
  color?: { r: number; g: number; b: number };
  /** Image-only: signature width in points. Height derived from aspect. */
  widthPts?: number;
}

function parseDataUrl(dataUrl: string): { mime: string; bytes: Uint8Array } {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) throw new Error("Invalid signature image data URL.");
  const mime = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { mime, bytes };
}

function resolveTargetPages(doc: PDFDocument, page: number): number[] {
  const count = doc.getPageCount();
  if (page === 0) return Array.from({ length: count }, (_, i) => i);
  if (page === -1) return [count - 1];
  const idx = Math.max(1, Math.min(count, Math.floor(page))) - 1;
  return [idx];
}

export async function signPdf(
  file: File,
  options: SignPdfOptions,
  onProgress?: ProgressCallback,
): Promise<{ name: string; size: number; blob: Blob }> {
  onProgress?.(10, "Loading document");
  const doc = await loadPdfDocument(file);

  const targetPages = resolveTargetPages(doc, options.page);
  const color = options.color ?? { r: 0, g: 0, b: 0 };
  const tint = rgb(color.r, color.g, color.b);

  if (options.kind === "image") {
    onProgress?.(35, "Embedding signature image");
    const { mime, bytes } = parseDataUrl(options.data);
    const image = mime.includes("jpeg") || mime.includes("jpg")
      ? await doc.embedJpg(bytes)
      : await doc.embedPng(bytes);

    const baseWidth = options.widthPts ?? 180;
    const dims = image.scale(baseWidth / image.width);

    for (const pageIndex of targetPages) {
      const page = doc.getPage(pageIndex);
      const { width, height } = page.getSize();
      const x = (options.xPct / 100) * width - dims.width / 2;
      const yFromTop = (options.yPct / 100) * height;
      const y = height - yFromTop - dims.height / 2;

      page.drawImage(image, {
        x: Math.max(4, Math.min(width - dims.width - 4, x)),
        y: Math.max(4, Math.min(height - dims.height - 4, y)),
        width: dims.width,
        height: dims.height,
      });
    }
  } else {
    onProgress?.(35, "Drawing signature text");
    const font = await doc.embedFont(StandardFonts.HelveticaOblique);
    const size = options.fontSize ?? 24;
    const textWidth = font.widthOfTextAtSize(options.data, size);
    const textHeight = font.heightAtSize(size);

    for (const pageIndex of targetPages) {
      const page = doc.getPage(pageIndex);
      const { width, height } = page.getSize();
      const x = (options.xPct / 100) * width - textWidth / 2;
      const yFromTop = (options.yPct / 100) * height;
      const y = height - yFromTop - textHeight / 2;

      page.drawText(options.data, {
        x: Math.max(4, Math.min(width - textWidth - 4, x)),
        y: Math.max(4, Math.min(height - textHeight - 4, y)),
        size,
        font,
        color: tint,
      });
    }
  }

  onProgress?.(85, "Writing PDF");
  const blob = await savePdfToBlob(doc);
  onProgress?.(100);

  return {
    name: `${stripPdfExtension(file.name)}_signed.pdf`,
    size: blob.size,
    blob,
  };
}
