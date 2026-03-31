"use client";

import { useState, useCallback } from "react";
import { FileImage, GripVertical, Trash2, RotateCw, Settings2 } from "lucide-react";
import {
  PDFToolLayout,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  rotation: number;
}

type PageSize = "a4" | "letter" | "legal" | "fit";
type Orientation = "portrait" | "landscape" | "auto";
type Margin = "none" | "small" | "normal" | "large";

export default function JPGToPDFPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Options
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState<Margin>("normal");
  const [imageQuality, setImageQuality] = useState(90);

  const generateId = () => Math.random().toString(36).substring(7);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const processImages = useCallback((files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [
          ...prev,
          {
            id: generateId(),
            file,
            preview: e.target?.result as string,
            rotation: 0,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      processImages(droppedFiles);
    },
    [processImages]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processImages(selectedFiles);
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const rotateImage = (id: string) => {
    setImages(images.map((img) =>
      img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
    ));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [15, 35, 55, 75, 90, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(p);
    }

    setResultFile({
      name: "images_to_pdf.pdf",
      size: images.reduce((acc, img) => acc + img.file.size, 0) * 0.8,
    });

    setStatus("completed");
  };

  const handleReset = () => {
    setImages([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
  };

  const handleDownload = () => {
    console.log("Downloading PDF");
  };

  const pageSizes = [
    { id: "a4" as const, name: "A4", desc: "210 × 297 mm" },
    { id: "letter" as const, name: "Letter", desc: "8.5 × 11 in" },
    { id: "legal" as const, name: "Legal", desc: "8.5 × 14 in" },
    { id: "fit" as const, name: "Fit to Image", desc: "Auto size" },
  ];

  const margins = [
    { id: "none" as const, name: "No Margin" },
    { id: "small" as const, name: "Small" },
    { id: "normal" as const, name: "Normal" },
    { id: "large" as const, name: "Large" },
  ];

  return (
    <PDFToolLayout
      title="JPG to PDF"
      description="Convert images to PDF. Combine multiple images into a single PDF document with custom layout options."
      icon={FileImage}
      features={["Multiple formats", "Custom page size", "Drag to reorder"]}
    >
      <div className="space-y-6">
        {status === "idle" && (
          <>
            {/* Image Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all cursor-pointer overflow-hidden",
                isDragging
                  ? "border-red-500 bg-red-500/10"
                  : "border-zinc-700/50 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-900/50"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              
              <div className="relative z-10">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors",
                  isDragging ? "bg-red-500/20" : "bg-zinc-800"
                )}>
                  <FileImage className={cn(
                    "h-8 w-8 transition-colors",
                    isDragging ? "text-red-500" : "text-zinc-400"
                  )} />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {images.length > 0 ? "Add more images" : "Drop your images here"}
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  JPG, PNG, GIF, WebP • Max 100MB per file
                </p>
                
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <Button asChild className="bg-red-500 hover:bg-red-600 text-white px-6">
                  <label htmlFor="image-input" className="cursor-pointer">
                    Select Images
                  </label>
                </Button>
              </div>
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{images.length} Image{images.length > 1 ? "s" : ""}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setImages([])}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    Clear all
                  </Button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      className="group relative rounded-xl border border-zinc-700 bg-zinc-800/50 overflow-hidden"
                    >
                      {/* Image Preview */}
                      <div className="aspect-square relative">
                        <img
                          src={img.preview}
                          alt={img.file.name}
                          className="w-full h-full object-cover"
                          style={{ transform: `rotate(${img.rotation}deg)` }}
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => rotateImage(img.id)}
                            className="h-8 w-8 bg-zinc-800/80 text-white hover:bg-zinc-700"
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeImage(img.id)}
                            className="h-8 w-8 bg-red-500/80 text-white hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Order badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-zinc-900/90 text-xs font-medium">
                          {index + 1}
                        </div>
                      </div>

                      {/* Reorder buttons */}
                      <div className="p-2 flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === 0}
                          onClick={() => moveImage(index, index - 1)}
                          className="h-6 w-6 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          ←
                        </Button>
                        <GripVertical className="h-6 w-6 text-zinc-600" />
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === images.length - 1}
                          onClick={() => moveImage(index, index + 1)}
                          className="h-6 w-6 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            {images.length > 0 && (
              <>
                <OptionsPanel
                  advancedChildren={
                    <div className="space-y-6">
                      <OptionGroup title="Image Quality">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Quality: {imageQuality}%</span>
                          </div>
                          <Slider
                            value={[imageQuality]}
                            onValueChange={([v]) => setImageQuality(v)}
                            min={30}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      </OptionGroup>

                      <OptionGroup title="Page Orientation">
                        <div className="grid grid-cols-3 gap-2">
                          {(["portrait", "landscape", "auto"] as Orientation[]).map((o) => (
                            <button
                              key={o}
                              type="button"
                              onClick={() => setOrientation(o)}
                              className={`py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                                orientation === o
                                  ? "border-red-500 bg-red-500/10 text-red-500"
                                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                              }`}
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      </OptionGroup>
                    </div>
                  }
                >
                  {/* Page Size */}
                  <OptionGroup title="Page Size">
                    <div className="grid grid-cols-2 gap-2">
                      {pageSizes.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setPageSize(size.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            pageSize === size.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                          }`}
                        >
                          <p className="font-medium">{size.name}</p>
                          <p className="text-xs text-zinc-400">{size.desc}</p>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>

                  {/* Margin */}
                  <OptionGroup title="Page Margin" className="mt-6">
                    <div className="grid grid-cols-4 gap-2">
                      {margins.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMargin(m.id)}
                          className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                            margin === m.id
                              ? "border-red-500 bg-red-500/10 text-red-500"
                              : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                          }`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </OptionGroup>
                </OptionsPanel>

                <ActionButton
                  icon={FileImage}
                  onClick={handleConvert}
                  className="w-full"
                >
                  Convert to PDF ({images.length} image{images.length > 1 ? "s" : ""})
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Creating PDF from images..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
