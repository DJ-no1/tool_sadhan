"use client";

import { useState, useCallback } from "react";
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
  } | null>(null);

  const [pageSelection, setPageSelection] = useState("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const totalPages = 20; // Simulated

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    setSelectedPages([]);
  }, []);

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
    if (files.length === 0 || selectedPages.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [25, 50, 75, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setProgress(p);
    }

    setResultFile({
      name: "extracted_pages.pdf",
      size: (files[0].file.size / totalPages) * selectedPages.length,
    });

    setStatus("completed");
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setSelectedPages([]);
  };

  const handleDownload = () => {
    console.log("Downloading extracted pages");
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
                      className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 text-sm hover:bg-zinc-700 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={selectNone}
                      className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 text-sm hover:bg-zinc-700 transition-colors"
                    >
                      Select None
                    </button>
                    <button
                      type="button"
                      onClick={selectOdd}
                      className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 text-sm hover:bg-zinc-700 transition-colors"
                    >
                      Odd Pages
                    </button>
                    <button
                      type="button"
                      onClick={selectEven}
                      className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 text-sm hover:bg-zinc-700 transition-colors"
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
                      className="bg-zinc-800 border-zinc-700"
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
                                : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                            }`}
                          >
                            <FileText className={`h-4 w-4 mb-1 ${isSelected ? "text-red-500" : "text-zinc-500"}`} />
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
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">
                      {selectedPages.length} of {totalPages} pages selected
                    </span>
                    {selectedPages.length > 0 && (
                      <span className="text-zinc-500">
                        Pages: {selectedPages.join(", ")}
                      </span>
                    )}
                  </div>
                </OptionsPanel>

                <ActionButton
                  icon={FileOutput}
                  onClick={handleExtract}
                  disabled={selectedPages.length === 0}
                  className="w-full"
                >
                  Extract {selectedPages.length} Pages
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Extracting pages..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
