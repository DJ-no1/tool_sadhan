"use client";

import { useEffect, useState, useCallback } from "react";
import { FileOutput, FileText, Check } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Input } from "@/components/ui/input";
import { extractPages, getPageCount, parsePageList } from "@/lib/tools/pdf";

interface PDFFile {
  id: string;
  file: File;
}

export default function ExtractPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
    blob?: Blob;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pageSelection, setPageSelection] = useState("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    setSelectedPages([]);
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
    if (selectedPages.includes(pageNum)) {
      setSelectedPages(selectedPages.filter(p => p !== pageNum));
    } else {
      setSelectedPages([...selectedPages, pageNum].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  };

  const selectNone = () => {
    setSelectedPages([]);
  };

  const selectOdd = () => {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p % 2 === 1));
  };

  const selectEven = () => {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p % 2 === 0));
  };

  const handleExtract = async () => {
    if (files.length === 0) return;

    // Combine typed ranges and grid selection, preferring explicit input when set.
    const typed = parsePageList(pageSelection, totalPages).map((i) => i + 1);
    const combined = Array.from(
      new Set<number>([...typed, ...selectedPages]),
    ).sort((a, b) => a - b);

    if (combined.length === 0) {
      setErrorMessage("Select at least one page to extract.");
      setStatus("error");
      return;
    }

    setStatus("processing");
    setProgress(0);
    setErrorMessage(null);

    try {
      const result = await extractPages(
        files[0].file,
        combined.join(","),
        (p) => setProgress(p),
      );
      setResultFile(result);
      setStatus("completed");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to extract pages.",
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setSelectedPages([]);
    setErrorMessage(null);
  };


  return (
    <PDFToolLayout
      title="Extract Pages"
      description="Extract specific pages from your PDF to create a new document. Select individual pages or use quick selection."
      icon={FileOutput}
      features={["Visual selection", "Quick select options", "Preserves quality"]}
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
                  {/* Quick Selection */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="px-3 py-1.5 rounded-lg border border-border-strong bg-surface-2 text-sm hover:bg-surface-3 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={selectNone}
                      className="px-3 py-1.5 rounded-lg border border-border-strong bg-surface-2 text-sm hover:bg-surface-3 transition-colors"
                    >
                      Select None
                    </button>
                    <button
                      type="button"
                      onClick={selectOdd}
                      className="px-3 py-1.5 rounded-lg border border-border-strong bg-surface-2 text-sm hover:bg-surface-3 transition-colors"
                    >
                      Odd Pages
                    </button>
                    <button
                      type="button"
                      onClick={selectEven}
                      className="px-3 py-1.5 rounded-lg border border-border-strong bg-surface-2 text-sm hover:bg-surface-3 transition-colors"
                    >
                      Even Pages
                    </button>
                  </div>

                  {/* Manual input */}
                  <OptionGroup
                    title="Or enter page numbers"
                    description="e.g., 1, 3, 5-10, 15"
                  >
                    <Input
                      value={pageSelection}
                      onChange={(e) => setPageSelection(e.target.value)}
                      placeholder="1, 3, 5-10, 15"
                      className="bg-surface-2 border-border-strong"
                    />
                  </OptionGroup>

                  {/* Page Grid */}
                  <OptionGroup title="Select Pages" className="mt-6">
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isSelected = selectedPages.includes(pageNum);
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => togglePage(pageNum)}
                            className={`aspect-[3/4] rounded-lg border flex flex-col items-center justify-center transition-all relative ${
                              isSelected
                                ? "border-red-500 bg-red-500/20"
                                : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                            }`}
                          >
                            <FileText className={`h-4 w-4 mb-1 ${isSelected ? "text-red-500" : "text-muted-foreground"}`} />
                            <span className={`text-xs font-medium ${isSelected ? "text-red-500" : ""}`}>{pageNum}</span>
                            {isSelected && (
                              <div className="absolute top-1 right-1">
                                <Check className="h-3 w-3 text-red-500" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </OptionGroup>

                  {/* Selection summary */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {selectedPages.length} of {totalPages} pages selected
                    </span>
                    {selectedPages.length > 0 && (
                      <span className="text-muted-foreground">
                        Pages: {selectedPages.join(", ")}
                      </span>
                    )}
                  </div>
                </OptionsPanel>

                <ActionButton
                  icon={FileOutput}
                  onClick={handleExtract}
                  disabled={
                    selectedPages.length === 0 && !pageSelection.trim()
                  }
                  className="w-full"
                >
                  Extract{selectedPages.length > 0
                    ? ` ${selectedPages.length}`
                    : ""} Pages
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
              ? "Extracting pages..."
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
