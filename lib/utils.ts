import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Trigger a browser download for the given blob/file.
 *
 * Creates a temporary object URL, clicks a hidden anchor, and cleans up.
 * Falls back silently on the server (no-op during SSR).
 */
export function downloadBlob(blob: Blob, filename: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Revoke on next tick so Safari/Firefox have time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
