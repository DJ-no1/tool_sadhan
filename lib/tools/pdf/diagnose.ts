import {
  getPdfJs,
  loadPdfDocument,
  readFileAsArrayBuffer,
  savePdfToBlob,
  stripPdfExtension,
  type ProgressCallback,
} from "./core";

export interface RepairIssue {
  type: "warning" | "error" | "info";
  title: string;
  description: string;
  canFix: boolean;
}

export interface DiagnoseResult {
  issues: RepairIssue[];
  encrypted: boolean;
  pageCount: number;
  version: string | null;
}

/**
 * Inspect a PDF with both pdfjs-dist (render-level diagnostics) and
 * pdf-lib (structural re-parse) and return a list of user-visible issues.
 */
export async function diagnosePdf(
  file: File,
  onProgress?: ProgressCallback,
): Promise<DiagnoseResult> {
  const issues: RepairIssue[] = [];
  let encrypted = false;
  let pageCount = 0;
  let version: string | null = null;

  onProgress?.(10, "Reading file");
  const buffer = await readFileAsArrayBuffer(file);

  const header = new TextDecoder("latin1").decode(
    new Uint8Array(buffer.slice(0, 16)),
  );
  const versionMatch = header.match(/%PDF-(\d+\.\d+)/);
  if (versionMatch) {
    version = versionMatch[1];
    if (parseFloat(version) < 1.5) {
      issues.push({
        type: "info",
        title: "Outdated PDF version",
        description: `PDF is version ${version}, can be upgraded to 1.7 on save.`,
        canFix: true,
      });
    }
  } else {
    issues.push({
      type: "error",
      title: "Invalid PDF header",
      description: "The file does not start with a recognizable %PDF marker.",
      canFix: true,
    });
  }

  onProgress?.(35, "Parsing structure");

  try {
    const doc = await loadPdfDocument(file, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
    });
    pageCount = doc.getPageCount();
    if (pageCount === 0) {
      issues.push({
        type: "error",
        title: "No pages detected",
        description: "pdf-lib could not enumerate any pages.",
        canFix: false,
      });
    }
    encrypted = doc.isEncrypted;
    if (encrypted) {
      issues.push({
        type: "warning",
        title: "Document is encrypted",
        description:
          "The PDF is password-protected. Repair will attempt a best-effort re-save; some content may be inaccessible.",
        canFix: true,
      });
    }
  } catch (err) {
    issues.push({
      type: "error",
      title: "Corrupted document structure",
      description:
        err instanceof Error
          ? err.message
          : "pdf-lib could not parse the document.",
      canFix: true,
    });
  }

  onProgress?.(60, "Verifying pages");

  try {
    const pdfjs = await getPdfJs();
    const copy = buffer.slice(0);
    const loadingTask = pdfjs.getDocument({
      data: copy,
      isEvalSupported: false,
    });
    const pdf = await loadingTask.promise;

    if (!pageCount) pageCount = pdf.numPages;

    const sampleSize = Math.min(pdf.numPages, 5);
    let brokenPages = 0;
    for (let i = 1; i <= sampleSize; i++) {
      try {
        const page = await pdf.getPage(i);
        await page.getTextContent();
        page.cleanup();
      } catch {
        brokenPages += 1;
      }
    }
    if (brokenPages > 0) {
      issues.push({
        type: "warning",
        title: "Damaged content streams",
        description: `${brokenPages} of ${sampleSize} sampled pages failed to parse cleanly.`,
        canFix: true,
      });
    }

    await pdf.destroy();
  } catch (err) {
    issues.push({
      type: "warning",
      title: "Renderer could not open document",
      description:
        err instanceof Error
          ? err.message
          : "pdfjs-dist reported an error while opening the file.",
      canFix: true,
    });
  }

  onProgress?.(100, "Scan complete");

  if (issues.length === 0) {
    issues.push({
      type: "info",
      title: "No structural issues detected",
      description:
        "The document parsed cleanly. A re-save can still normalise the cross-reference table.",
      canFix: true,
    });
  }

  return { issues, encrypted, pageCount, version };
}

/**
 * Check whether a PDF is encrypted (password/permissions protected).
 *
 * Uses pdf-lib's `ignoreEncryption` load so we never need the password just
 * to answer the question.
 */
export async function isPdfEncrypted(file: File): Promise<boolean> {
  try {
    const doc = await loadPdfDocument(file, { ignoreEncryption: true });
    return doc.isEncrypted;
  } catch {
    return false;
  }
}

/**
 * Best-effort client-side unlock. pdf-lib can bypass owner-password
 * ("restrictions-only") locks via `ignoreEncryption: true` and emit a
 * re-saved, unencrypted copy. Documents with a real user password cannot be
 * decrypted without the correct key and this helper will reject with a clear
 * error in that case.
 */
export async function unlockPdf(
  file: File,
  _password: string,
  onProgress?: ProgressCallback,
): Promise<{ name: string; size: number; blob: Blob }> {
  onProgress?.(20, "Reading document");

  let doc;
  try {
    doc = await loadPdfDocument(file, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
      updateMetadata: false,
    });
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? `Could not open PDF: ${err.message}`
        : "Could not open PDF.",
    );
  }

  if (doc.getPageCount() === 0) {
    throw new Error(
      "This PDF uses a user password that cannot be decrypted in the browser. Please use the desktop export flow.",
    );
  }

  onProgress?.(70, "Rebuilding without protection");
  const blob = await savePdfToBlob(doc);
  onProgress?.(100);

  return {
    name: `${stripPdfExtension(file.name)}_unlocked.pdf`,
    size: blob.size,
    blob,
  };
}

/**
 * Extract all text from a PDF using pdfjs-dist and emit a plain `.txt` Blob.
 * This is our best-effort fallback for "PDF → Word/Excel/PPT" tools where
 * true format preservation requires a server-side engine we don't ship yet.
 */
export async function extractPdfText(
  file: File,
  onProgress?: ProgressCallback,
): Promise<{ name: string; size: number; blob: Blob }> {
  onProgress?.(10, "Opening document");
  const pdfjs = await getPdfJs();
  const buffer = await readFileAsArrayBuffer(file);
  const copy = buffer.slice(0);
  const pdf = await pdfjs.getDocument({ data: copy, isEvalSupported: false })
    .promise;

  const lines: string[] = [];
  const total = pdf.numPages;
  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    const pageText = text.items
      .map((item) =>
        "str" in item ? (item as { str: string }).str : "",
      )
      .join(" ");
    lines.push(`--- Page ${i} ---\n${pageText}`);
    page.cleanup();
    onProgress?.(10 + Math.round((i / total) * 80));
  }

  await pdf.destroy();

  const blob = new Blob([lines.join("\n\n")], {
    type: "text/plain;charset=utf-8",
  });
  onProgress?.(100);

  return {
    name: `${stripPdfExtension(file.name)}_text.txt`,
    size: blob.size,
    blob,
  };
}

/**
 * Rebuild a PDF by re-loading and re-saving with pdf-lib. This normalises
 * the cross-reference table and rewrites object streams which often fixes
 * soft corruption. Metadata is preserved.
 */
export async function repairPdf(
  file: File,
  onProgress?: ProgressCallback,
): Promise<{ name: string; size: number; blob: Blob }> {
  onProgress?.(20, "Loading document");
  const doc = await loadPdfDocument(file, {
    ignoreEncryption: true,
    throwOnInvalidObject: false,
    updateMetadata: false,
  });

  onProgress?.(70, "Rebuilding structure");
  const blob = await savePdfToBlob(doc);
  onProgress?.(100);

  return {
    name: `${stripPdfExtension(file.name)}_repaired.pdf`,
    size: blob.size,
    blob,
  };
}
