"use client";

import { useState, useCallback } from "react";
import { Crop, Square, AlignCenter } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { cropPdf, POINTS_PER_MM } from "@/lib/tools/pdf";

interface PDFFile {
  id: string;
  file: File;
}

type CropMode = "margin" | "custom" | "preset";
type PresetSize = "a4" | "letter" | "a5" | "square";

export default function CropPDFPage() {
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
  const [cropMode, setCropMode] = useState<CropMode>("margin");
  const [marginTop, setMarginTop] = useState(10);
  const [marginRight, setMarginRight] = useState(10);
  const [marginBottom, setMarginBottom] = useState(10);
  const [marginLeft, setMarginLeft] = useState(10);
  const [linkMargins, setLinkMargins] = useState(true);
  const [presetSize, setPresetSize] = useState<PresetSize>("a4");
  const [applyToAll, setApplyToAll] = useState(true);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    setErrorMessage(null);
  }, []);

  const updateMargin = (value: number, side: "top" | "right" | "bottom" | "left") => {
    if (linkMargins) {
      setMarginTop(value);
      setMarginRight(value);
      setMarginBottom(value);
      setMarginLeft(value);
    } else {
      switch (side) {
        case "top": setMarginTop(value); break;
        case "right": setMarginRight(value); break;
        case "bottom": setMarginBottom(value); break;
        case "left": setMarginLeft(value); break;
      }
    }
  };

  const handleCrop = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setErrorMessage(null);

    try {
      // All three modes currently map to CropBox trimming on every page.
      // Margin & preset modes use millimetre-to-point conversion.
      const margins = {
        top: marginTop * POINTS_PER_MM,
        right: marginRight * POINTS_PER_MM,
        bottom: marginBottom * POINTS_PER_MM,
        left: marginLeft * POINTS_PER_MM,
      };

      const result = await cropPdf(
        files[0].file,
        { margins },
        (p) => setProgress(p),
      );
      setResultFile(result);
      setStatus("completed");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to crop PDF.",
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


  const presets: { id: PresetSize; name: string; desc: string }[] = [
    { id: "a4", name: "A4", desc: "210 × 297 mm" },
    { id: "letter", name: "Letter", desc: "8.5 × 11 in" },
    { id: "a5", name: "A5", desc: "148 × 210 mm" },
    { id: "square", name: "Square", desc: "210 × 210 mm" },
  ];

  return (
    <PDFToolLayout
      title="Crop PDF"
      description="Remove unwanted margins or areas from PDF pages. Crop to exact dimensions."
      icon={Crop}
      features={["Trim margins", "Custom crop", "Batch processing"]}
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
                {/* Crop Mode Selection */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCropMode("margin")}
                    className={cn(
                      "p-4 rounded-lg border flex flex-col items-center gap-2 transition-all",
                      cropMode === "margin"
                        ? "border-red-500 bg-red-500/10"
                        : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      cropMode === "margin" ? "bg-red-500/20" : "bg-surface-2"
                    )}>
                      <Square className={cn("h-5 w-5", cropMode === "margin" ? "text-red-500" : "text-muted-foreground")} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Trim Margins</p>
                      <p className="text-xs text-muted-foreground">Remove edge space</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCropMode("custom")}
                    className={cn(
                      "p-4 rounded-lg border flex flex-col items-center gap-2 transition-all",
                      cropMode === "custom"
                        ? "border-red-500 bg-red-500/10"
                        : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      cropMode === "custom" ? "bg-red-500/20" : "bg-surface-2"
                    )}>
                      <Crop className={cn("h-5 w-5", cropMode === "custom" ? "text-red-500" : "text-muted-foreground")} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Custom Crop</p>
                      <p className="text-xs text-muted-foreground">Set exact values</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCropMode("preset")}
                    className={cn(
                      "p-4 rounded-lg border flex flex-col items-center gap-2 transition-all",
                      cropMode === "preset"
                        ? "border-red-500 bg-red-500/10"
                        : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      cropMode === "preset" ? "bg-red-500/20" : "bg-surface-2"
                    )}>
                      <AlignCenter className={cn("h-5 w-5", cropMode === "preset" ? "text-red-500" : "text-muted-foreground")} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Preset Size</p>
                      <p className="text-xs text-muted-foreground">Standard formats</p>
                    </div>
                  </button>
                </div>

                <OptionsPanel>
                  {/* Margin Mode */}
                  {cropMode === "margin" && (
                    <OptionGroup title="Margins to Remove (mm)">
                      <div className="space-y-4">
                        {/* Link margins toggle */}
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={linkMargins}
                            onChange={(e) => setLinkMargins(e.target.checked)}
                            className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm">Same margin on all sides</span>
                        </label>

                        {linkMargins ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">All sides: {marginTop}mm</span>
                            </div>
                            <Slider
                              value={[marginTop]}
                              onValueChange={([v]) => updateMargin(v, "top")}
                              min={0}
                              max={50}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: "Top", value: marginTop, side: "top" as const },
                              { label: "Right", value: marginRight, side: "right" as const },
                              { label: "Bottom", value: marginBottom, side: "bottom" as const },
                              { label: "Left", value: marginLeft, side: "left" as const },
                            ].map((m) => (
                              <div key={m.side} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">{m.label}</span>
                                  <span className="text-sm font-medium">{m.value}mm</span>
                                </div>
                                <Slider
                                  value={[m.value]}
                                  onValueChange={([v]) => updateMargin(v, m.side)}
                                  min={0}
                                  max={50}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </OptionGroup>
                  )}

                  {/* Custom Mode */}
                  {cropMode === "custom" && (
                    <OptionGroup title="Crop Area (pixels)">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">From Left</label>
                          <Input
                            type="number"
                            value={marginLeft}
                            onChange={(e) => setMarginLeft(parseInt(e.target.value) || 0)}
                            min={0}
                            className="bg-surface-2 border-border-strong"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">From Top</label>
                          <Input
                            type="number"
                            value={marginTop}
                            onChange={(e) => setMarginTop(parseInt(e.target.value) || 0)}
                            min={0}
                            className="bg-surface-2 border-border-strong"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Width</label>
                          <Input
                            type="number"
                            defaultValue={595}
                            min={1}
                            className="bg-surface-2 border-border-strong"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Height</label>
                          <Input
                            type="number"
                            defaultValue={842}
                            min={1}
                            className="bg-surface-2 border-border-strong"
                          />
                        </div>
                      </div>
                    </OptionGroup>
                  )}

                  {/* Preset Mode */}
                  {cropMode === "preset" && (
                    <OptionGroup title="Target Size">
                      <div className="grid grid-cols-2 gap-3">
                        {presets.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setPresetSize(preset.id)}
                            className={cn(
                              "p-4 rounded-lg border text-left transition-all",
                              presetSize === preset.id
                                ? "border-red-500 bg-red-500/10"
                                : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                            )}
                          >
                            <p className="font-semibold">{preset.name}</p>
                            <p className="text-sm text-muted-foreground">{preset.desc}</p>
                          </button>
                        ))}
                      </div>
                    </OptionGroup>
                  )}

                  {/* Apply to all pages */}
                  <OptionGroup title="Apply To" className="mt-6">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setApplyToAll(true)}
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg border font-medium transition-all",
                          applyToAll
                            ? "border-red-500 bg-red-500/10 text-red-500"
                            : "border-border-strong bg-surface-2 text-muted-foreground hover:border-border-strong"
                        )}
                      >
                        All Pages
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplyToAll(false)}
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg border font-medium transition-all",
                          !applyToAll
                            ? "border-red-500 bg-red-500/10 text-red-500"
                            : "border-border-strong bg-surface-2 text-muted-foreground hover:border-border-strong"
                        )}
                      >
                        Select Pages
                      </button>
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
                  icon={Crop}
                  onClick={handleCrop}
                  className="w-full"
                >
                  Crop PDF
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
              ? "Cropping PDF pages..."
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
