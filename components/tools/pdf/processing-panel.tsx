"use client";

import {
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
  FileText,
  RotateCcw,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
    <Card
      className={cn(
        "relative overflow-hidden border-border bg-card p-6",
        className,
      )}
    >
      {status === "processing" && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-0.5 animate-shimmer"
            aria-hidden="true"
          />
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Processing
                </h3>
                <p className="text-[13px] text-muted-foreground">
                  {message || "Please wait while we process your file"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-1.5" />
              <div className="flex items-center justify-between text-[12px] font-mono">
                <span className="text-muted-foreground">
                  {Math.round(progress)}% complete
                </span>
                <span className="text-muted-foreground">
                  {progress < 100 ? "..." : "done"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {status === "completed" && resultFile && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold text-foreground">
                  Complete
                </h3>
                {savings && (
                  <Badge className="border-transparent bg-emerald-500/15 text-[10px] font-medium uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/20">
                    <TrendingDown className="mr-1 h-3 w-3" />
                    {savings}% smaller
                  </Badge>
                )}
              </div>
              <p className="text-[13px] text-muted-foreground">
                {message || "Your file is ready to download"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {resultFile.name}
                </p>
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="font-mono text-muted-foreground">
                    {formatSize(resultFile.size)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {originalSize && savings && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Original
                </p>
                <p className="font-mono text-lg font-semibold text-foreground">
                  {formatSize(originalSize)}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
                  Optimized
                </p>
                <p className="font-mono text-lg font-semibold text-emerald-400">
                  {formatSize(resultFile.size)}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={onDownload} className="flex-1 gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
            <Button variant="outline" onClick={onReset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Process another
            </Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20">
              <XCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-red-400">
                Something went wrong
              </h3>
              <p className="text-[13px] text-muted-foreground">
                {message || "An error occurred. Please try again."}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      )}
    </Card>
  );
}
