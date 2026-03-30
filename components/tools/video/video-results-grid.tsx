"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractedFrame } from "./types";

interface VideoResultsGridProps {
  frames: ExtractedFrame[];
  isExportingZip: boolean;
  onDownloadFrame: (frame: ExtractedFrame) => void;
  onExportZip: () => void;
}

export function VideoResultsGrid({
  frames,
  isExportingZip,
  onDownloadFrame,
  onExportZip,
}: VideoResultsGridProps) {
  if (!frames.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <CardTitle>Extracted Frames ({frames.length})</CardTitle>
          <Button
            variant="outline"
            onClick={onExportZip}
            disabled={isExportingZip}
          >
            {isExportingZip ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing ZIP...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download as ZIP
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {frames.map((frame) => (
            <Card key={frame.id} className="overflow-hidden">
              <div className="group relative">
                {/* Blob preview URLs are generated locally at runtime. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.url}
                  alt={`Frame captured at ${frame.timestamp.toFixed(1)} seconds`}
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="sm" onClick={() => onDownloadFrame(frame)}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                {frame.timestamp.toFixed(1)}s
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
