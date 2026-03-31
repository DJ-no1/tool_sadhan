"use client";

import { useState, useCallback } from "react";
import { Table, FileType2, Grid, FileSpreadsheet } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface PDFFile {
  id: string;
  file: File;
}

type OutputFormat = "xlsx" | "xls" | "csv";
type ExtractionMode = "all" | "pages" | "tables-only";

export default function PDFToExcelPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Options
  const [format, setFormat] = useState<OutputFormat>("xlsx");
  const [mode, setMode] = useState<ExtractionMode>("all");
  const [pageRange, setPageRange] = useState("");
  const [mergeSheets, setMergeSheets] = useState(false);
  const [detectTables, setDetectTables] = useState(true);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [15, 30, 50, 70, 90, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", `.${format}`),
      size: files[0].file.size * 0.9,
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
    console.log("Downloading Excel file");
  };

  const formats: { id: OutputFormat; name: string; desc: string }[] = [
    { id: "xlsx", name: "XLSX", desc: "Modern Excel" },
    { id: "xls", name: "XLS", desc: "Legacy Excel" },
    { id: "csv", name: "CSV", desc: "Comma separated" },
  ];

  const modes: { id: ExtractionMode; icon: typeof Grid; name: string; desc: string }[] = [
    { id: "all", icon: FileSpreadsheet, name: "All Content", desc: "Extract all text and tables" },
    { id: "pages", icon: Grid, name: "Select Pages", desc: "Choose specific pages" },
    { id: "tables-only", icon: Table, name: "Tables Only", desc: "Extract only detected tables" },
  ];

  return (
    <PDFToolLayout
      title="PDF to Excel"
      description="Extract tables and data from PDF to Excel spreadsheets. Smart table detection."
      icon={Table}
      features={["XLSX & CSV", "Auto table detection", "Multi-page support"]}
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
                <OptionsPanel
                  advancedChildren={
                    <div className="space-y-6">
                      {/* Table Detection */}
                      <OptionGroup title="Table Detection">
                        <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl border border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600">
                          <input
                            type="checkbox"
                            checked={detectTables}
                            onChange={(e) => setDetectTables(e.target.checked)}
                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500 mt-0.5"
                          />
                          <div>
                            <span className="font-medium group-hover:text-white transition-colors">
                              Smart table detection
                            </span>
                            <p className="text-sm text-zinc-400 mt-1">
                              Automatically detect table boundaries and structure
                            </p>
                          </div>
                        </label>
                      </OptionGroup>

                      {/* Merge Option */}
                      <OptionGroup title="Output Structure">
                        <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl border border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600">
                          <input
                            type="checkbox"
                            checked={mergeSheets}
                            onChange={(e) => setMergeSheets(e.target.checked)}
                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500 mt-0.5"
                          />
                          <div>
                            <span className="font-medium group-hover:text-white transition-colors">
                              Merge all pages into one sheet
                            </span>
                            <p className="text-sm text-zinc-400 mt-1">
                              Combine all tables into a single Excel sheet
                            </p>
                          </div>
                        </label>
                      </OptionGroup>
                    </div>
                  }
                >
                  {/* Output Format */}
                  <OptionGroup title="Output Format">
                    <div className="grid grid-cols-3 gap-3">
                      {formats.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFormat(f.id)}
                          className={cn(
                            "p-4 rounded-xl border text-center transition-all",
                            format === f.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                          )}
                        >
                          <p className="font-semibold text-lg">.{f.id.toUpperCase()}</p>
                          <p className="text-xs text-zinc-400">{f.desc}</p>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>

                  {/* Extraction Mode */}
                  <OptionGroup title="Extraction Mode" className="mt-6">
                    <div className="space-y-3">
                      {modes.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMode(m.id)}
                          className={cn(
                            "w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all",
                            mode === m.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            mode === m.id ? "bg-red-500/20" : "bg-zinc-800"
                          )}>
                            <m.icon className={cn("h-5 w-5", mode === m.id ? "text-red-500" : "text-zinc-400")} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{m.name}</p>
                            <p className="text-sm text-zinc-400">{m.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {mode === "pages" && (
                      <div className="mt-4 pl-4 border-l-2 border-zinc-700">
                        <label className="text-sm text-zinc-400 mb-2 block">Page range (e.g., 1-5, 8, 11-15)</label>
                        <Input
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder="1-5, 10"
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                    )}
                  </OptionGroup>
                </OptionsPanel>

                <ActionButton
                  icon={FileType2}
                  onClick={handleConvert}
                  className="w-full"
                >
                  Convert to {format.toUpperCase()}
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? `Converting PDF to ${format.toUpperCase()}...` : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
