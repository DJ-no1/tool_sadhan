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
import { extractPdfText, pdfToJpg } from "@/lib/tools/pdf";

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
    blob?: Blob;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Options
  const [format, setFormat] = useState<OutputFormat>("pptx");
  const [mode, setMode] = useState<ConversionMode>("editable");
  const [preserveLayout, setPreserveLayout] = useState(true);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    setErrorMessage(null);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setErrorMessage(null);

    try {
      if (mode === "images") {
        // Each page → JPG, zipped. Users can "Insert Picture" into PowerPoint.
        const result = await pdfToJpg(
          files[0].file,
          { format: "jpg", quality: 0.85, scale: 2 },
          (p) => setProgress(p),
        );
        setResultFile(result);
      } else {
        const result = await extractPdfText(files[0].file, (p) =>
          setProgress(p),
        );
        setResultFile(result);
      }
      setStatus("completed");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to convert PDF.",
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setErrorMessage(null);
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
                            "p-4 rounded-lg border text-center transition-all",
                            format === f.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                          )}
                        >
                          <p className="font-semibold text-lg">.{f.id.toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{f.desc}</p>
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
                            "w-full p-4 rounded-lg border text-left flex items-center gap-4 transition-all",
                            mode === m.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            mode === m.id ? "bg-red-500/20" : "bg-surface-2"
                          )}>
                            <m.icon className={cn("h-5 w-5", mode === m.id ? "text-red-500" : "text-muted-foreground")} />
                          </div>
                          <div>
                            <p className="font-medium">{m.name}</p>
                            <p className="text-sm text-muted-foreground">{m.desc}</p>
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
                        className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500"
                      />
                      <div>
                        <span className="group-hover:text-foreground transition-colors">
                          Preserve original layout
                        </span>
                        <p className="text-xs text-muted-foreground">Keep positions and spacing from PDF</p>
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
          message={
            status === "processing"
              ? mode === "images"
                ? "Rendering slides as images..."
                : "Extracting slide text..."
              : status === "error"
                ? (errorMessage ?? undefined)
                : status === "completed"
                  ? mode === "images"
                    ? "Delivered a ZIP of slide images. Import them into PowerPoint via Insert → Photo Album."
                    : "Delivered slide text (.txt). Native PPTX export is coming via a server-side renderer."
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
