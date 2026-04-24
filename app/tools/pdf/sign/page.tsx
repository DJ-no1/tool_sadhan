"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PenTool, Type, Upload, Trash2, Move, RotateCw, RotateCcw, Check } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PDFFile {
  id: string;
  file: File;
}

interface SignatureData {
  type: "draw" | "text" | "image";
  data: string;
  color: string;
}

type SignMode = "draw" | "type" | "upload";

export default function SignPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Signature state
  const [signMode, setSignMode] = useState<SignMode>("draw");
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const [textSignature, setTextSignature] = useState("");
  const [signatureColor, setSignatureColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(32);
  
  // Canvas drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Position on PDF
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 80 });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    setSignature(null);
  }, []);

  // Canvas drawing functions
  useEffect(() => {
    if (signMode === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [signMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    setLastPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.strokeStyle = signatureColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setSignature(null);
  };

  const saveDrawnSignature = () => {
    if (!canvasRef.current) return;
    const data = canvasRef.current.toDataURL("image/png");
    setSignature({ type: "draw", data, color: signatureColor });
  };

  const saveTextSignature = () => {
    if (!textSignature.trim()) return;
    setSignature({ type: "text", data: textSignature, color: signatureColor });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSignature({ type: "image", data: event.target?.result as string, color: "#000000" });
    };
    reader.readAsDataURL(file);
  };

  const handleSign = async () => {
    if (files.length === 0 || !signature) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [30, 60, 90, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", "_signed.pdf"),
      size: files[0].file.size * 1.02,
    });

    setStatus("completed");
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setSignature(null);
    setTextSignature("");
  };

  const handleDownload = () => {
    console.log("Downloading signed PDF");
  };

  const colors = ["#000000", "#0066cc", "#333333", "#1a5f2a", "#7b2cbf"];

  const fontStyles = [
    { name: "Script", font: "cursive" },
    { name: "Elegant", font: "Georgia, serif" },
    { name: "Clean", font: "Arial, sans-serif" },
    { name: "Handwritten", font: "'Brush Script MT', cursive" },
  ];

  return (
    <PDFToolLayout
      title="Sign PDF"
      description="Add your signature to PDF documents. Draw, type, or upload your signature."
      icon={PenTool}
      features={["Draw signature", "Type name", "Upload image"]}
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
                {/* Signature Creation */}
                <div className="rounded-lg border border-border bg-surface p-6">
                  <h3 className="font-semibold mb-4">Create Your Signature</h3>
                  
                  {/* Mode Tabs */}
                  <div className="flex gap-2 mb-6">
                    {[
                      { id: "draw" as const, icon: PenTool, label: "Draw" },
                      { id: "type" as const, icon: Type, label: "Type" },
                      { id: "upload" as const, icon: Upload, label: "Upload" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSignMode(mode.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                          signMode === mode.id
                            ? "bg-red-500 text-foreground"
                            : "bg-surface-2 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <mode.icon className="h-4 w-4" />
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {/* Draw Mode */}
                  {signMode === "draw" && (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden">
                        <canvas
                          ref={canvasRef}
                          width={500}
                          height={200}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          className="w-full h-[200px] rounded-lg border border-border-strong cursor-crosshair bg-surface"
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearCanvas}
                            className="bg-surface-2/80 hover:bg-surface-3"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Clear
                          </Button>
                          <Button
                            size="sm"
                            onClick={saveDrawnSignature}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Draw your signature using your mouse or touchpad
                      </p>
                    </div>
                  )}

                  {/* Type Mode */}
                  {signMode === "type" && (
                    <div className="space-y-4">
                      <Input
                        value={textSignature}
                        onChange={(e) => setTextSignature(e.target.value)}
                        placeholder="Type your name"
                        className="text-2xl py-6 bg-surface-2 border-border-strong text-center"
                        style={{ fontFamily: "cursive" }}
                      />
                      
                      {/* Font Size */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Size:</span>
                        <Slider
                          value={[fontSize]}
                          onValueChange={([v]) => setFontSize(v)}
                          min={16}
                          max={48}
                          step={2}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-8">{fontSize}</span>
                      </div>

                      {/* Preview */}
                      <div className="p-4 rounded-lg bg-white min-h-[100px] flex items-center justify-center">
                        <span
                          style={{
                            fontFamily: "cursive",
                            fontSize: `${fontSize}px`,
                            color: signatureColor,
                          }}
                        >
                          {textSignature || "Preview"}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={saveTextSignature}
                          disabled={!textSignature.trim()}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Use This Signature
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Upload Mode */}
                  {signMode === "upload" && (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border-strong rounded-lg p-8 text-center">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload an image of your signature (PNG, JPG)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="signature-upload"
                        />
                        <Button asChild className="bg-red-500 hover:bg-red-600">
                          <label htmlFor="signature-upload" className="cursor-pointer">
                            Choose Image
                          </label>
                        </Button>
                      </div>
                      
                      {signature?.type === "image" && (
                        <div className="p-4 rounded-lg bg-white flex items-center justify-center">
                          <img
                            src={signature.data}
                            alt="Signature"
                            className="max-h-[100px] object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Color Selection */}
                  {signMode !== "upload" && (
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground mb-2">Signature Color</p>
                      <div className="flex gap-2">
                        {colors.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setSignatureColor(c)}
                            className={cn(
                              "w-8 h-8 rounded-lg border-2 transition-all",
                              signatureColor === c ? "border-white scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Signature Preview / Status */}
                {signature && (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <h3 className="font-semibold text-green-500">Signature Ready</h3>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 flex items-center justify-center min-h-[80px]">
                      {signature.type === "draw" || signature.type === "image" ? (
                        <img
                          src={signature.data}
                          alt="Your signature"
                          className="max-h-[60px] object-contain"
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: "cursive",
                            fontSize: `${fontSize}px`,
                            color: signature.color,
                          }}
                        >
                          {signature.data}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Position Options */}
                {signature && (
                  <OptionsPanel>
                    <OptionGroup title="Signature Position">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { x: 20, y: 20, label: "Top Left" },
                          { x: 50, y: 20, label: "Top Center" },
                          { x: 80, y: 20, label: "Top Right" },
                          { x: 20, y: 80, label: "Bottom Left" },
                          { x: 50, y: 80, label: "Bottom Center" },
                          { x: 80, y: 80, label: "Bottom Right" },
                        ].map((pos) => (
                          <button
                            key={pos.label}
                            type="button"
                            onClick={() => setSignaturePosition({ x: pos.x, y: pos.y })}
                            className={cn(
                              "p-3 rounded-lg border text-sm transition-all",
                              signaturePosition.x === pos.x && signaturePosition.y === pos.y
                                ? "border-red-500 bg-red-500/10 text-red-500"
                                : "border-border-strong bg-surface-2 text-muted-foreground hover:border-border-strong"
                            )}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </OptionGroup>

                    <OptionGroup title="Page" className="mt-6">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Sign on page:</span>
                        <Input
                          type="number"
                          value={currentPage}
                          onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
                          min={1}
                          className="w-20 bg-surface-2 border-border-strong"
                        />
                        <span className="text-sm text-muted-foreground">(Last page = -1)</span>
                      </div>
                    </OptionGroup>
                  </OptionsPanel>
                )}

                <ActionButton
                  icon={PenTool}
                  onClick={handleSign}
                  disabled={!signature}
                  className="w-full"
                >
                  Sign PDF
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Adding signature to PDF..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
