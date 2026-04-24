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
import { Input } from "@/components/ui/input";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  loadPdfDocument,
  savePdfToBlob,
  stripPdfExtension,
} from "@/lib/tools/pdf";

interface PDFFile {
  id: string;
  file: File;
}

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const int = parseInt(n, 16);
  return {
    r: ((int >> 16) & 255) / 255,
    g: ((int >> 8) & 255) / 255,
    b: (int & 255) / 255,
  };
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
    blob?: Blob;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
  }, []);

  const handleSave = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(10);
    setErrorMessage(null);

    try {
      const doc: PDFDocument = await loadPdfDocument(files[0].file);
      setProgress(40);

      if (annotations.length > 0) {
        const font = await doc.embedFont(StandardFonts.Helvetica);
        for (const ann of annotations) {
          const page = doc.getPage(
            Math.max(0, Math.min(doc.getPageCount() - 1, (ann as Annotation & { page?: number }).page ? ((ann as Annotation & { page?: number }).page as number) - 1 : currentPage - 1)),
          );
          const { width, height } = page.getSize();
          const color = parseHexColor(ann.color ?? currentColor);
          const x = (ann.x / 100) * width;
          const y = height - (ann.y / 100) * height;

          if (ann.type === "text" && ann.content) {
            page.drawText(ann.content, {
              x,
              y,
              size: fontSize,
              font,
              color: rgb(color.r, color.g, color.b),
            });
          } else if (ann.type === "whiteout") {
            page.drawRectangle({
              x,
              y: y - (ann.height ?? 20),
              width: ann.width ?? 100,
              height: ann.height ?? 20,
              color: rgb(1, 1, 1),
            });
          } else if (ann.type === "highlight") {
            page.drawRectangle({
              x,
              y: y - (ann.height ?? 16),
              width: ann.width ?? 120,
              height: ann.height ?? 16,
              color: rgb(color.r, color.g, color.b),
              opacity: 0.35,
            });
          }
        }
      }

      setProgress(80);
      const blob = await savePdfToBlob(doc);
      setResultFile({
        name: `${stripPdfExtension(files[0].file.name)}_edited.pdf`,
        size: blob.size,
        blob,
      });
      setProgress(100);
      setStatus("completed");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save PDF.",
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setAnnotations([]);
    setErrorMessage(null);
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

                {/* Quick text annotation form (adds to the annotations list) */}
                {currentTool === "text" && (
                  <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Add text annotation</h3>
                    <TextAnnotationForm
                      onAdd={({ content, x, y }) =>
                        setAnnotations((prev) => [
                          ...prev,
                          {
                            id: `${Date.now()}-${Math.random()}`,
                            type: "text",
                            x,
                            y,
                            content,
                            color: currentColor,
                          },
                        ])
                      }
                    />
                  </div>
                )}

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
          message={
            status === "processing"
              ? "Applying changes to PDF..."
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

function TextAnnotationForm({
  onAdd,
}: {
  onAdd: (v: { content: string; x: number; y: number }) => void;
}) {
  const [content, setContent] = useState("");
  const [x, setX] = useState(20);
  const [y, setY] = useState(20);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <Input
        placeholder="Text to insert"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="md:col-span-2 bg-surface-2 border-border-strong"
      />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">X%</span>
        <Input
          type="number"
          min={0}
          max={100}
          value={x}
          onChange={(e) => setX(parseInt(e.target.value) || 0)}
          className="bg-surface-2 border-border-strong"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Y%</span>
        <Input
          type="number"
          min={0}
          max={100}
          value={y}
          onChange={(e) => setY(parseInt(e.target.value) || 0)}
          className="bg-surface-2 border-border-strong"
        />
      </div>
      <Button
        onClick={() => {
          if (!content.trim()) return;
          onAdd({ content, x, y });
          setContent("");
        }}
        className="md:col-span-4 bg-red-500 hover:bg-red-600"
      >
        Add annotation
      </Button>
    </div>
  );
}
