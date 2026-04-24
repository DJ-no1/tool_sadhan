"use client";

import { useState, useCallback } from "react";
import { Hash, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  PDFPreview,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  addPageNumbers,
  type NumberFormat as LibNumberFormat,
} from "@/lib/tools/pdf";

interface PDFFile {
  id: string;
  file: File;
}

type Position = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
type NumberFormat = "1" | "1/n" | "Page 1" | "- 1 -" | "i" | "I";

export default function PageNumbersPDFPage() {
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
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState<NumberFormat>("1");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(20);
  const [skipFirst, setSkipFirst] = useState(false);
  const [color, setColor] = useState("#000000");

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    setErrorMessage(null);
  }, []);

  const formatMap: Record<NumberFormat, LibNumberFormat> = {
    "1": "plain",
    "1/n": "n-of-m",
    "Page 1": "page",
    "- 1 -": "dashed",
    "i": "roman-lower",
    "I": "roman-upper",
  };

  const parseHexColor = (hex: string): { r: number; g: number; b: number } => {
    const cleaned = hex.replace("#", "");
    const full =
      cleaned.length === 3
        ? cleaned
            .split("")
            .map((c) => c + c)
            .join("")
        : cleaned.padEnd(6, "0");
    return {
      r: parseInt(full.slice(0, 2), 16) || 0,
      g: parseInt(full.slice(2, 4), 16) || 0,
      b: parseInt(full.slice(4, 6), 16) || 0,
    };
  };

  const handleAddNumbers = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setErrorMessage(null);

    try {
      const result = await addPageNumbers(
        files[0].file,
        {
          position,
          format: formatMap[format],
          startAt: startNumber,
          fontSize,
          margin,
          color: parseHexColor(color),
          skipFirst,
        },
        (p) => setProgress(p),
      );
      setResultFile(result);
      setStatus("completed");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to add page numbers.",
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


  const positions: { id: Position; label: string; align: "left" | "center" | "right"; pos: "top" | "bottom" }[] = [
    { id: "top-left", label: "Top Left", align: "left", pos: "top" },
    { id: "top-center", label: "Top Center", align: "center", pos: "top" },
    { id: "top-right", label: "Top Right", align: "right", pos: "top" },
    { id: "bottom-left", label: "Bottom Left", align: "left", pos: "bottom" },
    { id: "bottom-center", label: "Bottom Center", align: "center", pos: "bottom" },
    { id: "bottom-right", label: "Bottom Right", align: "right", pos: "bottom" },
  ];

  const formats: { id: NumberFormat; example: string }[] = [
    { id: "1", example: "1, 2, 3..." },
    { id: "1/n", example: "1/10, 2/10..." },
    { id: "Page 1", example: "Page 1, Page 2..." },
    { id: "- 1 -", example: "- 1 -, - 2 -..." },
    { id: "i", example: "i, ii, iii..." },
    { id: "I", example: "I, II, III..." },
  ];

  return (
    <PDFToolLayout
      title="Add Page Numbers"
      description="Add page numbers to your PDF document. Choose position, format, and styling options."
      icon={Hash}
      features={["Multiple formats", "Custom position", "Flexible styling"]}
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
                      {/* Font Size */}
                      <OptionGroup title="Font Size">
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[fontSize]}
                            onValueChange={([v]) => setFontSize(v)}
                            min={8}
                            max={24}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-12">{fontSize}pt</span>
                        </div>
                      </OptionGroup>

                      {/* Page Margin */}
                      <OptionGroup title="Margin from Edge">
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[margin]}
                            onValueChange={([v]) => setMargin(v)}
                            min={10}
                            max={50}
                            step={5}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-12">{margin}px</span>
                        </div>
                      </OptionGroup>

                      {/* Color */}
                      <OptionGroup title="Number Color">
                        <div className="flex items-center gap-3">
                          {["#000000", "#333333", "#666666", "#ff0000", "#0066cc"].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setColor(c)}
                              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                color === c ? "border-white scale-110" : "border-transparent"
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                          <Input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-10 h-10 p-1 bg-surface-2 border-border-strong cursor-pointer"
                          />
                        </div>
                      </OptionGroup>

                      {/* Options */}
                      <OptionGroup title="Additional Options">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={skipFirst}
                            onChange={(e) => setSkipFirst(e.target.checked)}
                            className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm group-hover:text-foreground transition-colors">
                            Skip first page (title page)
                          </span>
                        </label>
                      </OptionGroup>
                    </div>
                  }
                >
                  {/* Position */}
                  <OptionGroup title="Position">
                    <div className="grid grid-cols-3 gap-2">
                      {positions.map((pos) => {
                        const AlignIcon = pos.align === "left" ? AlignLeft : pos.align === "right" ? AlignRight : AlignCenter;
                        return (
                          <button
                            key={pos.id}
                            type="button"
                            onClick={() => setPosition(pos.id)}
                            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                              position === pos.id
                                ? "border-red-500 bg-red-500/10"
                                : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                            }`}
                          >
                            <AlignIcon className={`h-4 w-4 ${position === pos.id ? "text-red-500" : "text-muted-foreground"}`} />
                            <span className="text-xs">{pos.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </OptionGroup>

                  {/* Number Format */}
                  <OptionGroup title="Number Format" className="mt-6">
                    <div className="grid grid-cols-2 gap-2">
                      {formats.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFormat(f.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            format === f.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                          }`}
                        >
                          <p className="font-medium font-mono">{f.id}</p>
                          <p className="text-xs text-muted-foreground">{f.example}</p>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>

                  {/* Start Number */}
                  <OptionGroup title="Start From" className="mt-6">
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={startNumber}
                        onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                        min={1}
                        className="w-24 bg-surface-2 border-border-strong"
                      />
                      <span className="text-sm text-muted-foreground">
                        First page will be numbered as {startNumber}
                      </span>
                    </div>
                  </OptionGroup>
                </OptionsPanel>

                {/* PDF Preview */}
                <PDFPreview
                  file={files[0].file}
                  showThumbnails={true}
                  showToolbar={true}
                />

                <ActionButton
                  icon={Hash}
                  onClick={handleAddNumbers}
                  className="w-full"
                >
                  Add Page Numbers
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
              ? "Adding page numbers..."
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
