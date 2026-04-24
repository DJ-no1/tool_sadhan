"use client";

import { Upload, FileText, X, GripVertical, Plus } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PDFFile {
  id: string;
  file: File;
  pageCount?: number;
  thumbnail?: string;
}

interface PDFDropzoneProps {
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: PDFFile[]) => void;
  sortable?: boolean;
  showThumbnails?: boolean;
  className?: string;
}

export function PDFDropzone({
  multiple = false,
  maxSize = 100,
  maxFiles = 20,
  onFilesChange,
  sortable = false,
  className,
}: PDFDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<PDFFile[]>([]);
  const inputId = useId();

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
      const pdfFiles = newFiles.filter(
        (file) =>
          file.type === "application/pdf" &&
          file.size <= maxSize * 1024 * 1024,
      );

      const processedFiles: PDFFile[] = pdfFiles.map((file) => ({
        id: generateId(),
        file,
      }));

      if (!multiple) {
        setFiles(processedFiles.slice(0, 1));
        onFilesChange?.(processedFiles.slice(0, 1));
      } else {
        const combined = [...files, ...processedFiles].slice(0, maxFiles);
        setFiles(combined);
        onFilesChange?.(combined);
      }
    },
    [files, maxFiles, maxSize, multiple, onFilesChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [processFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const removeFile = (id: string) => {
    const newFiles = files.filter((f) => f.id !== id);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const clearAll = () => {
    setFiles([]);
    onFilesChange?.([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

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
            ? "border-red-500/60 bg-red-500/[0.06] ring-2 ring-red-500/25"
            : "border-border-strong bg-surface hover:border-red-500/50 hover:bg-surface-2",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-dot-grid opacity-30 mask-radial-fade"
          aria-hidden="true"
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 -top-20 -z-0 h-40 bg-gradient-to-b from-red-500/15 to-transparent opacity-0 blur-2xl transition-opacity duration-300",
            (isDragging || "group-hover:opacity-100") && "",
            isDragging && "opacity-100",
          )}
          aria-hidden="true"
        />

        <div
          className={cn(
            "relative mb-4 flex h-14 w-14 items-center justify-center rounded-lg transition-all duration-200",
            isDragging
              ? "bg-red-500/20 ring-2 ring-red-500/40 scale-105"
              : "bg-red-500/10 ring-1 ring-red-500/20 group-hover:scale-105",
          )}
        >
          <Upload
            className={cn(
              "h-6 w-6 transition-colors duration-200",
              isDragging ? "text-red-400" : "text-red-400/80",
            )}
          />
        </div>

        <h3 className="relative mb-1.5 text-lg font-semibold text-foreground">
          {files.length > 0 && multiple
            ? "Add more files"
            : "Drop your PDF here"}
        </h3>
        <p className="relative mb-5 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
          or click anywhere to browse • Max{" "}
          <span className="font-mono text-foreground">{maxSize}MB</span> per
          file
          {multiple && (
            <>
              {" "}
              • Up to{" "}
              <span className="font-mono text-foreground">{maxFiles}</span>{" "}
              files
            </>
          )}
        </p>

        <input
          id={inputId}
          type="file"
          accept=".pdf,application/pdf"
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
                className="border-border bg-surface-2 font-mono text-[10px] text-muted-foreground"
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
            {files.map((pdfFile, index) => (
              <div
                key={pdfFile.id}
                className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-surface p-3 transition-colors hover:border-border-strong"
              >
                {sortable && (
                  <div className="cursor-grab text-muted-foreground transition-colors hover:text-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                )}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20">
                  <FileText className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    {pdfFile.file.name}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <span className="font-mono">
                      {formatFileSize(pdfFile.file.size)}
                    </span>
                    {multiple && (
                      <>
                        <span>·</span>
                        <span>#{index + 1}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {sortable && files.length > 1 && (
                    <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => moveFile(index, index - 1)}
                        className="h-7 w-7 text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === files.length - 1}
                        onClick={() => moveFile(index, index + 1)}
                        className="h-7 w-7 text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
                      >
                        ↓
                      </Button>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(pdfFile.id)}
                    className="h-7 w-7 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
