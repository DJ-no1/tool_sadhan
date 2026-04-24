import {
  StandardFonts,
  rgb,
  degrees,
  type PDFFont,
  type Color,
} from "pdf-lib";
import {
  loadPdfDocument,
  savePdfToBlob,
  stripPdfExtension,
  type ProgressCallback,
} from "./core";
import type { PdfResult } from "./page-ops";

export type NumberPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type NumberFormat =
  | "page"
  | "page-of-total"
  | "n-of-m"
  | "plain"
  | "dashed"
  | "roman-lower"
  | "roman-upper";

const ROMAN_PAIRS: Array<[number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function toRoman(n: number): string {
  let num = Math.max(0, Math.floor(n));
  let out = "";
  for (const [v, s] of ROMAN_PAIRS) {
    while (num >= v) {
      out += s;
      num -= v;
    }
  }
  return out || "N";
}

export interface PageNumberOptions {
  position: NumberPosition;
  format?: NumberFormat;
  startAt?: number;
  fontSize?: number;
  margin?: number;
  color?: { r: number; g: number; b: number };
  /** Skip numbering on the first page but keep the sequence. */
  skipFirst?: boolean;
}

const BLACK: Color = rgb(0, 0, 0);

function formatLabel(format: NumberFormat, current: number, total: number) {
  switch (format) {
    case "page":
      return `Page ${current}`;
    case "page-of-total":
      return `Page ${current} of ${total}`;
    case "n-of-m":
      return `${current} / ${total}`;
    case "dashed":
      return `- ${current} -`;
    case "roman-lower":
      return toRoman(current).toLowerCase();
    case "roman-upper":
      return toRoman(current);
    case "plain":
    default:
      return `${current}`;
  }
}

function computeTextPosition(
  position: NumberPosition,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  textHeight: number,
  margin: number,
) {
  const [vertical, horizontal] = position.split("-") as [
    "top" | "bottom",
    "left" | "center" | "right",
  ];

  let x = margin;
  if (horizontal === "center") x = (pageWidth - textWidth) / 2;
  else if (horizontal === "right") x = pageWidth - textWidth - margin;

  let y = margin;
  if (vertical === "top") y = pageHeight - textHeight - margin;

  return { x, y };
}

export async function addPageNumbers(
  file: File,
  options: PageNumberOptions,
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const doc = await loadPdfDocument(file, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;
  const fontSize = options.fontSize ?? 11;
  const margin = options.margin ?? 24;
  const startAt = options.startAt ?? 1;
  const color = options.color
    ? rgb(options.color.r / 255, options.color.g / 255, options.color.b / 255)
    : BLACK;

  for (let i = 0; i < total; i++) {
    if (options.skipFirst && i === 0) continue;

    const page = pages[i];
    const label = formatLabel(
      options.format ?? "page-of-total",
      i + startAt,
      total + startAt - 1,
    );
    const textWidth = font.widthOfTextAtSize(label, fontSize);
    const textHeight = font.heightAtSize(fontSize);
    const { width, height } = page.getSize();
    const { x, y } = computeTextPosition(
      options.position,
      width,
      height,
      textWidth,
      textHeight,
      margin,
    );

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color,
    });

    if (i % 10 === 0) {
      onProgress?.(Math.round(((i + 1) / total) * 90));
    }
  }

  const blob = await savePdfToBlob(doc);
  onProgress?.(100, "Done");
  return {
    blob,
    name: `${stripPdfExtension(file.name)}_numbered.pdf`,
    size: blob.size,
  };
}

export type WatermarkPosition =
  | "center"
  | "diagonal"
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "tile";

export interface TextWatermarkOptions {
  kind: "text";
  text: string;
  position?: WatermarkPosition;
  fontSize?: number;
  opacity?: number; // 0..1
  color?: { r: number; g: number; b: number };
  rotation?: number; // degrees
}

export interface ImageWatermarkOptions {
  kind: "image";
  image: File | Blob;
  position?: WatermarkPosition;
  opacity?: number;
  scale?: number;
  rotation?: number;
}

export type WatermarkOptions = TextWatermarkOptions | ImageWatermarkOptions;

function drawTextAtPosition(
  page: ReturnType<ReturnType<typeof loadPdfDocument>["then"]> extends never
    ? never
    : ReturnType<
        Awaited<ReturnType<typeof loadPdfDocument>>["getPages"]
      >[number],
  text: string,
  font: PDFFont,
  fontSize: number,
  color: Color,
  opacity: number,
  position: WatermarkPosition,
  rotation: number,
) {
  const { width, height } = page.getSize();
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const textHeight = font.heightAtSize(fontSize);

  const drawOne = (x: number, y: number, angle: number) => {
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color,
      opacity,
      rotate: degrees(angle),
    });
  };

  if (position === "tile") {
    const stepX = Math.max(200, textWidth * 1.4);
    const stepY = Math.max(160, textHeight * 6);
    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        drawOne(x, y, -30);
      }
    }
    return;
  }

  if (position === "diagonal") {
    drawOne(
      (width - textWidth) / 2,
      (height - textHeight) / 2,
      rotation || -30,
    );
    return;
  }

  const edgeMargin = 32;
  if (position === "top") {
    drawOne((width - textWidth) / 2, height - textHeight - edgeMargin, rotation);
    return;
  }
  if (position === "top-left") {
    drawOne(edgeMargin, height - textHeight - edgeMargin, rotation);
    return;
  }
  if (position === "top-right") {
    drawOne(
      width - textWidth - edgeMargin,
      height - textHeight - edgeMargin,
      rotation,
    );
    return;
  }
  if (position === "bottom") {
    drawOne((width - textWidth) / 2, edgeMargin, rotation);
    return;
  }
  if (position === "bottom-left") {
    drawOne(edgeMargin, edgeMargin, rotation);
    return;
  }
  if (position === "bottom-right") {
    drawOne(width - textWidth - edgeMargin, edgeMargin, rotation);
    return;
  }

  // center (default)
  drawOne((width - textWidth) / 2, (height - textHeight) / 2, rotation);
}

export async function addWatermark(
  file: File,
  options: WatermarkOptions,
  onProgress?: ProgressCallback,
): Promise<PdfResult> {
  const doc = await loadPdfDocument(file, { ignoreEncryption: true });
  const pages = doc.getPages();
  const total = pages.length;
  const opacity = Math.min(1, Math.max(0, options.opacity ?? 0.3));

  if (options.kind === "text") {
    if (!options.text || !options.text.trim()) {
      throw new Error("Enter watermark text first.");
    }
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const color = options.color
      ? rgb(options.color.r / 255, options.color.g / 255, options.color.b / 255)
      : rgb(0.6, 0.6, 0.6);
    const fontSize = options.fontSize ?? 48;

    for (let i = 0; i < total; i++) {
      drawTextAtPosition(
        pages[i],
        options.text,
        font,
        fontSize,
        color,
        opacity,
        options.position ?? "diagonal",
        options.rotation ?? 0,
      );
      if (i % 10 === 0) {
        onProgress?.(Math.round(((i + 1) / total) * 90));
      }
    }
  } else {
    const bytes = await options.image.arrayBuffer();
    const typeGuess = (options.image as File).type?.toLowerCase() ?? "";
    const image = typeGuess.includes("png")
      ? await doc.embedPng(bytes)
      : await doc.embedJpg(bytes);
    const scale = options.scale ?? 0.4;
    const pos = options.position ?? "center";
    const edgeMargin = 32;

    for (let i = 0; i < total; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const dims = image.scaleToFit(width * scale, height * scale);

      let x = (width - dims.width) / 2;
      let y = (height - dims.height) / 2;
      if (pos === "top" || pos === "top-left" || pos === "top-right") {
        y = height - dims.height - edgeMargin;
      } else if (
        pos === "bottom" ||
        pos === "bottom-left" ||
        pos === "bottom-right"
      ) {
        y = edgeMargin;
      }
      if (pos === "top-left" || pos === "bottom-left") x = edgeMargin;
      else if (pos === "top-right" || pos === "bottom-right") {
        x = width - dims.width - edgeMargin;
      }

      page.drawImage(image, {
        x,
        y,
        width: dims.width,
        height: dims.height,
        opacity,
        rotate: degrees(options.rotation ?? 0),
      });
      if (i % 10 === 0) {
        onProgress?.(Math.round(((i + 1) / total) * 90));
      }
    }
  }

  const blob = await savePdfToBlob(doc);
  onProgress?.(100, "Done");
  return {
    blob,
    name: `${stripPdfExtension(file.name)}_watermarked.pdf`,
    size: blob.size,
  };
}
