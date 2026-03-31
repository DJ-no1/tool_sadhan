"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Grid, Maximize2, Loader2, FileText } from "lucide-react";
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

  // Create blob URL for the PDF file
  const loadPDF = useCallback(() => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Revoke previous URL if exists
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // Create blob URL for the file
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Failed to load PDF. Please try again.");
      setIsLoading(false);
    }
  }, [file]);

  useEffect(() => {
    loadPDF();

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [file]);

  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 rounded-2xl border border-zinc-800 bg-zinc-900/50", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-red-500 mb-4" />
        <p className="text-zinc-400">Loading PDF...</p>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 rounded-2xl border border-zinc-800 bg-zinc-900/50", className)}>
        <FileText className="h-12 w-12 text-zinc-600 mb-4" />
        <p className="text-red-500 mb-4">{error || "Failed to load PDF"}</p>
        <Button onClick={loadPDF} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden", className)}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-red-500" />
            <span className="text-sm text-zinc-400 truncate max-w-[200px]">
              {file.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            <span>•</span>
            <span>Use browser controls to navigate</span>
          </div>
        </div>
      )}

      {/* Native PDF Viewer using iframe */}
      <div className="bg-zinc-950" style={{ height: "600px" }}>
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          title="PDF Preview"
        />
      </div>

      {/* Footer hint */}
      <div className="flex items-center justify-center gap-2 p-2 border-t border-zinc-800 bg-zinc-900/50 text-xs text-zinc-500">
        <span>📄 Use the built-in PDF viewer controls to zoom, navigate pages, and more</span>
      </div>
    </div>
  );
}
