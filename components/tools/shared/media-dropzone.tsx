"use client";

import {
  Upload,
  X,
  Plus,
  type LucideIcon,
  FileImage,
  FileVideo,
  FileText,
} from "lucide-react";
import { useCallback, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type MediaFile = {
  id: string;
  file: File;
  previewUrl?: string;
};

type Accent = "red" | "blue" | "purple";

interface MediaDropzoneProps {
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  accept?: string;
  acceptLabel?: string;
  accent?: Accent;
  kind?: "pdf" | "image" | "video" | "generic";
  title?: string;
  onFilesChange?: (files: MediaFile[]) => void;
  className?: string;
}

const accentStyles: Record<
  Accent,
  {
    dragBorder: string;
    dragBg: string;
    dragRing: string;
    hoverBorder: string;
    hoverGlow: string;
    iconBg: string;
    iconRing: string;
    iconText: string;
    iconTextMuted: string;
    glow: string;
    listIconBg: string;
    listIconRing: string;
    listIconText: string;
    removeHoverBg: string;
    removeHoverText: string;
  }
> = {
  red: {
    dragBorder: "border-red-500/60",
    dragBg: "bg-red-500/[0.06]",
    dragRing: "ring-2 ring-red-500/25",
    hoverBorder: "hover:border-red-500/50",
    hoverGlow: "group-hover:opacity-100",
    iconBg: "bg-red-500/10",
    iconRing: "ring-red-500/25",
    iconText: "text-red-400",
    iconTextMuted: "text-red-400/80",
    glow: "from-red-500/15",
    listIconBg: "bg-red-500/10",
    listIconRing: "ring-red-500/25",
    listIconText: "text-red-400",
    removeHoverBg: "hover:bg-red-500/10",
    removeHoverText: "hover:text-red-400",
  },
  blue: {
    dragBorder: "border-blue-500/60",
    dragBg: "bg-blue-500/[0.06]",
    dragRing: "ring-2 ring-blue-500/25",
    hoverBorder: "hover:border-blue-500/50",
    hoverGlow: "group-hover:opacity-100",
    iconBg: "bg-blue-500/10",
    iconRing: "ring-blue-500/25",
    iconText: "text-blue-400",
    iconTextMuted: "text-blue-400/80",
    glow: "from-blue-500/15",
    listIconBg: "bg-blue-500/10",
    listIconRing: "ring-blue-500/25",
    listIconText: "text-blue-400",
    removeHoverBg: "hover:bg-blue-500/10",
    removeHoverText: "hover:text-blue-400",
  },
  purple: {
    dragBorder: "border-purple-500/60",
    dragBg: "bg-purple-500/[0.06]",
    dragRing: "ring-2 ring-purple-500/25",
    hoverBorder: "hover:border-purple-500/50",
    hoverGlow: "group-hover:opacity-100",
    iconBg: "bg-purple-500/10",
    iconRing: "ring-purple-500/25",
    iconText: "text-purple-400",
    iconTextMuted: "text-purple-400/80",
    glow: "from-purple-500/15",
    listIconBg: "bg-purple-500/10",
    listIconRing: "ring-purple-500/25",
    listIconText: "text-purple-400",
    removeHoverBg: "hover:bg-purple-500/10",
    removeHoverText: "hover:text-purple-400",
  },
};

const kindIconMap: Record<string, LucideIcon> = {
  pdf: FileText,
  image: FileImage,
  video: FileVideo,
  generic: FileText,
};

export function MediaDropzone({
  multiple = false,
  maxSize = 100,
  maxFiles = 20,
  accept = "*",
  acceptLabel,
  accent = "blue",
  kind = "generic",
  title,
  onFilesChange,
  className,
}: MediaDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const inputId = useId();
  const a = accentStyles[accent];
  const FileIcon = kindIconMap[kind] || FileText;

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

  const processFiles = useCallback(
    (newFiles: File[]) => {
      const filtered = newFiles.filter(
        (file) => file.size <= maxSize * 1024 * 1024,
      );

      const processed: MediaFile[] = filtered.map((file) => ({
        id: generateId(),
        file,
        previewUrl:
          kind === "image" && file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
      }));

      if (!multiple) {
        const next = processed.slice(0, 1);
        setFiles(next);
        onFilesChange?.(next);
      } else {
        const combined = [...files, ...processed].slice(0, maxFiles);
        setFiles(combined);
        onFilesChange?.(combined);
      }
    },
    [files, kind, maxFiles, maxSize, multiple, onFilesChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      processFiles(dropped);
    },
    [processFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    processFiles(selected);
  };

  const removeFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    onFilesChange?.(next);
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setFiles([]);
    onFilesChange?.([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const kindLabel =
    kind === "pdf"
      ? "PDF"
      : kind === "image"
      ? "image"
      : kind === "video"
      ? "video"
      : "file";

  return (
    <div className={cn("space-y-4", className)}>
      <label
        htmlFor={inputId}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 md:p-14",
          isDragging
            ? cn(a.dragBorder, a.dragBg, a.dragRing)
            : cn(
                "border-border-strong bg-surface hover:bg-surface-2",
                a.hoverBorder,
              ),
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-dot-grid opacity-30 mask-radial-fade"
          aria-hidden="true"
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 -top-20 -z-0 h-40 bg-gradient-to-b to-transparent opacity-0 blur-2xl transition-opacity duration-300",
            a.glow,
            isDragging ? "opacity-100" : a.hoverGlow,
          )}
          aria-hidden="true"
        />

        <div
          className={cn(
            "relative mb-4 flex h-14 w-14 items-center justify-center rounded-lg ring-1 ring-inset transition-all duration-200",
            isDragging ? "scale-105" : "group-hover:scale-105",
            a.iconBg,
            a.iconRing,
          )}
        >
          <Upload
            className={cn(
              "h-6 w-6 transition-colors duration-200",
              isDragging ? a.iconText : a.iconTextMuted,
            )}
          />
        </div>

        <h3 className="relative mb-1.5 text-lg font-semibold text-foreground">
          {files.length > 0 && multiple
            ? "Add more files"
            : title ?? `Drop your ${kindLabel} here`}
        </h3>
        <p className="relative mb-5 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
          or click anywhere to browse • Max{" "}
          <span className="font-mono text-foreground">{maxSize}MB</span>
          {multiple && (
            <>
              {" "}
              • Up to{" "}
              <span className="font-mono text-foreground">{maxFiles}</span>{" "}
              files
            </>
          )}
          {acceptLabel && (
            <>
              {" "}
              • <span className="font-mono text-foreground">{acceptLabel}</span>
            </>
          )}
        </p>

        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <Button
          asChild
          size="sm"
          className="relative pointer-events-none bg-foreground text-background hover:bg-foreground/90"
        >
          <span className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Choose {multiple ? "files" : "file"}
          </span>
        </Button>
      </label>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
              <Badge
                variant="outline"
                className="border-border-strong bg-surface-2 font-mono text-[10px] text-muted-foreground"
              >
                {files.length}
              </Badge>
              file{files.length > 1 ? "s" : ""} ready
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>

          <div className="space-y-2">
            {files.map((mediaFile, index) => (
              <div
                key={mediaFile.id}
                className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-border-strong bg-surface p-3 transition-colors hover:bg-surface-2"
              >
                {mediaFile.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaFile.previewUrl}
                    alt={mediaFile.file.name}
                    className="h-10 w-10 shrink-0 rounded-md object-cover ring-1 ring-border-strong"
                  />
                ) : (
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-md ring-1 ring-inset",
                      a.listIconBg,
                      a.listIconRing,
                      a.listIconText,
                    )}
                  >
                    <FileIcon className="h-4 w-4" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    {mediaFile.file.name}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <span className="font-mono">
                      {formatFileSize(mediaFile.file.size)}
                    </span>
                    {multiple && (
                      <>
                        <span>·</span>
                        <span>#{index + 1}</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(mediaFile.id)}
                  className={cn(
                    "h-7 w-7 text-muted-foreground",
                    a.removeHoverBg,
                    a.removeHoverText,
                  )}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
