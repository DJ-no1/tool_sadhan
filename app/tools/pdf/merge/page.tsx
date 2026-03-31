"use client";

import { useState, useCallback } from "react";
import { Merge, GripVertical, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Button } from "@/components/ui/button";

interface PDFFile {
  id: string;
  file: File;
}

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
  }, []);

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;

    setStatus("processing");
    setProgress(0);

    // Simulate merge process
    const intervals = [15, 30, 45, 60, 75, 90, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setProgress(p);
    }

    // Simulate result
    const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
    setResultFile({
      name: "merged_document.pdf",
      size: totalSize * 0.95, // Slight compression
    });

    setStatus("completed");
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
  };

  const handleDownload = () => {
    console.log("Downloading merged PDF");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <PDFToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag and drop to reorder pages."
      icon={Merge}
      features={["Unlimited files", "Drag to reorder", "Preserves quality"]}
    >
      <div className="space-y-6">
        {status === "idle" && (
          <>
            <PDFDropzone
              multiple={true}
              maxFiles={20}
              maxSize={100}
              onFilesChange={handleFilesChange}
              sortable={true}
            />

            {/* File List with Reordering */}
            {files.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">File Order</h3>
                  <span className="text-sm text-zinc-400">
                    Drag or use arrows to reorder
                  </span>
                </div>
                
                <div className="space-y-2">
                  {files.map((pdfFile, index) => (
                    <div
                      key={pdfFile.id}
                      className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-zinc-700"
                    >
                      {/* Drag Handle */}
                      <div className="cursor-grab text-zinc-600 hover:text-zinc-400">
                        <GripVertical className="h-5 w-5" />
                      </div>

                      {/* Order Number */}
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-semibold text-sm">
                        {index + 1}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{pdfFile.file.name}</p>
                        <p className="text-sm text-zinc-400">{formatSize(pdfFile.file.size)}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === 0}
                          onClick={() => moveFile(index, "up")}
                          className="h-8 w-8 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === files.length - 1}
                          onClick={() => moveFile(index, "down")}
                          className="h-8 w-8 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(pdfFile.id)}
                          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-sm">
                  <span className="text-zinc-400">
                    {files.length} files selected
                  </span>
                  <span className="text-zinc-400">
                    Total: {formatSize(files.reduce((acc, f) => acc + f.file.size, 0))}
                  </span>
                </div>
              </div>
            )}

            {/* Merge Button */}
            {files.length >= 2 && (
              <ActionButton
                icon={Merge}
                onClick={handleMerge}
                className="w-full"
              >
                Merge {files.length} PDFs
              </ActionButton>
            )}

            {/* Minimum files notice */}
            {files.length === 1 && (
              <div className="text-center py-4 text-zinc-400">
                Add at least one more PDF to merge
              </div>
            )}
          </>
        )}

        {/* Processing / Result */}
        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Merging your PDFs..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
