"use client";

import { useEffect, useState, useCallback } from "react";
import { Image as ImageIcon, FileText, Layers, Grid } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { getPageCount, parsePageList, pdfToJpg } from "@/lib/tools/pdf";

interface PDFFile {
  id: string;
  file: File;
}

type OutputFormat = "jpg" | "png" | "webp";
type ExtractionMode = "all" | "range" | "single";

export default function PDFToJPGPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
    blob?: Blob;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  // Options
  const [format, setFormat] = useState<OutputFormat>("jpg");
  const [mode, setMode] = useState<ExtractionMode>("all");
  const [pageRange, setPageRange] = useState("1-5");
  const [singlePage, setSinglePage] = useState(1);
  const [quality, setQuality] = useState(90);
  const [dpi, setDpi] = useState(150);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
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

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setErrorMessage(null);

    try {
      let pages: number[] | undefined;
      if (mode === "range") {
        pages = parsePageList(pageRange, totalPages || 9999).map((i) => i + 1);
        if (pages.length === 0) {
          throw new Error('Enter a page range like "1-5, 10".');
        }
      } else if (mode === "single") {
        pages = [singlePage];
      }

      const result = await pdfToJpg(
        files[0].file,
        {
          format,
          quality: quality / 100,
          // Assume PDF source is 72 DPI; convert target DPI to a scale factor.
          scale: Math.max(0.5, dpi / 72),
          pages,
        },
        (p) => setProgress(p),
      );
      setResultFile(result);
      setStatus("completed");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to convert PDF.",
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


  const formats = [
    { id: "jpg" as const, name: "JPG", desc: "Best for photos" },
    { id: "png" as const, name: "PNG", desc: "Lossless quality" },
    { id: "webp" as const, name: "WebP", desc: "Modern & smaller" },
  ];

  const dpiOptions = [72, 96, 150, 300, 600];

  return (
    <PDFToolLayout
      title="PDF to JPG"
      description="Convert PDF pages to high-quality images. Extract all pages or select specific ones."
      icon={ImageIcon}
      features={["Multiple formats", "Custom quality", "Batch extraction"]}
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
                      {/* Image Quality */}
                      <OptionGroup
                        title="Image Quality"
                        description="Higher quality = larger file size"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Quality: {quality}%</span>
                          </div>
                          <Slider
                            value={[quality]}
                            onValueChange={([v]) => setQuality(v)}
                            min={30}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      </OptionGroup>

                      {/* DPI / Resolution */}
                      <OptionGroup
                        title="Resolution (DPI)"
                        description="Higher DPI = sharper images"
                      >
                        <div className="grid grid-cols-5 gap-2">
                          {dpiOptions.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setDpi(d)}
                              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                                dpi === d
                                  ? "border-red-500 bg-red-500/10 text-red-500"
                                  : "border-border-strong bg-surface-2 text-muted-foreground hover:border-border-strong"
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          72 DPI = web • 150 DPI = print • 300+ DPI = high quality print
                        </p>
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
                          className={`p-4 rounded-lg border text-center transition-all ${
                            format === f.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                          }`}
                        >
                          <p className="font-semibold text-lg">.{f.id.toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{f.desc}</p>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>

                  {/* Extraction Mode */}
                  <OptionGroup title="Pages to Convert" className="mt-6">
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setMode("all")}
                        className={`w-full p-4 rounded-lg border text-left flex items-center gap-4 transition-all ${
                          mode === "all"
                            ? "border-red-500 bg-red-500/10"
                            : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                        }`}
                      >
                        <Grid className={`h-5 w-5 ${mode === "all" ? "text-red-500" : "text-muted-foreground"}`} />
                        <div>
                          <p className="font-medium">All Pages</p>
                          <p className="text-sm text-muted-foreground">Convert every page to an image</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMode("range")}
                        className={`w-full p-4 rounded-lg border text-left flex items-center gap-4 transition-all ${
                          mode === "range"
                            ? "border-red-500 bg-red-500/10"
                            : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                        }`}
                      >
                        <Layers className={`h-5 w-5 ${mode === "range" ? "text-red-500" : "text-muted-foreground"}`} />
                        <div className="flex-1">
                          <p className="font-medium">Page Range</p>
                          <p className="text-sm text-muted-foreground">Select specific pages</p>
                        </div>
                        {mode === "range" && (
                          <Input
                            value={pageRange}
                            onChange={(e) => setPageRange(e.target.value)}
                            placeholder="1-5, 10"
                            className="w-28 bg-surface-2 border-border-strong"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setMode("single")}
                        className={`w-full p-4 rounded-lg border text-left flex items-center gap-4 transition-all ${
                          mode === "single"
                            ? "border-red-500 bg-red-500/10"
                            : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                        }`}
                      >
                        <FileText className={`h-5 w-5 ${mode === "single" ? "text-red-500" : "text-muted-foreground"}`} />
                        <div className="flex-1">
                          <p className="font-medium">Single Page</p>
                          <p className="text-sm text-muted-foreground">Convert one page only</p>
                        </div>
                        {mode === "single" && (
                          <Input
                            type="number"
                            value={singlePage}
                            onChange={(e) => setSinglePage(parseInt(e.target.value) || 1)}
                            min={1}
                            className="w-20 bg-surface-2 border-border-strong"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </button>
                    </div>
                  </OptionGroup>
                </OptionsPanel>

                <ActionButton
                  icon={ImageIcon}
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
              ? "Converting PDF to images..."
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
