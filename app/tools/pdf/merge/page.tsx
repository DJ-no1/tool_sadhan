"use client";

import { useState, useCallback } from "react";
import { Merge, Info } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const handleMerge = async () => {
    if (files.length < 2) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [15, 30, 45, 60, 75, 90, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setProgress(p);
    }

    const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
    setResultFile({
      name: "merged_document.pdf",
      size: totalSize * 0.95,
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

  return (
    <PDFToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag to reorder."
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

            {files.length >= 2 && (
              <ActionButton icon={Merge} onClick={handleMerge}>
                Merge {files.length} PDFs
              </ActionButton>
            )}

            {files.length === 1 && (
              <Alert className="border-border bg-surface">
                <Info className="h-4 w-4 text-muted-foreground" />
                <AlertDescription className="text-muted-foreground">
                  Add at least one more PDF to start merging.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={
            status === "processing" ? "Merging your PDFs..." : undefined
          }
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
