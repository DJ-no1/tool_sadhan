"use client";

import { useState, useCallback } from "react";
import { Presentation, FileType2 } from "lucide-react";
import {
  PDFToolLayout,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { cn } from "@/lib/utils";

interface PPTFile {
  id: string;
  file: File;
}

type Quality = "standard" | "high" | "print";

export default function PPTToPDFPage() {
  const [files, setFiles] = useState<PPTFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Options
  const [quality, setQuality] = useState<Quality>("standard");
  const [includeNotes, setIncludeNotes] = useState(false);
  const [includeHiddenSlides, setIncludeHiddenSlides] = useState(false);
  const [oneSlidePerPage, setOneSlidePerPage] = useState(true);

  const generateId = () => Math.random().toString(36).substring(7);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.name.endsWith(".ppt") || f.name.endsWith(".pptx") || f.name.endsWith(".odp")
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
      await new Promise((resolve) => setTimeout(resolve, 350));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(/\.(pptx?|odp)$/i, ".pdf"),
      size: files[0].file.size * 0.75,
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

  const qualities: { id: Quality; name: string; desc: string }[] = [
    { id: "standard", name: "Standard", desc: "Optimized for screen" },
    { id: "high", name: "High Quality", desc: "Better images" },
    { id: "print", name: "Print Ready", desc: "Maximum quality" },
  ];

  return (
    <PDFToolLayout
      title="PowerPoint to PDF"
      description="Convert PowerPoint presentations to PDF. Preserves animations as static slides."
      icon={Presentation}
      features={["PPT & PPTX", "Keep transitions", "Include notes"]}
    >
      <div className="space-y-6">
        {status === "idle" && (
          <>
            {/* Custom Dropzone for PPT files */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-strong/50 bg-surface/30 p-8 md:p-12 text-center transition-all cursor-pointer hover:border-border-strong hover:bg-surface overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                  <Presentation className="h-8 w-8 text-orange-500" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">Drop your presentations here</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  PPT, PPTX, ODP • Max 100MB per file
                </p>
                
                <input
                  id="ppt-input"
                  type="file"
                  accept=".ppt,.pptx,.odp"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <label
                  htmlFor="ppt-input"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-foreground font-medium cursor-pointer transition-colors"
                >
                  Select Presentations
                </label>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="font-semibold mb-3">{files.length} presentation{files.length > 1 ? "s" : ""}</h3>
                <div className="space-y-2">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface-2"
                    >
                      <Presentation className="h-5 w-5 text-orange-500" />
                      <span className="flex-1 truncate">{f.file.name}</span>
                      <span className="text-sm text-muted-foreground">
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
                  {/* Quality */}
                  <OptionGroup title="PDF Quality">
                    <div className="grid grid-cols-3 gap-3">
                      {qualities.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setQuality(q.id)}
                          className={cn(
                            "p-3 rounded-lg border text-center transition-all",
                            quality === q.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                          )}
                        >
                          <p className="font-medium">{q.name}</p>
                          <p className="text-xs text-muted-foreground">{q.desc}</p>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>

                  {/* Layout */}
                  <OptionGroup title="Page Layout" className="mt-6">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setOneSlidePerPage(true)}
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg border font-medium transition-all",
                          oneSlidePerPage
                            ? "border-red-500 bg-red-500/10 text-red-500"
                            : "border-border-strong bg-surface-2 text-muted-foreground hover:border-border-strong"
                        )}
                      >
                        One Slide Per Page
                      </button>
                      <button
                        type="button"
                        onClick={() => setOneSlidePerPage(false)}
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg border font-medium transition-all",
                          !oneSlidePerPage
                            ? "border-red-500 bg-red-500/10 text-red-500"
                            : "border-border-strong bg-surface-2 text-muted-foreground hover:border-border-strong"
                        )}
                      >
                        Multiple Slides
                      </button>
                    </div>
                  </OptionGroup>

                  {/* Options */}
                  <OptionGroup title="Include" className="mt-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={includeNotes}
                          onChange={(e) => setIncludeNotes(e.target.checked)}
                          className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500"
                        />
                        <span className="group-hover:text-foreground transition-colors">
                          Speaker notes
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={includeHiddenSlides}
                          onChange={(e) => setIncludeHiddenSlides(e.target.checked)}
                          className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500"
                        />
                        <span className="group-hover:text-foreground transition-colors">
                          Hidden slides
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
          message={status === "processing" ? "Converting presentation to PDF..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
