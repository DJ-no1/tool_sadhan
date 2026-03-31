"use client";

import { useState, useCallback } from "react";
import { Minimize2, Gauge, FileText, Settings2, HardDrive, Percent, Target } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  OptionCard,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CompressionMode = "preset" | "size" | "percentage";
type CompressionPreset = "extreme" | "recommended" | "less";

interface PDFFile {
  id: string;
  file: File;
}

export default function CompressPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  
  // Compression options
  const [mode, setMode] = useState<CompressionMode>("preset");
  const [preset, setPreset] = useState<CompressionPreset>("recommended");
  const [targetSize, setTargetSize] = useState(1); // MB
  const [targetPercentage, setTargetPercentage] = useState(50);
  
  // Advanced options
  const [imageQuality, setImageQuality] = useState(80);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [linearize, setLinearize] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [dpi, setDpi] = useState(150);

  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
    url?: string;
  } | null>(null);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
  }, []);

  const handleCompress = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    // Simulate compression process
    const intervals = [10, 25, 40, 55, 70, 85, 95, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(p);
    }

    // Simulate result
    const originalFile = files[0].file;
    const compressionRatio = preset === "extreme" ? 0.3 : preset === "recommended" ? 0.5 : 0.7;
    
    setResultFile({
      name: originalFile.name.replace(".pdf", "_compressed.pdf"),
      size: Math.floor(originalFile.size * compressionRatio),
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
    // In real implementation, this would download the actual file
    console.log("Downloading compressed PDF");
  };

  const presets = [
    {
      id: "extreme" as const,
      name: "Maximum Compression",
      description: "Smallest file size, lower quality",
      icon: Gauge,
      reduction: "Up to 80% smaller",
    },
    {
      id: "recommended" as const,
      name: "Recommended",
      description: "Best balance of size and quality",
      icon: Target,
      reduction: "Up to 50% smaller",
    },
    {
      id: "less" as const,
      name: "Less Compression",
      description: "Higher quality, larger file",
      icon: FileText,
      reduction: "Up to 30% smaller",
    },
  ];

  return (
    <PDFToolLayout
      title="Compress PDF"
      description="Reduce your PDF file size while maintaining quality. Choose from presets or set a specific target size."
      icon={Minimize2}
      features={["Up to 80% reduction", "Maintains quality", "Batch processing"]}
    >
      <div className="space-y-6">
        {/* File Upload */}
        {status === "idle" && (
          <>
            <PDFDropzone
              multiple={false}
              maxSize={100}
              onFilesChange={handleFilesChange}
            />

            {files.length > 0 && (
              <>
                {/* Options Panel */}
                <OptionsPanel
                  advancedChildren={
                    <div className="space-y-6">
                      {/* Image Quality */}
                      <OptionGroup
                        title="Image Quality"
                        description="Adjust the quality of images in the PDF"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Quality: {imageQuality}%</span>
                          </div>
                          <Slider
                            value={[imageQuality]}
                            onValueChange={([v]) => setImageQuality(v)}
                            min={10}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-zinc-500">
                            <span>Lower quality / Smaller</span>
                            <span>Higher quality / Larger</span>
                          </div>
                        </div>
                      </OptionGroup>

                      {/* Image DPI */}
                      <OptionGroup
                        title="Image Resolution (DPI)"
                        description="Reduce image resolution to decrease file size"
                      >
                        <div className="grid grid-cols-4 gap-2">
                          {[72, 96, 150, 300].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setDpi(d)}
                              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                                dpi === d
                                  ? "border-red-500 bg-red-500/10 text-red-500"
                                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                              }`}
                            >
                              {d} DPI
                            </button>
                          ))}
                        </div>
                      </OptionGroup>

                      {/* Additional Options */}
                      <OptionGroup title="Additional Options">
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={removeMetadata}
                              onChange={(e) => setRemoveMetadata(e.target.checked)}
                              className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                            />
                            <div>
                              <span className="text-sm font-medium group-hover:text-white transition-colors">Remove metadata</span>
                              <p className="text-xs text-zinc-500">Strip author, title, and other info</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={linearize}
                              onChange={(e) => setLinearize(e.target.checked)}
                              className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                            />
                            <div>
                              <span className="text-sm font-medium group-hover:text-white transition-colors">Optimize for web</span>
                              <p className="text-xs text-zinc-500">Linearize PDF for fast web viewing</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={grayscale}
                              onChange={(e) => setGrayscale(e.target.checked)}
                              className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                            />
                            <div>
                              <span className="text-sm font-medium group-hover:text-white transition-colors">Convert to grayscale</span>
                              <p className="text-xs text-zinc-500">Remove colors for smaller file size</p>
                            </div>
                          </label>
                        </div>
                      </OptionGroup>
                    </div>
                  }
                >
                  {/* Mode Selection */}
                  <div className="mb-6">
                    <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-zinc-800/50">
                      <button
                        type="button"
                        onClick={() => setMode("preset")}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          mode === "preset"
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("size")}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          mode === "size"
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <HardDrive className="h-4 w-4" />
                        Target Size
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("percentage")}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          mode === "percentage"
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Percent className="h-4 w-4" />
                        Percentage
                      </button>
                    </div>
                  </div>

                  {/* Preset Mode */}
                  {mode === "preset" && (
                    <div className="space-y-3">
                      {presets.map((p) => (
                        <OptionCard
                          key={p.id}
                          selected={preset === p.id}
                          onClick={() => setPreset(p.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              preset === p.id ? "bg-red-500/20" : "bg-zinc-800"
                            }`}>
                              <p.icon className={`h-6 w-6 ${
                                preset === p.id ? "text-red-500" : "text-zinc-400"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{p.name}</span>
                                <span className={`text-sm ${
                                  preset === p.id ? "text-red-400" : "text-zinc-500"
                                }`}>{p.reduction}</span>
                              </div>
                              <p className="text-sm text-zinc-400">{p.description}</p>
                            </div>
                          </div>
                        </OptionCard>
                      ))}
                    </div>
                  )}

                  {/* Size Mode */}
                  {mode === "size" && (
                    <OptionGroup
                      title="Target File Size"
                      description="Compress to approximately this file size"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Slider
                              value={[targetSize]}
                              onValueChange={([v]) => setTargetSize(v)}
                              min={0.1}
                              max={50}
                              step={0.1}
                              className="w-full"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={targetSize}
                              onChange={(e) => setTargetSize(parseFloat(e.target.value) || 0.1)}
                              className="w-20 bg-zinc-800 border-zinc-700"
                              min={0.1}
                              max={50}
                              step={0.1}
                            />
                            <span className="text-sm text-zinc-400">MB</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <Settings2 className="h-4 w-4" />
                          <span>Current file: {(files[0]?.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    </OptionGroup>
                  )}

                  {/* Percentage Mode */}
                  {mode === "percentage" && (
                    <OptionGroup
                      title="Reduction Percentage"
                      description="Reduce file size by this percentage"
                    >
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-5xl font-bold text-red-500">{targetPercentage}%</span>
                          <p className="text-sm text-zinc-400 mt-2">smaller than original</p>
                        </div>
                        <Slider
                          value={[targetPercentage]}
                          onValueChange={([v]) => setTargetPercentage(v)}
                          min={10}
                          max={90}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-zinc-500">
                          <span>10%</span>
                          <span>90%</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-zinc-400 pt-2">
                          <span>Estimated size:</span>
                          <span className="font-semibold text-green-500">
                            {((files[0]?.file.size || 0) * (1 - targetPercentage / 100) / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    </OptionGroup>
                  )}
                </OptionsPanel>

                {/* Compress Button */}
                <ActionButton
                  icon={Minimize2}
                  onClick={handleCompress}
                  className="w-full"
                >
                  Compress PDF
                </ActionButton>
              </>
            )}
          </>
        )}

        {/* Processing / Result */}
        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Compressing your PDF..." : undefined}
          resultFile={resultFile || undefined}
          originalSize={files[0]?.file.size}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
