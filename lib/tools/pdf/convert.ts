import { PDFDocument, PageSizes } from "pdf-lib";
import JSZip from "jszip";
import {
  getPdfJs,
  loadPdfDocument,
  readFileAsArrayBuffer,
  savePdfToBlob,
  stripPdfExtension,
  type ProgressCallback,
} from "./core";
import type { PdfResult } from "./page-ops";
import {
  canUsePdfWorker,
  runPdfToJpgInWorker,
  runRasterizeInWorker,
} from "./worker/client";

export type JpgPageSize = "fit" | "A4" | "Letter" | "Legal";
export type JpgOrientation = "portrait" | "landscape" | "auto";
export type JpgMargin = "none" | "small" | "normal" | "large";

export interface JpgToPdfOptions {
  pageSize?: JpgPageSize;
  orientation?: JpgOrientation;
  margin?: JpgMargin;
  /** Per-image rotation in degrees (0/90/180/270). Same order as input files. */
  rotations?: number[];
}

function resolvePageDimensions(
  size: JpgPageSize,
  orientation: JpgOrientation,
  imgWidth: number,
  imgHeight: number,
): [number, number] {
  let dims: [number, number];
  if (size === "A4") dims = [...PageSizes.A4] as [number, number];
  else if (size === "Letter") dims = [...PageSizes.Letter] as [number, number];
  else if (size === "Legal") dims = [...PageSizes.Legal] as [number, number];
  else dims = [imgWidth, imgHeight];

  if (orientation === "auto") {
    const landscape = imgWidth > imgHeight;
    if (landscape && dims[0] < dims[1]) dims = [dims[1], dims[0]];
    else if (!landscape && dims[0] > dims[1]) dims = [dims[1], dims[0]];
  } else if (orientation === "landscape" && dims[0] < dims[1]) {
    dims = [dims[1], dims[0]];
  } else if (orientation === "portrait" && dims[0] > dims[1]) {
    dims = [dims[1], dims[0]];
  }

  return dims;
}

async function loadImageElement(file: File | Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

async function rasterizeRotated(
  file: File,
  rotation: number,
): Promise<{ bytes: ArrayBuffer; png: boolean }> {
  const img = await loadImageElement(file);
  const rotated90 = rotation === 90 || rotation === 270;
  const canvas = document.createElement("canvas");
  canvas.width = rotated90 ? img.height : img.width;
  canvas.height = rotated90 ? img.width : img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to get canvas context");
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  const isPng = file.type.toLowerCase().includes("png");
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      isPng ? "image/png" : "image/jpeg",
      isPng ? undefined : 0.95,
    );
  });
  return { bytes: await blob.arrayBuffer(), png: isPng };
}

function resolveMargin(margin: JpgMargin): number {
  switch (margin) {
    case "small":
      return 24;
    case "normal":
      return 40;
    case "large":
      return 60;
    case "none":
    default:
      return 0;
  }
}

/** Convert a list of image files into a PDF (one image per page by default). */
export async function jpgToPdf(
  files: File[],
  options: JpgToPdfOptions = {},
  onProgress?: ProgressCallback,
  outputName?: string,
): Promise<PdfResult> {
  if (files.length === 0) throw new Error("Add at least one image.");

  const doc = await PDFDocument.create();
  doc.setCreator("tool_sadhan");
  doc.setProducer("tool_sadhan");

  const pageSize = options.pageSize ?? "fit";
  const orientation = options.orientation ?? "portrait";
  const margin = resolveMargin(options.margin ?? "none");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rotation =
      (((options.rotations?.[i] ?? 0) % 360) + 360) % 360;

    let embedBytes: ArrayBuffer;
    let embedAsPng = false;

    if (rotation !== 0 && typeof document !== "undefined") {
      const rotated = await rasterizeRotated(file, rotation);
      embedBytes = rotated.bytes;
      embedAsPng = rotated.png;
    } else {
      embedBytes = await readFileAsArrayBuffer(file);
      embedAsPng = file.type.toLowerCase().includes("png");
    }

    const image = embedAsPng
      ? await doc.embedPng(embedBytes)
      : await doc.embedJpg(embedBytes);

    const [pageWidth, pageHeight] = resolvePageDimensions(
      pageSize,
      orientation,
      image.width,
      image.height,
    );

    const page = doc.addPage([pageWidth, pageHeight]);
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;
    const scaled = image.scaleToFit(availableWidth, availableHeight);
    const x = (pageWidth - scaled.width) / 2;
    const y = (pageHeight - scaled.height) / 2;

    page.drawImage(image, {
      x,
      y,
      width: scaled.width,
      height: scaled.height,
    });

    onProgress?.(Math.round(((i + 1) / files.length) * 90));
  }

  const blob = await savePdfToBlob(doc);
  onProgress?.(100, "Done");
  return {
    blob,
    name: outputName ?? `${stripPdfExtension(files[0].name)}.pdf`,
    size: blob.size,
  };
}

export type JpgFormat = "jpg" | "png" | "webp";

export interface PdfToJpgOptions {
  format?: JpgFormat;
  /** Quality 0..1 (JPEG/WebP only). Defaults to 0.92. */
  quality?: number;
  /** DPI-ish scale factor. 1.0 ≈ 72 dpi, 2.0 ≈ 144 dpi, etc. */
  scale?: number;
  /** Specific 1-based page numbers to export. Omit or empty for all pages. */
  pages?: number[];
}

const FORMAT_INFO: Record<JpgFormat, { mime: string; ext: string }> = {
  jpg: { mime: "image/jpeg", ext: "jpg" },
  png: { mime: "image/png", ext: "png" },
  webp: { mime: "image/webp", ext: "webp" },
};

/** Render selected pages of a PDF to images. Returns a ZIP or the single image. */
export async function pdfToJpg(
  file: File,
  options: PdfToJpgOptions = {},
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const format = options.format ?? "jpg";
  const quality = Math.min(1, Math.max(0, options.quality ?? 0.92));
  const scale = options.scale ?? 2;
  const baseName = stripPdfExtension(file.name);

  // Fast path: offload rendering + encoding to a Web Worker. Keeps the main
  // thread responsive during multi-page jobs.
  if (canUsePdfWorker()) {
    try {
      const buffer = await readFileAsArrayBuffer(file);
      const result = await runPdfToJpgInWorker(
        buffer,
        {
          format,
          quality,
          scale,
          pages: options.pages,
          baseName,
        },
        onProgress,
      );
      return { blob: result.blob, name: result.name, size: result.size };
    } catch (err) {
      console.warn("pdfToJpg worker failed, falling back to main thread:", err);
    }
  }

  const pdfjs = await getPdfJs();
  const data = await readFileAsArrayBuffer(file);
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const total = doc.numPages;
  const { mime, ext } = FORMAT_INFO[format];

  const targetPages = (options.pages ?? [])
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= total);
  const pagesToRender =
    targetPages.length > 0
      ? Array.from(new Set(targetPages)).sort((a, b) => a - b)
      : Array.from({ length: total }, (_, i) => i + 1);

  const pagePad = String(pagesToRender[pagesToRender.length - 1]).length;

  const rendered: Array<{ name: string; bytes: Uint8Array }> = [];

  for (let idx = 0; idx < pagesToRender.length; idx++) {
    const pageNum = pagesToRender[idx];
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to get canvas context");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        mime,
        format === "png" ? undefined : quality,
      );
    });

    const bytes = new Uint8Array(await blob.arrayBuffer());
    rendered.push({
      name: `${baseName}_page_${String(pageNum).padStart(
        pagePad,
        "0",
      )}.${ext}`,
      bytes,
    });

    onProgress?.(
      Math.round(((idx + 1) / pagesToRender.length) * 90),
      `Rendered page ${pageNum}`,
    );
  }

  await doc.cleanup();
  await doc.destroy();

  if (rendered.length === 1) {
    const only = rendered[0];
    const buffer = new ArrayBuffer(only.bytes.byteLength);
    new Uint8Array(buffer).set(only.bytes);
    const blob = new Blob([buffer], { type: mime });
    onProgress?.(100, "Done");
    return { blob, name: only.name, size: blob.size };
  }

  const zip = new JSZip();
  for (const r of rendered) zip.file(r.name, r.bytes);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  onProgress?.(100, "Done");
  return {
    blob: zipBlob,
    name: `${baseName}_images.zip`,
    size: zipBlob.size,
  };
}

/** Render pages to JPG/PNG and embed back into a PDF — effective lossy compression. */
export async function rasterizeAndRebuildPdf(
  file: File,
  options: {
    scale?: number;
    quality?: number;
    grayscale?: boolean;
  } = {},
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const scale = options.scale ?? 1.5;
  const quality = options.quality ?? 0.75;
  const grayscale = options.grayscale ?? false;
  const outputName = `${stripPdfExtension(file.name)}_compressed.pdf`;

  // Offload rasterization + re-embedding to the worker so the UI thread stays
  // interactive while we chew through every page.
  if (canUsePdfWorker()) {
    try {
      const buffer = await readFileAsArrayBuffer(file);
      const result = await runRasterizeInWorker(
        buffer,
        { scale, quality, grayscale, outputName },
        onProgress,
      );
      return { blob: result.blob, name: result.name, size: result.size };
    } catch (err) {
      console.warn(
        "rasterizeAndRebuildPdf worker failed, falling back to main thread:",
        err,
      );
    }
  }

  const pdfjs = await getPdfJs();
  const data = await readFileAsArrayBuffer(file);
  const sourceDoc = await pdfjs.getDocument({ data: new Uint8Array(data) })
    .promise;
  const total = sourceDoc.numPages;

  const out = await PDFDocument.create();
  out.setCreator("tool_sadhan");
  out.setProducer("tool_sadhan");

  for (let i = 1; i <= total; i++) {
    const page = await sourceDoc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to get canvas context");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;

    if (grayscale) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let p = 0; p < d.length; p += 4) {
        const g = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
        d[p] = d[p + 1] = d[p + 2] = g;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        "image/jpeg",
        quality,
      );
    });

    const imgBytes = new Uint8Array(await blob.arrayBuffer());
    const embedded = await out.embedJpg(imgBytes);
    const newPage = out.addPage([viewport.width, viewport.height]);
    newPage.drawImage(embedded, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });

    onProgress?.(
      Math.round((i / total) * 90),
      `Processing page ${i}/${total}`,
    );
  }

  await sourceDoc.cleanup();
  await sourceDoc.destroy();

  const blob = await savePdfToBlob(out);
  onProgress?.(100, "Done");
  return {
    blob,
    name: outputName,
    size: blob.size,
  };
}

/** Light-weight re-save path: strip metadata, turn on object streams. */
export async function resavePdf(
  file: File,
  options: { stripMetadata?: boolean } = {},
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const doc = await loadPdfDocument(file, { ignoreEncryption: true });
  if (options.stripMetadata !== false) {
    doc.setTitle("");
    doc.setAuthor("");
    doc.setSubject("");
    doc.setKeywords([]);
    doc.setProducer("tool_sadhan");
    doc.setCreator("tool_sadhan");
  }
  onProgress?.(50, "Re-saving");
  const blob = await savePdfToBlob(doc);
  onProgress?.(100, "Done");
  return {
    blob,
    name: `${stripPdfExtension(file.name)}_optimized.pdf`,
    size: blob.size,
  };
}
