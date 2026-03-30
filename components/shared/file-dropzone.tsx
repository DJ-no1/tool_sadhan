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
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer",
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900",
        )}
      >
        <Upload
          className={cn(
            "h-12 w-12 mb-4 transition-colors",
            isDragging ? "text-blue-500" : "text-zinc-500",
          )}
        />
        <h3 className="text-lg font-semibold mb-2">
          Drop {multiple ? "files" : "file"} here
        </h3>
        <p className="text-sm text-zinc-400 mb-6">
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
        <Button asChild size="sm" className="px-4">
          <label htmlFor={inputId} className="cursor-pointer">
            <Upload className="h-4 w-4" />
            Select {multiple ? "Files" : "File"}
          </label>
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded bg-zinc-800 p-2">
                  <Upload className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-zinc-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
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
