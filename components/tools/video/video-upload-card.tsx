"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface VideoUploadCardProps {
  acceptedFormats: string[];
  maxFileSizeMB: number;
  onFileSelected: (file: File) => void;
}

const FORMAT_LABELS: Record<string, string> = {
  "video/mp4": "MP4",
  "video/webm": "WebM",
  "video/ogg": "OGG",
  "video/quicktime": "MOV",
};

export function VideoUploadCard({
  acceptedFormats,
  maxFileSizeMB,
  onFileSelected,
}: VideoUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatLabel = acceptedFormats
    .map((format) => FORMAT_LABELS[format] ?? format)
    .join(", ");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        onFileSelected(file);
      }
    },
    [onFileSelected],
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-all",
            "hover:border-primary/50 hover:bg-muted/50",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
          )}
        >
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
              isDragging
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Upload className="h-6 w-6" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium">
              {isDragging
                ? "Drop your video here"
                : "Drag & drop your video here"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              or click to browse
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span>{formatLabel}</span>
            <span>•</span>
            <span>Max {maxFileSizeMB}MB</span>
          </div>
        </div>

        <Input
          ref={inputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFileSelected(file);
              event.target.value = "";
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
