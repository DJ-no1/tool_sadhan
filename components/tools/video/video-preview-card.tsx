"use client";

import { useRef } from "react";
import { FileVideo, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VideoInfo } from "./types";

interface VideoPreviewCardProps {
  file: File;
  videoUrl: string;
  videoInfo: VideoInfo | null;
  isAnalyzingVideo: boolean;
  onSetStartAtCurrent: (seconds: number) => void;
  onSetEndAtCurrent: (seconds: number) => void;
  onClear: () => void;
}

function formatBytes(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "-";
  }

  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function VideoPreviewCard({
  file,
  videoUrl,
  videoInfo,
  isAnalyzingVideo,
  onSetStartAtCurrent,
  onSetEndAtCurrent,
  onClear,
}: VideoPreviewCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-muted p-2 text-muted-foreground">
              <FileVideo className="h-5 w-5" />
            </div>
            <CardTitle className="truncate text-base sm:text-lg">
              {file.name}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            aria-label="Remove selected video"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border bg-card p-2">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="aspect-video w-full rounded-md bg-black"
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onSetStartAtCurrent(videoRef.current?.currentTime ?? 0)
                }
              >
                Set Start
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onSetEndAtCurrent(videoRef.current?.currentTime ?? 0)
                }
              >
                Set End
              </Button>
            </div>
          </div>

          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Video Info</h3>
              <Badge variant="outline">{formatBytes(file.size)}</Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>{formatDuration(videoInfo?.duration ?? 0)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Resolution</span>
                <span>
                  {videoInfo ? `${videoInfo.width} x ${videoInfo.height}` : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Frame Rate</span>
                <span>
                  {isAnalyzingVideo
                    ? "Detecting..."
                    : videoInfo?.frameRate
                      ? `${videoInfo.frameRate.toFixed(2)} FPS`
                      : "Not detected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
