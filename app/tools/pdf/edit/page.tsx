"use client";

import { useState, useCallback } from "react";
import { Pencil, Type, Image, Trash2, Square, Circle, Plus, Eraser, Undo, Redo } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  PDFPreview,
  ProcessingPanel,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PDFFile {
  id: string;
  file: File;
}

type EditTool = "select" | "text" | "draw" | "highlight" | "shape" | "image" | "eraser" | "whiteout";

interface Annotation {
  id: string;
  type: EditTool;
  x: number;
  y: number;
  content?: string;
  color?: string;
  width?: number;
  height?: number;
}

export default function EditPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Editor state
  const [currentTool, setCurrentTool] = useState<EditTool>("select");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [brushSize, setBrushSize] = useState(3);
  const [fontSize, setFontSize] = useState(14);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    setAnnotations([]);
  }, []);

  const handleSave = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [20, 40, 60, 80, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", "_edited.pdf"),
      size: files[0].file.size * 1.05,
    });

    setStatus("completed");
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setAnnotations([]);
  };

  const handleDownload = () => {
    console.log("Downloading edited PDF");
  };

  const tools: { id: EditTool; icon: typeof Pencil; label: string; desc: string }[] = [
    { id: "select", icon: Plus, label: "Select", desc: "Select & move objects" },
    { id: "text", icon: Type, label: "Text", desc: "Add text" },
    { id: "draw", icon: Pencil, label: "Draw", desc: "Freehand draw" },
    { id: "highlight", icon: Square, label: "Highlight", desc: "Highlight text" },
    { id: "shape", icon: Circle, label: "Shape", desc: "Add shapes" },
    { id: "image", icon: Image, label: "Image", desc: "Insert image" },
    { id: "whiteout", icon: Square, label: "Whiteout", desc: "Cover content" },
    { id: "eraser", icon: Eraser, label: "Eraser", desc: "Remove annotations" },
  ];

  const colors = ["#ff0000", "#0066ff", "#00cc00", "#ffcc00", "#ff6600", "#9900cc", "#000000"];

  return (
    <PDFToolLayout
      title="Edit PDF"
      description="Edit your PDF documents. Add text, images, shapes, and annotations."
      icon={Pencil}
      features={["Add text", "Draw & annotate", "Insert images"]}
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
                {/* Toolbar */}
                <div className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {tools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => setCurrentTool(tool.id)}
                        title={tool.desc}
                        className={cn(
                          "p-3 rounded-lg border transition-all flex items-center gap-2",
                          currentTool === tool.id
                            ? "border-red-500 bg-red-500/10 text-red-500"
                            : "border-border-strong/50 bg-surface-2/30 text-muted-foreground hover:text-foreground hover:border-border-strong"
                        )}
                      >
                        <tool.icon className="h-5 w-5" />
                        <span className="text-sm font-medium hidden sm:inline">{tool.label}</span>
                      </button>
                    ))}

                    {/* Divider */}
                    <div className="h-10 w-px bg-surface-3 mx-2" />

                    {/* Undo/Redo */}
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Undo className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Redo className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Tool Options */}
                  <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
                    {/* Color Picker */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Color:</span>
                      <div className="flex gap-1">
                        {colors.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCurrentColor(c)}
                            className={cn(
                              "w-6 h-6 rounded border-2 transition-all",
                              currentColor === c ? "border-white scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Brush Size (for draw tool) */}
                    {(currentTool === "draw" || currentTool === "eraser") && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Size:</span>
                        <Slider
                          value={[brushSize]}
                          onValueChange={([v]) => setBrushSize(v)}
                          min={1}
                          max={20}
                          step={1}
                          className="w-24"
                        />
                        <span className="text-sm w-6">{brushSize}</span>
                      </div>
                    )}

                    {/* Font Size (for text tool) */}
                    {currentTool === "text" && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Font:</span>
                        <Slider
                          value={[fontSize]}
                          onValueChange={([v]) => setFontSize(v)}
                          min={8}
                          max={72}
                          step={1}
                          className="w-24"
                        />
                        <span className="text-sm w-8">{fontSize}pt</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Editor Canvas with Real Preview */}
                <PDFPreview
                  file={files[0].file}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  showThumbnails={true}
                  showToolbar={true}
                />

                {/* Annotations List */}
                {annotations.length > 0 && (
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Annotations ({annotations.length})</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAnnotations([])}
                        className="text-red-500 hover:text-red-400"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {annotations.map((ann) => (
                        <div
                          key={ann.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-surface-2"
                        >
                          <span className="text-sm capitalize">{ann.type}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setAnnotations(annotations.filter((a) => a.id !== ann.id))}
                            className="h-6 w-6 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <ActionButton
                  icon={Pencil}
                  onClick={handleSave}
                  className="w-full"
                >
                  Save Changes
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Applying changes to PDF..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
