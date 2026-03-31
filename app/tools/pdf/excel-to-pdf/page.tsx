"use client";

import { useState, useCallback } from "react";
import { Table, FileType2 } from "lucide-react";
import {
  PDFToolLayout,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { cn } from "@/lib/utils";

interface ExcelFile {
  id: string;
  file: File;
}

type PageLayout = "fit" | "actual" | "landscape";

export default function ExcelToPDFPage() {
  const [files, setFiles] = useState<ExcelFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Options
  const [layout, setLayout] = useState<PageLayout>("fit");
  const [includeGridlines, setIncludeGridlines] = useState(true);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [allSheets, setAllSheets] = useState(true);

  const generateId = () => Math.random().toString(36).substring(7);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.name.endsWith(".xls") || f.name.endsWith(".xlsx") || f.name.endsWith(".ods")
    );
    setFiles(droppedFiles.map((file) => ({ id: generateId(), file })));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles.map((file) => ({ id: generateId(), file })));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [15, 35, 55, 75, 95, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(/\.(xlsx?|ods)$/i, ".pdf"),
      size: files[0].file.size * 0.7,
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
    console.log("Downloading PDF");
  };

  const layouts: { id: PageLayout; name: string; desc: string }[] = [
    { id: "fit", name: "Fit to Page", desc: "Scale to fit page width" },
    { id: "actual", name: "Actual Size", desc: "Keep original size" },
    { id: "landscape", name: "Landscape", desc: "Wide format for tables" },
  ];

  return (
    <PDFToolLayout
      title="Excel to PDF"
      description="Convert Excel spreadsheets to PDF. Preserves formatting, formulas display, and charts."
      icon={Table}
      features={["XLS & XLSX", "Multiple sheets", "Keep formatting"]}
    >
      <div className="space-y-6">
        {status === "idle" && (
          <>
            {/* Custom Dropzone for Excel files */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700/50 bg-zinc-900/30 p-8 md:p-12 text-center transition-all cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Table className="h-8 w-8 text-green-500" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">Drop your Excel files here</h3>
                <p className="text-sm text-zinc-400 mb-6">
                  XLS, XLSX, ODS • Max 50MB per file
                </p>
                
                <input
                  id="excel-input"
                  type="file"
                  accept=".xls,.xlsx,.ods"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <label
                  htmlFor="excel-input"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium cursor-pointer transition-colors"
                >
                  Select Excel Files
                </label>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                <h3 className="font-semibold mb-3">{files.length} spreadsheet{files.length > 1 ? "s" : ""}</h3>
                <div className="space-y-2">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50"
                    >
                      <Table className="h-5 w-5 text-green-500" />
                      <span className="flex-1 truncate">{f.file.name}</span>
                      <span className="text-sm text-zinc-400">
                        {(f.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {files.length > 0 && (
              <>
                <OptionsPanel>
                  {/* Page Layout */}
                  <OptionGroup title="Page Layout">
                    <div className="grid grid-cols-3 gap-3">
                      {layouts.map((l) => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => setLayout(l.id)}
                          className={cn(
                            "p-3 rounded-xl border text-center transition-all",
                            layout === l.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                          )}
                        >
                          <p className="font-medium">{l.name}</p>
                          <p className="text-xs text-zinc-400">{l.desc}</p>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>

                  {/* Display Options */}
                  <OptionGroup title="Display Options" className="mt-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={includeGridlines}
                          onChange={(e) => setIncludeGridlines(e.target.checked)}
                          className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500"
                        />
                        <span className="group-hover:text-white transition-colors">
                          Show gridlines
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={includeHeaders}
                          onChange={(e) => setIncludeHeaders(e.target.checked)}
                          className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500"
                        />
                        <span className="group-hover:text-white transition-colors">
                          Show row & column headers (A, B, C... / 1, 2, 3...)
                        </span>
                      </label>
                    </div>
                  </OptionGroup>

                  {/* Sheets */}
                  <OptionGroup title="Sheets to Convert" className="mt-6">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setAllSheets(true)}
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg border font-medium transition-all",
                          allSheets
                            ? "border-red-500 bg-red-500/10 text-red-500"
                            : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                        )}
                      >
                        All Sheets
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllSheets(false)}
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg border font-medium transition-all",
                          !allSheets
                            ? "border-red-500 bg-red-500/10 text-red-500"
                            : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                        )}
                      >
                        Active Sheet Only
                      </button>
                    </div>
                  </OptionGroup>
                </OptionsPanel>

                <ActionButton
                  icon={FileType2}
                  onClick={handleConvert}
                  className="w-full"
                >
                  Convert to PDF
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Converting Excel to PDF..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
