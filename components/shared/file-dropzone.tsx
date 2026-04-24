"use client";

import { Upload, X } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function FileDropzone({
  accept = "*",
  multiple = false,
  maxSize = 10,
  onFilesSelected,
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputId = useId();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(
        (file) => file.size <= maxSize * 1024 * 1024,
      );

      if (!multiple && validFiles.length > 0) {
        const newFiles = [validFiles[0]];
        setFiles(newFiles);
        onFilesSelected?.(newFiles);
      } else {
        const newFiles = multiple ? validFiles : validFiles.slice(0, 1);
        setFiles(newFiles);
        onFilesSelected?.(newFiles);
      }
    },
    [maxSize, multiple, onFilesSelected],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.size <= maxSize * 1024 * 1024,
    );

    if (!multiple && validFiles.length > 0) {
      const newFiles = [validFiles[0]];
      setFiles(newFiles);
      onFilesSelected?.(newFiles);
    } else {
      const newFiles = multiple ? validFiles : validFiles.slice(0, 1);
      setFiles(newFiles);
      onFilesSelected?.(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected?.(newFiles);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors",
          isDragging
            ? "border-foreground bg-surface-2"
            : "border-border-strong bg-surface hover:border-foreground/60 hover:bg-surface-2",
        )}
      >
        <Upload
          className={cn(
            "h-10 w-10 mb-4 transition-colors",
            isDragging ? "text-[--foreground]" : "text-[--muted-foreground]",
          )}
        />
        <h3 className="mb-1 text-base font-medium text-[--foreground]">
          Drop {multiple ? "files" : "file"} here
        </h3>
        <p className="mb-5 text-[13px] text-[--muted-foreground]">
          or click to browse • Max {maxSize}MB per file
        </p>
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
        <Button asChild size="sm" variant="outline">
          <label htmlFor={inputId} className="cursor-pointer">
            <Upload className="h-3.5 w-3.5" />
            Select {multiple ? "files" : "file"}
          </label>
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border border-[--border] bg-[--surface] p-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-sm border border-[--border] bg-[--surface-2] p-1.5">
                  <Upload className="h-3.5 w-3.5 text-[--muted-foreground]" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[--foreground]">
                    {file.name}
                  </p>
                  <p className="text-[12px] text-[--muted-foreground]">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="h-8 w-8 text-[--muted-foreground] hover:bg-[--surface-2] hover:text-[--foreground]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
