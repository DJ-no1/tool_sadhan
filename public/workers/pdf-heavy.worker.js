/* eslint-disable */
/**
 * Heavy PDF task worker (Chromium/Firefox module worker).
 *
 * Shipped from /public so Next.js serves it as a static JS asset with the
 * correct MIME type. We pull pdf-lib / pdfjs-dist / jszip from jsDelivr's
 * ESM endpoint so the worker stays self-contained: no bundler involvement,
 * no bare-specifier resolution needed.
 *
 * Tasks supported:
 *   - rasterize : render each page via pdfjs + OffscreenCanvas, re-embed
 *                 as JPEG into a fresh PDF (lossy "Compress PDF").
 *   - pdfToJpg  : render selected pages to JPG/PNG/WebP, zip if >1.
 *
 * Falls back are handled on the main thread (see convert.ts).
 */

// Pin versions here so cache headers work predictably. Keep in sync with
// package.json when you bump deps.
const PDF_LIB_VERSION = "1.17.1";
const PDFJS_VERSION = "5.6.205";
const JSZIP_VERSION = "3.10.1";

const [{ PDFDocument }, pdfjsLib, jszipModule] = await Promise.all([
  import(`https://cdn.jsdelivr.net/npm/pdf-lib@${PDF_LIB_VERSION}/+esm`),
  import(
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.min.mjs`
  ),
  import(`https://cdn.jsdelivr.net/npm/jszip@${JSZIP_VERSION}/+esm`),
]);

const JSZip = jszipModule.default ?? jszipModule;

// Nested workers are supported in Chromium; on engines that forbid them
// pdfjs quietly falls back to running the fake worker inline in this
// worker's thread, which is exactly what we want anyway.
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
} catch (_) {}

const FORMAT_INFO = {
  jpg: { mime: "image/jpeg", ext: "jpg" },
  png: { mime: "image/png", ext: "png" },
  webp: { mime: "image/webp", ext: "webp" },
};

function post(msg, transfer = []) {
  self.postMessage(msg, transfer);
}

async function renderPage(page, scale) {
  const viewport = page.getViewport({ scale });
  const canvas = new OffscreenCanvas(
    Math.floor(viewport.width),
    Math.floor(viewport.height),
  );
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("OffscreenCanvas 2D context unavailable.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  return { canvas, viewport };
}

async function handleRasterize(id, buffer, opts) {
  const sourceDoc = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    isEvalSupported: false,
  }).promise;

  const total = sourceDoc.numPages;
  const out = await PDFDocument.create();
  out.setCreator("tool_sadhan");
  out.setProducer("tool_sadhan");

  for (let i = 1; i <= total; i++) {
    const page = await sourceDoc.getPage(i);
    const { canvas, viewport } = await renderPage(page, opts.scale);

    if (opts.grayscale) {
      const ctx = canvas.getContext("2d");
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let p = 0; p < d.length; p += 4) {
        const g = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
        d[p] = d[p + 1] = d[p + 2] = g;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    const blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: opts.quality,
    });
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const embedded = await out.embedJpg(bytes);
    const newPage = out.addPage([viewport.width, viewport.height]);
    newPage.drawImage(embedded, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });

    page.cleanup();
    post({
      type: "progress",
      id,
      progress: Math.round((i / total) * 90),
      message: `Page ${i}/${total}`,
    });
  }

  await sourceDoc.cleanup();
  await sourceDoc.destroy();

  const savedBytes = await out.save({ useObjectStreams: true });
  const saved = new ArrayBuffer(savedBytes.byteLength);
  new Uint8Array(saved).set(savedBytes);
  const blob = new Blob([saved], { type: "application/pdf" });
  post(
    { type: "done", id, blob, name: opts.outputName, size: blob.size },
    [saved],
  );
}

async function handlePdfToJpg(id, buffer, opts) {
  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    isEvalSupported: false,
  }).promise;

  const total = doc.numPages;
  const { mime, ext } = FORMAT_INFO[opts.format] ?? FORMAT_INFO.jpg;
  const requested = (opts.pages ?? []).filter(
    (n) => Number.isFinite(n) && n >= 1 && n <= total,
  );
  const pagesToRender =
    requested.length > 0
      ? Array.from(new Set(requested)).sort((a, b) => a - b)
      : Array.from({ length: total }, (_, i) => i + 1);
  const pad = String(pagesToRender[pagesToRender.length - 1]).length;

  const rendered = [];
  for (let idx = 0; idx < pagesToRender.length; idx++) {
    const pageNum = pagesToRender[idx];
    const page = await doc.getPage(pageNum);
    const { canvas } = await renderPage(page, opts.scale);
    const blob = await canvas.convertToBlob({
      type: mime,
      quality: opts.format === "png" ? undefined : opts.quality,
    });
    const bytes = new Uint8Array(await blob.arrayBuffer());
    rendered.push({
      name: `${opts.baseName}_page_${String(pageNum).padStart(
        pad,
        "0",
      )}.${ext}`,
      bytes,
    });
    page.cleanup();
    post({
      type: "progress",
      id,
      progress: Math.round(((idx + 1) / pagesToRender.length) * 90),
      message: `Rendered page ${pageNum}`,
    });
  }

  await doc.cleanup();
  await doc.destroy();

  if (rendered.length === 1) {
    const only = rendered[0];
    const buf = new ArrayBuffer(only.bytes.byteLength);
    new Uint8Array(buf).set(only.bytes);
    const blob = new Blob([buf], { type: mime });
    post({ type: "done", id, blob, name: only.name, size: blob.size }, [buf]);
    return;
  }

  const zip = new JSZip();
  for (const r of rendered) zip.file(r.name, r.bytes);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  post({
    type: "done",
    id,
    blob: zipBlob,
    name: `${opts.baseName}_images.zip`,
    size: zipBlob.size,
  });
}

self.addEventListener("message", async (event) => {
  const msg = event.data;
  try {
    if (msg?.type === "rasterize") {
      await handleRasterize(msg.id, msg.buffer, msg.opts);
    } else if (msg?.type === "pdfToJpg") {
      await handlePdfToJpg(msg.id, msg.buffer, msg.opts);
    } else {
      throw new Error(`Unknown task: ${msg?.type}`);
    }
  } catch (err) {
    post({
      type: "error",
      id: msg?.id ?? "unknown",
      message: err instanceof Error ? err.message : String(err),
    });
  }
});
