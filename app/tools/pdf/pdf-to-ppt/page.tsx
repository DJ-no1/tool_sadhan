"use client";

import { useState, useCallback } from "react";
import { Presentation, FileType2, Layout, Layers } from "lucide-react";
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

interface PDFFile {
  id: string;
  file: File;
}

type OutputFormat = "pptx" | "ppt";
type ConversionMode = "editable" | "images";

export default function PDFToPPTPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Options
  const [format, setFormat] = useState<OutputFormat>("pptx");
  const [mode, setMode] = useState<ConversionMode>("editable");
  const [preserveLayout, setPreserveLayout] = useState(true);

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
      await new Promise((resolve) => setTimeout(resolve, 400));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", `.${format}`),
      size: files[0].file.size * 1.3,
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
    console.log("Downloading PowerPoint file");
  };

  const formats: { id: OutputFormat; name: string; desc: string }[] = [
    { id: "pptx", name: "PPTX", desc: "Modern PowerPoint" },
    { id: "ppt", name: "PPT", desc: "Legacy PowerPoint" },
  ];

  const modes: { id: ConversionMode; icon: typeof Layout; name: string; desc: string }[] = [
    { id: "editable", icon: Layout, name: "Editable", desc: "Extract text & shapes as editable objects" },
    { id: "images", icon: Layers, name: "Image Slides", desc: "Each page becomes an image slide" },
  ];

  return (
    <PDFToolLayout
      title="PDF to PowerPoint"
      description="Convert PDF files to editable PowerPoint presentations."
      icon={Presentation}
      features={["PPTX format", "Editable slides", "Keep layout"]}
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
                  {/* Output Format */}
                  <OptionGroup title="Output Format">
                    <div className="grid grid-cols-2 gap-3">
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

                  {/* Conversion Mode */}
                  <OptionGroup title="Conversion Mode" className="mt-6">
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
                          <div>
                            <p className="font-medium">{m.name}</p>
                            <p className="text-sm text-zinc-400">{m.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>

                  {/* Options */}
                  <OptionGroup title="Options" className="mt-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={preserveLayout}
                        onChange={(e) => setPreserveLayout(e.target.checked)}
                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500"
                      />
                      <div>
                        <span className="group-hover:text-white transition-colors">
                          Preserve original layout
                        </span>
                        <p className="text-xs text-zinc-500">Keep positions and spacing from PDF</p>
                      </div>
                    </label>
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
