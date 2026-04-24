"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PDFPreviewProps {
  file: File;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  showThumbnails?: boolean;
  showToolbar?: boolean;
}

export function PDFPreview({
  file,
  className,
  showToolbar = true,
}: PDFPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPDF = useCallback(() => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Failed to load PDF. Please try again.");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    loadPDF();
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-[--border] bg-[--surface] py-12",
          className,
        )}
      >
        <Loader2 className="mb-3 h-5 w-5 animate-spin text-[--muted-foreground]" />
        <p className="text-[13px] text-[--muted-foreground]">Loading PDF...</p>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-[--border] bg-[--surface] py-12",
          className,
        )}
      >
        <FileText className="mb-3 h-8 w-8 text-[--muted-foreground]" />
        <p className="mb-3 text-[13px] text-red-500">
          {error || "Failed to load PDF"}
        </p>
        <Button onClick={loadPDF} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-[--border] bg-[--surface]",
        className,
      )}
    >
      {showToolbar && (
        <div className="flex items-center justify-between border-b border-[--border] bg-[--surface-2] p-3">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-red-500" />
            <span className="max-w-[200px] truncate text-[13px] text-[--foreground]">
              {file.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[--muted-foreground]">
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            <span>·</span>
            <span>Use browser controls to navigate</span>
          </div>
        </div>
      )}

      <div className="bg-[--background]" style={{ height: "600px" }}>
        <iframe
          src={pdfUrl}
          className="h-full w-full border-0"
          title="PDF Preview"
        />
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-[--border] bg-[--surface-2] p-2 text-[11px] text-[--muted-foreground]">
        <span>Use the built-in PDF viewer controls to zoom and navigate</span>
      </div>
    </div>
  );
}
