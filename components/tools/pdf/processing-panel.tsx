"use client";

import { Loader2, CheckCircle2, XCircle, Download, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type ProcessingStatus = "idle" | "processing" | "completed" | "error";

interface ProcessingPanelProps {
  status: ProcessingStatus;
  progress?: number;
  message?: string;
  resultFile?: {
    name: string;
    size: number;
    url?: string;
  };
  originalSize?: number;
  onDownload?: () => void;
  onReset?: () => void;
  className?: string;
}

export function ProcessingPanel({
  status,
  progress = 0,
  message,
  resultFile,
  originalSize,
  onDownload,
  onReset,
  className,
}: ProcessingPanelProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const calculateSavings = () => {
    if (!originalSize || !resultFile?.size) return null;
    const savings = ((originalSize - resultFile.size) / originalSize) * 100;
    return savings > 0 ? savings.toFixed(1) : null;
  };

  const savings = calculateSavings();

  if (status === "idle") return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all",
        className
      )}
    >
      {/* Processing State */}
      {status === "processing" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-xl animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold">Processing...</h3>
              <p className="text-sm text-zinc-400">{message || "Please wait while we process your file"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-zinc-500 text-right">{Math.round(progress)}%</p>
          </div>
        </div>
      )}

      {/* Completed State */}
      {status === "completed" && resultFile && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-green-500/20 blur-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-green-500">Complete!</h3>
              <p className="text-sm text-zinc-400">{message || "Your file is ready to download"}</p>
            </div>
          </div>

          {/* Result Card */}
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-16 rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/20 flex items-center justify-center">
                <FileText className="h-7 w-7 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{resultFile.name}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-zinc-400">{formatSize(resultFile.size)}</span>
                  {savings && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span className="text-green-500 font-medium">-{savings}% smaller</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Size Comparison */}
          {originalSize && savings && (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
                <p className="text-sm text-zinc-500 mb-1">Original</p>
                <p className="text-lg font-semibold text-zinc-400">{formatSize(originalSize)}</p>
              </div>
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
                <p className="text-sm text-green-500/70 mb-1">Compressed</p>
                <p className="text-lg font-semibold text-green-500">{formatSize(resultFile.size)}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onDownload}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Process Another
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-red-500/20 blur-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-red-500">Error</h3>
              <p className="text-sm text-zinc-400">{message || "Something went wrong. Please try again."}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
