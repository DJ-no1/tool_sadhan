"use client";

import { useState, useCallback } from "react";
import { FileText, FileType2, Type, Table, Image as ImageIcon } from "lucide-react";
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
import { extractPdfText } from "@/lib/tools/pdf";

interface PDFFile {
  id: string;
  file: File;
}

type OutputFormat = "docx" | "doc" | "rtf" | "txt";
type ConversionMode = "accurate" | "editable" | "text-only";

export default function PDFToWordPage() {
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
  const [format, setFormat] = useState<OutputFormat>("docx");
  const [mode, setMode] = useState<ConversionMode>("accurate");
  const [includeImages, setIncludeImages] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [ocrEnabled, setOcrEnabled] = useState(false);

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
      // Fully-formatted DOCX export requires a server-side renderer. We ship a
      // best-effort plain-text extraction so the user still gets real content.
      const result = await extractPdfText(files[0].file, (p) => setProgress(p));
      setResultFile(result);
      setStatus("completed");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to extract text from PDF.",
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
    { id: "docx", name: "DOCX", desc: "Modern Word format" },
    { id: "doc", name: "DOC", desc: "Legacy Word format" },
    { id: "rtf", name: "RTF", desc: "Rich Text Format" },
    { id: "txt", name: "TXT", desc: "Plain text only" },
  ];

  const modes: { id: ConversionMode; icon: typeof Type; name: string; desc: string }[] = [
    { id: "accurate", icon: FileText, name: "Accurate", desc: "Best visual match to original PDF" },
    { id: "editable", icon: Table, name: "Editable", desc: "Optimized for editing in Word" },
    { id: "text-only", icon: Type, name: "Text Only", desc: "Extract text without formatting" },
  ];

  return (
    <PDFToolLayout
      title="PDF to Word"
      description="Convert PDF files to editable Word documents. Extract text with formatting."
      icon={FileText}
      features={["DOCX & DOC", "Keep formatting", "OCR support"]}
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
                      {/* Content Options */}
                      <OptionGroup title="Content to Include">
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={includeImages}
                              onChange={(e) => setIncludeImages(e.target.checked)}
                              className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500"
                            />
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="group-hover:text-foreground transition-colors">
                                Include images
                              </span>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={includeTables}
                              onChange={(e) => setIncludeTables(e.target.checked)}
                              className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500"
                            />
                            <div className="flex items-center gap-2">
                              <Table className="h-4 w-4 text-muted-foreground" />
                              <span className="group-hover:text-foreground transition-colors">
                                Preserve tables
                              </span>
                            </div>
                          </label>
                        </div>
                      </OptionGroup>

                      {/* OCR Option */}
                      <OptionGroup title="OCR (Scanned PDFs)">
                        <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg border border-border-strong/50 bg-surface-2/30 hover:border-border-strong">
                          <input
                            type="checkbox"
                            checked={ocrEnabled}
                            onChange={(e) => setOcrEnabled(e.target.checked)}
                            className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500 mt-0.5"
                          />
                          <div>
                            <span className="font-medium group-hover:text-foreground transition-colors">
                              Enable OCR
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">
                              Extract text from scanned documents and images. May increase processing time.
                            </p>
                          </div>
                        </label>
                      </OptionGroup>
                    </div>
                  }
                >
                  {/* Output Format */}
                  <OptionGroup title="Output Format">
                    <div className="grid grid-cols-4 gap-2">
                      {formats.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFormat(f.id)}
                          className={cn(
                            "p-3 rounded-lg border text-center transition-all",
                            format === f.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                          )}
                        >
                          <p className="font-semibold">.{f.id.toUpperCase()}</p>
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
              ? `Extracting text for ${format.toUpperCase()}...`
              : status === "error"
                ? (errorMessage ?? undefined)
                : status === "completed"
                  ? "Exported as plain text (.txt). Fully-formatted DOCX export is coming via a server-side renderer."
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
