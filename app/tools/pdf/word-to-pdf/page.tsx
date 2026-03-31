"use client";

import { useState, useCallback } from "react";
import { FileText, FileType2, Settings2 } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { cn } from "@/lib/utils";

interface DocFile {
  id: string;
  file: File;
}

type PDFQuality = "standard" | "high" | "print";

export default function WordToPDFPage() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Options
  const [quality, setQuality] = useState<PDFQuality>("standard");
  const [preserveLinks, setPreserveLinks] = useState(true);
  const [preserveBookmarks, setPreserveBookmarks] = useState(true);
  const [createOutline, setCreateOutline] = useState(false);

  const generateId = () => Math.random().toString(36).substring(7);

  const handleFilesChange = useCallback((newFiles: DocFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.name.endsWith(".doc") || f.name.endsWith(".docx") || f.name.endsWith(".odt")
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
      name: files[0].file.name.replace(/\.(docx?|odt)$/i, ".pdf"),
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
    console.log("Downloading PDF");
  };

  const qualityOptions: { id: PDFQuality; name: string; desc: string }[] = [
    { id: "standard", name: "Standard", desc: "Optimized for screen viewing" },
    { id: "high", name: "High Quality", desc: "Better images, larger file" },
    { id: "print", name: "Print Ready", desc: "Maximum quality for printing" },
  ];

  return (
    <PDFToolLayout
      title="Word to PDF"
      description="Convert Word documents to PDF format. Preserves formatting, fonts, and layout."
      icon={FileText}
      features={["DOC & DOCX", "Preserve layout", "Keep hyperlinks"]}
    >
      <div className="space-y-6">
        {status === "idle" && (
          <>
            {/* Custom Dropzone for Word files */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700/50 bg-zinc-900/30 p-8 md:p-12 text-center transition-all cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">Drop your Word documents here</h3>
                <p className="text-sm text-zinc-400 mb-6">
                  DOC, DOCX, ODT • Max 50MB per file
                </p>
                
                <input
                  id="doc-input"
                  type="file"
                  accept=".doc,.docx,.odt"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <label
                  htmlFor="doc-input"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium cursor-pointer transition-colors"
                >
                  Select Word Files
                </label>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                <h3 className="font-semibold mb-3">{files.length} document{files.length > 1 ? "s" : ""}</h3>
                <div className="space-y-2">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50"
                    >
                      <FileText className="h-5 w-5 text-blue-500" />
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
                <OptionsPanel
                  advancedChildren={
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={createOutline}
                          onChange={(e) => setCreateOutline(e.target.checked)}
                          className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500"
                        />
                        <div>
                          <span className="group-hover:text-white transition-colors">
                            Create PDF outline from headings
                          </span>
                          <p className="text-xs text-zinc-500">Generate clickable table of contents</p>
                        </div>
                      </label>
                    </div>
                  }
                >
                  {/* Quality */}
                  <OptionGroup title="PDF Quality">
                    <div className="grid grid-cols-3 gap-3">
                      {qualityOptions.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setQuality(q.id)}
                          className={cn(
                            "p-3 rounded-xl border text-center transition-all",
                            quality === q.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                          )}
                        >
                          <p className="font-medium">{q.name}</p>
                          <p className="text-xs text-zinc-400">{q.desc}</p>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>

                  {/* Options */}
                  <OptionGroup title="Options" className="mt-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={preserveLinks}
                          onChange={(e) => setPreserveLinks(e.target.checked)}
                          className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500"
                        />
                        <span className="group-hover:text-white transition-colors">
                          Preserve hyperlinks
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={preserveBookmarks}
                          onChange={(e) => setPreserveBookmarks(e.target.checked)}
                          className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500"
                        />
                        <span className="group-hover:text-white transition-colors">
                          Preserve bookmarks
                        </span>
                      </label>
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
          message={status === "processing" ? "Converting Word to PDF..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
