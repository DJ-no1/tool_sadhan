"use client";

import { useState, useCallback } from "react";
import { Split, FileText, Hash, ArrowRight } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  OptionCard,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SplitMode = "range" | "extract" | "every";

interface PDFFile {
  id: string;
  file: File;
}

export default function SplitPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Split options
  const [mode, setMode] = useState<SplitMode>("range");
  const [pageRanges, setPageRanges] = useState("1-5, 10-15");
  const [extractPages, setExtractPages] = useState("1, 3, 5, 7");
  const [splitEvery, setSplitEvery] = useState(5);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
  }, []);

  const handleSplit = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [20, 40, 60, 80, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(p);
    }

    setResultFile({
      name: "split_pages.zip",
      size: files[0].file.size * 0.8,
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
    console.log("Downloading split PDFs");
  };

  const modes = [
    {
      id: "range" as const,
      name: "Page Range",
      description: "Split by custom page ranges (e.g., 1-5, 10-15)",
      icon: ArrowRight,
    },
    {
      id: "extract" as const,
      name: "Extract Pages",
      description: "Extract specific pages (e.g., 1, 3, 5)",
      icon: FileText,
    },
    {
      id: "every" as const,
      name: "Split Every N Pages",
      description: "Split into multiple PDFs with fixed page count",
      icon: Hash,
    },
  ];

  return (
    <PDFToolLayout
      title="Split PDF"
      description="Extract pages or split your PDF into multiple documents. Choose custom ranges or split at fixed intervals."
      icon={Split}
      features={["Custom ranges", "Extract specific pages", "Batch download"]}
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
                  <OptionGroup title="Split Mode">
                    <div className="space-y-3">
                      {modes.map((m) => (
                        <OptionCard
                          key={m.id}
                          selected={mode === m.id}
                          onClick={() => setMode(m.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              mode === m.id ? "bg-red-500/20" : "bg-zinc-800"
                            }`}>
                              <m.icon className={`h-5 w-5 ${
                                mode === m.id ? "text-red-500" : "text-zinc-400"
                              }`} />
                            </div>
                            <div>
                              <span className="font-medium">{m.name}</span>
                              <p className="text-sm text-zinc-400">{m.description}</p>
                            </div>
                          </div>
                        </OptionCard>
                      ))}
                    </div>
                  </OptionGroup>

                  {/* Mode-specific options */}
                  <div className="mt-6 pt-6 border-t border-zinc-800">
                    {mode === "range" && (
                      <OptionGroup
                        title="Page Ranges"
                        description="Enter ranges separated by commas (e.g., 1-5, 10-15, 20)"
                      >
                        <Input
                          value={pageRanges}
                          onChange={(e) => setPageRanges(e.target.value)}
                          placeholder="1-5, 10-15, 20"
                          className="bg-zinc-800 border-zinc-700"
                        />
                        <p className="text-xs text-zinc-500 mt-2">
                          Each range will be saved as a separate PDF file
                        </p>
                      </OptionGroup>
                    )}

                    {mode === "extract" && (
                      <OptionGroup
                        title="Pages to Extract"
                        description="Enter page numbers separated by commas"
                      >
                        <Input
                          value={extractPages}
                          onChange={(e) => setExtractPages(e.target.value)}
                          placeholder="1, 3, 5, 7, 9"
                          className="bg-zinc-800 border-zinc-700"
                        />
                        <p className="text-xs text-zinc-500 mt-2">
                          All selected pages will be combined into a single PDF
                        </p>
                      </OptionGroup>
                    )}

                    {mode === "every" && (
                      <OptionGroup
                        title="Split Every"
                        description="Create a new PDF every N pages"
                      >
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            value={splitEvery}
                            onChange={(e) => setSplitEvery(parseInt(e.target.value) || 1)}
                            min={1}
                            max={100}
                            className="w-24 bg-zinc-800 border-zinc-700"
                          />
                          <span className="text-zinc-400">pages</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                          Creates multiple PDFs, each containing {splitEvery} pages
                        </p>
                      </OptionGroup>
                    )}
                  </div>
                </OptionsPanel>

                <ActionButton
                  icon={Split}
                  onClick={handleSplit}
                  className="w-full"
                >
                  Split PDF
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Splitting your PDF..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
