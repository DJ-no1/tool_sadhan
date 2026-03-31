"use client";

import { useState, useCallback } from "react";
import { Stamp, Type, Image as ImageIcon, Move, Palette, Eye, EyeOff } from "lucide-react";
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
import { Label } from "@/components/ui/label";

interface PDFFile {
  id: string;
  file: File;
}

type WatermarkType = "text" | "image";
type WatermarkPosition = "center" | "tile" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function WatermarkPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Watermark options
  const [watermarkType, setWatermarkType] = useState<WatermarkType>("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ff0000");
  const [opacity, setOpacity] = useState(30);
  const [rotation, setRotation] = useState(-45);
  const [position, setPosition] = useState<WatermarkPosition>("center");

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
  }, []);

  const handleWatermark = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [20, 40, 60, 80, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", "_watermarked.pdf"),
      size: files[0].file.size * 1.02,
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
    console.log("Downloading watermarked PDF");
  };

  const positions: { id: WatermarkPosition; label: string }[] = [
    { id: "center", label: "Center" },
    { id: "tile", label: "Tile (Repeat)" },
    { id: "top-left", label: "Top Left" },
    { id: "top-right", label: "Top Right" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-right", label: "Bottom Right" },
  ];

  const presetColors = ["#ff0000", "#000000", "#0066cc", "#666666", "#ff6600", "#009933"];

  return (
    <PDFToolLayout
      title="Add Watermark"
      description="Add text or image watermarks to your PDF documents. Customize position, opacity, and style."
      icon={Stamp}
      features={["Text & image", "Custom positioning", "Adjustable opacity"]}
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
                      {/* Rotation */}
                      <OptionGroup title="Rotation">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">{rotation}°</span>
                          </div>
                          <Slider
                            value={[rotation]}
                            onValueChange={([v]) => setRotation(v)}
                            min={-180}
                            max={180}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-zinc-500">
                            <span>-180°</span>
                            <span>0°</span>
                            <span>180°</span>
                          </div>
                        </div>
                      </OptionGroup>

                      {/* Position */}
                      <OptionGroup title="Position">
                        <div className="grid grid-cols-3 gap-2">
                          {positions.map((pos) => (
                            <button
                              key={pos.id}
                              type="button"
                              onClick={() => setPosition(pos.id)}
                              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                                position === pos.id
                                  ? "border-red-500 bg-red-500/10 text-red-500"
                                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </OptionGroup>

                      {/* Page Selection */}
                      <OptionGroup title="Apply to Pages">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            className="p-3 rounded-xl border border-red-500 bg-red-500/10 text-left"
                          >
                            <p className="font-medium">All Pages</p>
                          </button>
                          <button
                            type="button"
                            className="p-3 rounded-xl border border-zinc-700/50 bg-zinc-800/30 text-left hover:border-zinc-600"
                          >
                            <p className="font-medium text-zinc-400">Custom Range</p>
                          </button>
                        </div>
                      </OptionGroup>
                    </div>
                  }
                >
                  {/* Watermark Type */}
                  <OptionGroup title="Watermark Type">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setWatermarkType("text")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          watermarkType === "text"
                            ? "border-red-500 bg-red-500/10"
                            : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                        }`}
                      >
                        <Type className={`h-6 w-6 mb-2 ${watermarkType === "text" ? "text-red-500" : "text-zinc-400"}`} />
                        <p className="font-medium">Text</p>
                        <p className="text-sm text-zinc-400">Add custom text</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWatermarkType("image")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          watermarkType === "image"
                            ? "border-red-500 bg-red-500/10"
                            : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                        }`}
                      >
                        <ImageIcon className={`h-6 w-6 mb-2 ${watermarkType === "image" ? "text-red-500" : "text-zinc-400"}`} />
                        <p className="font-medium">Image</p>
                        <p className="text-sm text-zinc-400">Upload logo/image</p>
                      </button>
                    </div>
                  </OptionGroup>

                  {/* Text Options */}
                  {watermarkType === "text" && (
                    <div className="space-y-6 mt-6">
                      <OptionGroup title="Watermark Text">
                        <Input
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Enter watermark text"
                          className="bg-zinc-800 border-zinc-700 text-lg"
                        />
                      </OptionGroup>

                      <OptionGroup title="Font Size">
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[fontSize]}
                            onValueChange={([v]) => setFontSize(v)}
                            min={12}
                            max={120}
                            step={2}
                            className="flex-1"
                          />
                          <span className="text-sm text-zinc-400 w-16">{fontSize}px</span>
                        </div>
                      </OptionGroup>

                      <OptionGroup title="Color">
                        <div className="flex items-center gap-3">
                          {presetColors.map((c) => (
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
                            className="w-10 h-10 p-1 bg-zinc-800 border-zinc-700 cursor-pointer"
                          />
                        </div>
                      </OptionGroup>
                    </div>
                  )}

                  {/* Image Upload */}
                  {watermarkType === "image" && (
                    <OptionGroup title="Upload Image" className="mt-6">
                      <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-zinc-600 transition-colors cursor-pointer">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-zinc-500" />
                        <p className="text-sm text-zinc-400">Click to upload or drag image</p>
                        <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </OptionGroup>
                  )}

                  {/* Opacity */}
                  <OptionGroup title="Opacity" className="mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {opacity > 0 ? <Eye className="h-4 w-4 text-zinc-400" /> : <EyeOff className="h-4 w-4 text-zinc-400" />}
                          <span className="text-sm text-zinc-400">{opacity}%</span>
                        </div>
                      </div>
                      <Slider
                        value={[opacity]}
                        onValueChange={([v]) => setOpacity(v)}
                        min={5}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Subtle</span>
                        <span>Visible</span>
                      </div>
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
                  icon={Stamp}
                  onClick={handleWatermark}
                  className="w-full"
                >
                  Add Watermark
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Adding watermark..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
