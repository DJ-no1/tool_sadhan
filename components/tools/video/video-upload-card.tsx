"use client";

import { useRef } from "react";
import { FileVideo, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

  const formatLabel = acceptedFormats
    .map((format) => FORMAT_LABELS[format] ?? format)
    .join(", ");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-muted p-2 text-muted-foreground">
            <FileVideo className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Select one file to start extraction.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{formatLabel}</Badge>
          <Badge variant="secondary">Max {maxFileSizeMB}MB</Badge>
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

        <Button onClick={() => inputRef.current?.click()} className="w-full">
          <Upload className="h-4 w-4" />
          Choose Video
        </Button>
      </CardContent>
    </Card>
  );
}
