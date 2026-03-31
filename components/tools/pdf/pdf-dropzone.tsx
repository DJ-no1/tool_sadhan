"use client";

import { Upload, FileText, X, GripVertical, Plus } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { Button } from "@/components/ui/button";
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
  showThumbnails = false,
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
          file.type === "application/pdf" && file.size <= maxSize * 1024 * 1024
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
    [files, maxFiles, maxSize, multiple, onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [processFiles]
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
      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all cursor-pointer overflow-hidden",
          isDragging
            ? "border-red-500 bg-red-500/10"
            : "border-zinc-700/50 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-900/50"
        )}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="relative z-10">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors",
            isDragging ? "bg-red-500/20" : "bg-zinc-800"
          )}>
            <Upload
              className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-red-500" : "text-zinc-400"
              )}
            />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {files.length > 0 && multiple ? "Add more files" : "Drop your PDF here"}
          </h3>
          <p className="text-sm text-zinc-400 mb-6">
            or click to browse • Max {maxSize}MB per file
            {multiple && ` • Up to ${maxFiles} files`}
          </p>
          
          <input
            id={inputId}
            type="file"
            accept=".pdf,application/pdf"
            multiple={multiple}
            onChange={handleFileInput}
            className="hidden"
          />
          
          <Button asChild className="bg-red-500 hover:bg-red-600 text-white px-6">
            <label htmlFor={inputId} className="cursor-pointer flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Select PDF{multiple ? "s" : ""}
            </label>
          </Button>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-zinc-400 hover:text-red-500"
            >
              Clear all
            </Button>
          </div>
          
          <div className="space-y-2">
            {files.map((pdfFile, index) => (
              <div
                key={pdfFile.id}
                className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900"
              >
                {sortable && (
                  <div className="cursor-grab text-zinc-600 hover:text-zinc-400">
                    <GripVertical className="h-5 w-5" />
                  </div>
                )}
                
                {/* PDF Icon */}
                <div className="flex-shrink-0 w-12 h-14 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-500" />
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{pdfFile.file.name}</p>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <span>{formatFileSize(pdfFile.file.size)}</span>
                    {multiple && (
                      <span className="text-zinc-600">•</span>
                    )}
                    {multiple && (
                      <span>File {index + 1}</span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  {sortable && files.length > 1 && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => moveFile(index, index - 1)}
                        className="h-8 w-8 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === files.length - 1}
                        onClick={() => moveFile(index, index + 1)}
                        className="h-8 w-8 text-zinc-400 hover:text-white disabled:opacity-30"
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
                    className="h-8 w-8 text-zinc-400 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
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
