"use client";

import { useEffect, useState, useCallback } from "react";
import { Scissors, Trash2, FileText, X } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { getPageCount, removePages } from "@/lib/tools/pdf";

interface PDFFile {
  id: string;
  file: File;
}

export default function RemovePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
    blob?: Blob;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pagesToRemove, setPagesToRemove] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    setPagesToRemove([]);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const first = files[0]?.file;
      const count = first ? await getPageCount(first) : 0;
      if (!cancelled) setTotalPages(count);
    })();
    return () => {
      cancelled = true;
    };
  }, [files]);

  const togglePage = (pageNum: number) => {
    if (pagesToRemove.includes(pageNum)) {
      setPagesToRemove(pagesToRemove.filter(p => p !== pageNum));
    } else {
      setPagesToRemove([...pagesToRemove, pageNum].sort((a, b) => a - b));
    }
  };

  const handleRemove = async () => {
    if (files.length === 0 || pagesToRemove.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setErrorMessage(null);

    try {
      const result = await removePages(files[0].file, pagesToRemove, (p) =>
        setProgress(p),
      );
      setResultFile(result);
      setStatus("completed");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to remove pages.",
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setPagesToRemove([]);
    setErrorMessage(null);
  };


  const remainingPages = totalPages - pagesToRemove.length;

  return (
    <PDFToolLayout
      title="Remove Pages"
      description="Delete unwanted pages from your PDF. Select the pages you want to remove."
      icon={Scissors}
      features={["Visual selection", "Keep remaining pages", "Instant removal"]}
    >
      <div className="space-y-6">
        {status === "idle" && (
          <>
            <PDFDropzone
              multiple={false}
              maxSize={100}
              onFilesChange={handleFilesChange}
            />

            {files.length > 0 && (
              <>
                <OptionsPanel>
                  <OptionGroup
                    title="Select Pages to Remove"
                    description="Click on pages you want to delete. Red pages will be removed."
                  >
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isMarkedForRemoval = pagesToRemove.includes(pageNum);
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => togglePage(pageNum)}
                            className={`aspect-[3/4] rounded-lg border flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                              isMarkedForRemoval
                                ? "border-red-500 bg-red-500/20"
                                : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                            }`}
                          >
                            {isMarkedForRemoval && (
                              <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-full h-0.5 bg-red-500 rotate-45 absolute" />
                                </div>
                              </div>
                            )}
                            <FileText className={`h-4 w-4 mb-1 ${isMarkedForRemoval ? "text-red-500" : "text-muted-foreground"}`} />
                            <span className={`text-xs font-medium ${isMarkedForRemoval ? "text-red-500" : ""}`}>{pageNum}</span>
                            {isMarkedForRemoval && (
                              <div className="absolute top-1 right-1">
                                <X className="h-3 w-3 text-red-500" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </OptionGroup>

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-muted-foreground">
                        Removing {pagesToRemove.length} page{pagesToRemove.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-green-500">
                        {remainingPages} page{remainingPages !== 1 ? "s" : ""} will remain
                      </span>
                    </div>

                    {pagesToRemove.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">Pages to remove:</span>
                        {pagesToRemove.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => togglePage(p)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 border border-red-500/30 text-xs text-red-400 hover:bg-red-500/30"
                          >
                            Page {p}
                            <X className="h-3 w-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </OptionsPanel>

                {pagesToRemove.length > 0 && remainingPages < 1 && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
                    <p className="text-red-400">You cannot remove all pages. At least one page must remain.</p>
                  </div>
                )}

                <ActionButton
                  icon={Trash2}
                  onClick={handleRemove}
                  disabled={pagesToRemove.length === 0 || remainingPages < 1}
                  className="w-full"
                >
                  Remove {pagesToRemove.length} Page{pagesToRemove.length !== 1 ? "s" : ""}
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={
            status === "processing"
              ? "Removing pages..."
              : status === "error"
                ? (errorMessage ?? undefined)
                : undefined
          }
          resultFile={resultFile || undefined}
          sourceFile={files[0]?.file ?? null}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
