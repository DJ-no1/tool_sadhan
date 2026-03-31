"use client";

import { useState, useCallback } from "react";
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, FileText } from "lucide-react";
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
import { Button } from "@/components/ui/button";

interface PDFFile {
  id: string;
  file: File;
}

type RotationAngle = 0 | 90 | 180 | 270;

interface PageRotation {
  pageNum: number;
  rotation: RotationAngle;
}

export default function RotatePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Rotation options
  const [rotateAll, setRotateAll] = useState<RotationAngle>(90);
  const [applyToAll, setApplyToAll] = useState(true);
  const [pageRotations, setPageRotations] = useState<PageRotation[]>([]);
  const [totalPages] = useState(10); // Simulated page count

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
  }, []);

  const handleRotate = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [25, 50, 75, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", "_rotated.pdf"),
      size: files[0].file.size,
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
    console.log("Downloading rotated PDF");
  };

  const rotationOptions = [
    { angle: 90 as const, label: "90° Right", icon: RotateCw },
    { angle: 180 as const, label: "180°", icon: FlipVertical },
    { angle: 270 as const, label: "90° Left", icon: RotateCcw },
  ];

  return (
    <PDFToolLayout
      title="Rotate PDF"
      description="Rotate all pages or specific pages in your PDF. Perfect for fixing scanned documents."
      icon={RotateCw}
      features={["Rotate all pages", "Individual page rotation", "Preview changes"]}
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
                <OptionsPanel>
                  {/* Apply to */}
                  <OptionGroup title="Apply Rotation">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setApplyToAll(true)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          applyToAll
                            ? "border-red-500 bg-red-500/10"
                            : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                        }`}
                      >
                        <FileText className={`h-6 w-6 mb-2 ${applyToAll ? "text-red-500" : "text-zinc-400"}`} />
                        <p className="font-medium">All Pages</p>
                        <p className="text-sm text-zinc-400">Rotate every page</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplyToAll(false)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          !applyToAll
                            ? "border-red-500 bg-red-500/10"
                            : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                        }`}
                      >
                        <FlipHorizontal className={`h-6 w-6 mb-2 ${!applyToAll ? "text-red-500" : "text-zinc-400"}`} />
                        <p className="font-medium">Select Pages</p>
                        <p className="text-sm text-zinc-400">Choose specific pages</p>
                      </button>
                    </div>
                  </OptionGroup>

                  {/* Rotation Angle */}
                  {applyToAll && (
                    <OptionGroup title="Rotation Angle" className="mt-6">
                      <div className="grid grid-cols-3 gap-3">
                        {rotationOptions.map((option) => (
                          <button
                            key={option.angle}
                            type="button"
                            onClick={() => setRotateAll(option.angle)}
                            className={`p-4 rounded-xl border text-center transition-all ${
                              rotateAll === option.angle
                                ? "border-red-500 bg-red-500/10"
                                : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                            }`}
                          >
                            <option.icon className={`h-8 w-8 mx-auto mb-2 ${
                              rotateAll === option.angle ? "text-red-500" : "text-zinc-400"
                            }`} />
                            <p className="font-medium text-sm">{option.label}</p>
                          </button>
                        ))}
                      </div>
                    </OptionGroup>
                  )}

                  {/* Page selector (simplified) */}
                  {!applyToAll && (
                    <OptionGroup title="Select Pages to Rotate" className="mt-6">
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          const pageRotation = pageRotations.find(p => p.pageNum === pageNum);
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => {
                                if (pageRotation) {
                                  const newRotation = ((pageRotation.rotation + 90) % 360) as RotationAngle;
                                  if (newRotation === 0) {
                                    setPageRotations(pageRotations.filter(p => p.pageNum !== pageNum));
                                  } else {
                                    setPageRotations(pageRotations.map(p => 
                                      p.pageNum === pageNum ? { ...p, rotation: newRotation } : p
                                    ));
                                  }
                                } else {
                                  setPageRotations([...pageRotations, { pageNum, rotation: 90 }]);
                                }
                              }}
                              className={`aspect-[3/4] rounded-lg border flex flex-col items-center justify-center transition-all ${
                                pageRotation
                                  ? "border-red-500 bg-red-500/10"
                                  : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                              }`}
                            >
                              <span className="text-sm font-medium">{pageNum}</span>
                              {pageRotation && (
                                <span className="text-xs text-red-400">{pageRotation.rotation}°</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-zinc-500 mt-3">
                        Click pages to cycle through rotation angles (90° → 180° → 270°)
                      </p>
                    </OptionGroup>
                  )}
                </OptionsPanel>

                {/* PDF Preview */}
                <PDFPreview
                  file={files[0].file}
                  showThumbnails={true}
                  showToolbar={true}
                />

                <ActionButton
                  icon={RotateCw}
                  onClick={handleRotate}
                  className="w-full"
                >
                  Rotate PDF
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Rotating pages..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
