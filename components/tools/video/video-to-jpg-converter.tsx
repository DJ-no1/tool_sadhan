"use client";

import JSZip from "jszip";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VideoConverterErrorAlert } from "./video-converter-error-alert";
import { VideoPreviewCard } from "./video-preview-card";
import { VideoResultsGrid } from "./video-results-grid";
import { VideoSettingsCard } from "@/components/tools/video/video-settings-card";
import { VideoUploadCard } from "./video-upload-card";
import type {
  ExtractedFrame,
  ExtractionMode,
  OutputFormat,
  OutputFormatOption,
  VideoInfo,
  VideoToJpgConverterProps,
} from "./types";

const OUTPUT_FORMAT_OPTIONS: OutputFormatOption[] = [
  {
    id: "png",
    label: "PNG",
    description: "PNG output without added quality loss.",
    mimeType: "image/png",
    extension: "png",
  },
  {
    id: "jpg",
    label: "JPG",
    description: "High-quality JPEG output.",
    mimeType: "image/jpeg",
    extension: "jpg",
    quality: 0.92,
  },
  {
    id: "webp",
    label: "WEBP",
    description: "Compressed modern format with good quality.",
    mimeType: "image/webp",
    extension: "webp",
    quality: 0.92,
  },
];

const MAX_EXTRACTABLE_FRAMES = 6000;
const MAX_EXTRACTION_FPS = 60;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toSingleDecimal(value: number): number {
  return Number(value.toFixed(1));
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function loadVideoMetadata(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (video.readyState >= 1) {
      resolve();
      return;
    }

    const onLoadedMetadata = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("Unable to read the selected video."));
    };

    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function seekVideo(video: HTMLVideoElement, seconds: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("Failed to capture frame at the requested time."));
    };

    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = seconds;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: "image/png" | "image/jpeg" | "image/webp",
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image output."));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

type FrameCallbackVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: number, metadata: { mediaTime: number }) => void,
  ) => number;
};

async function estimateFrameRate(
  video: HTMLVideoElement,
): Promise<number | null> {
  const callbackVideo = video as FrameCallbackVideo;

  if (typeof callbackVideo.requestVideoFrameCallback === "function") {
    try {
      video.currentTime = 0;
      await video.play();

      const mediaTimes: number[] = [];
      const maxSampleDuration = Math.min(Math.max(video.duration, 0), 1.2);

      await new Promise<void>((resolve) => {
        const timeoutId = window.setTimeout(resolve, 1500);

        const onFrame = (_now: number, metadata: { mediaTime: number }) => {
          mediaTimes.push(metadata.mediaTime);

          if (
            mediaTimes.length >= 24 ||
            metadata.mediaTime >= maxSampleDuration
          ) {
            window.clearTimeout(timeoutId);
            resolve();
            return;
          }

          callbackVideo.requestVideoFrameCallback?.(onFrame);
        };

        callbackVideo.requestVideoFrameCallback(onFrame);
      });

      video.pause();

      if (mediaTimes.length > 1) {
        const deltas: number[] = [];
        for (let index = 1; index < mediaTimes.length; index += 1) {
          const delta = mediaTimes[index] - mediaTimes[index - 1];
          if (delta > 0) {
            deltas.push(delta);
          }
        }

        if (deltas.length) {
          const averageDelta =
            deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length;
          if (averageDelta > 0) {
            return Number((1 / averageDelta).toFixed(2));
          }
        }
      }
    } catch {
      video.pause();
    }
  }

  try {
    video.currentTime = 0;
    await video.play();
    await new Promise((resolve) => window.setTimeout(resolve, 1000));

    const playbackQuality = video.getVideoPlaybackQuality?.();
    const elapsedSeconds = video.currentTime;
    video.pause();

    if (
      playbackQuality &&
      elapsedSeconds > 0 &&
      playbackQuality.totalVideoFrames > 0
    ) {
      return Number(
        (playbackQuality.totalVideoFrames / elapsedSeconds).toFixed(2),
      );
    }
  } catch {
    video.pause();
  }

  return null;
}

async function readVideoInfo(videoUrl: string): Promise<VideoInfo> {
  const video = document.createElement("video");
  video.preload = "auto";
  video.src = videoUrl;
  video.load();
  video.muted = true;
  video.playsInline = true;

  await loadVideoMetadata(video);
  const frameRate = await estimateFrameRate(video);

  const info: VideoInfo = {
    duration: video.duration,
    width: video.videoWidth,
    height: video.videoHeight,
    frameRate,
  };

  video.pause();
  video.removeAttribute("src");
  video.load();

  return info;
}

export function VideoToJpgConverter({
  maxFileSize = 500 * 1024 * 1024,
  acceptedFormats = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
}: VideoToJpgConverterProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isAnalyzingVideo, setIsAnalyzingVideo] = useState<boolean>(false);

  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [frameInterval, setFrameInterval] = useState<number>(1);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [extractionMode, setExtractionMode] =
    useState<ExtractionMode>("interval");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");

  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [extractionProgress, setExtractionProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const analysisIdRef = useRef(0);

  const maxFileSizeMB = useMemo(
    () => Math.round(maxFileSize / 1024 / 1024),
    [maxFileSize],
  );

  const selectedOutputFormatOption = useMemo(() => {
    return (
      OUTPUT_FORMAT_OPTIONS.find((option) => option.id === outputFormat) ??
      OUTPUT_FORMAT_OPTIONS[0]
    );
  }, [outputFormat]);

  const revokeFrames = useCallback((frames: ExtractedFrame[]) => {
    for (const frame of frames) {
      URL.revokeObjectURL(frame.url);
    }
  }, []);

  const clearVideo = useCallback(() => {
    analysisIdRef.current += 1;

    setVideoUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return "";
    });

    setExtractedFrames((frames) => {
      revokeFrames(frames);
      return [];
    });

    setVideoFile(null);
    setVideoInfo(null);
    setStartTime(0);
    setEndTime(0);
    setIsAnalyzingVideo(false);
    setError("");
    setExtractionProgress(0);
    setExtractionMode("interval");
  }, [revokeFrames]);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  useEffect(() => {
    return () => {
      revokeFrames(extractedFrames);
    };
  }, [extractedFrames, revokeFrames]);

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (file.size > maxFileSize) {
        setError(`File size exceeds ${maxFileSizeMB}MB limit.`);
        return;
      }

      if (file.type && !acceptedFormats.includes(file.type)) {
        setError(
          "Unsupported video format. Please upload MP4, WebM, MOV, or OGG.",
        );
        return;
      }

      const requestId = analysisIdRef.current + 1;
      analysisIdRef.current = requestId;
      setIsAnalyzingVideo(true);
      setError("");
      setVideoInfo(null);
      setExtractionProgress(0);
      setExtractionMode("interval");

      setExtractedFrames((frames) => {
        revokeFrames(frames);
        return [];
      });

      const nextVideoUrl = URL.createObjectURL(file);

      setVideoUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return nextVideoUrl;
      });

      setVideoFile(file);

      try {
        const info = await readVideoInfo(nextVideoUrl);
        if (requestId !== analysisIdRef.current) {
          return;
        }

        setVideoInfo(info);
        setStartTime(0);
        setEndTime(toSingleDecimal(Math.max(info.duration, 0.1)));
      } catch {
        if (requestId !== analysisIdRef.current) {
          return;
        }

        setError(
          "Video metadata could not be fully detected. You can still extract frames.",
        );
      } finally {
        if (requestId === analysisIdRef.current) {
          setIsAnalyzingVideo(false);
        }
      }
    },
    [acceptedFormats, maxFileSize, maxFileSizeMB, revokeFrames],
  );

  const handleExtractionModeChange = useCallback(
    (mode: ExtractionMode) => {
      if (
        mode === "max-fps" &&
        (!videoInfo?.frameRate || videoInfo.frameRate <= 0)
      ) {
        setError(
          "Frame rate is not available for this file. Use custom interval mode.",
        );
        return;
      }

      setError("");
      setExtractionMode(mode);
    },
    [videoInfo?.frameRate],
  );

  const handleFrameIntervalChange = useCallback((value: number) => {
    if (!Number.isFinite(value)) {
      return;
    }

    setFrameInterval(toSingleDecimal(clamp(value, 0.1, 10)));
  }, []);

  const handleStartTimeChange = useCallback(
    (value: number) => {
      if (!Number.isFinite(value)) {
        return;
      }

      const maxDuration = videoInfo?.duration ?? endTime ?? 0;
      const normalizedStart = toSingleDecimal(
        clamp(value, 0, Math.max(maxDuration, 0.1)),
      );

      setStartTime(normalizedStart);
      setEndTime((currentEnd) => {
        const safeEnd = toSingleDecimal(
          clamp(currentEnd, 0, Math.max(maxDuration, 0.1)),
        );
        if (safeEnd <= normalizedStart) {
          return toSingleDecimal(
            clamp(normalizedStart + 0.1, 0.1, Math.max(maxDuration, 0.1)),
          );
        }

        return safeEnd;
      });
    },
    [endTime, videoInfo?.duration],
  );

  const handleEndTimeChange = useCallback(
    (value: number) => {
      if (!Number.isFinite(value)) {
        return;
      }

      const maxDuration = videoInfo?.duration ?? value;
      const normalizedEnd = toSingleDecimal(
        clamp(value, 0.1, Math.max(maxDuration, 0.1)),
      );

      setEndTime(normalizedEnd);
      setStartTime((currentStart) => {
        const safeStart = toSingleDecimal(
          clamp(currentStart, 0, normalizedEnd),
        );
        if (safeStart >= normalizedEnd) {
          return toSingleDecimal(Math.max(normalizedEnd - 0.1, 0));
        }

        return safeStart;
      });
    },
    [videoInfo?.duration],
  );

  const extractFrames = useCallback(async () => {
    if (!videoFile || !videoUrl) {
      return;
    }

    let effectiveInterval = clamp(frameInterval, 0.1, 10);

    if (extractionMode === "max-fps") {
      if (!videoInfo?.frameRate || videoInfo.frameRate <= 0) {
        setError(
          "Frame rate was not detected. Switch to custom interval mode.",
        );
        return;
      }

      const cappedFrameRate = Math.min(videoInfo.frameRate, MAX_EXTRACTION_FPS);
      effectiveInterval = 1 / cappedFrameRate;
    }

    setIsExtracting(true);
    setExtractionProgress(0);
    setError("");

    setExtractedFrames((frames) => {
      revokeFrames(frames);
      return [];
    });

    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = videoUrl;
      video.load();

      await loadVideoMetadata(video);

      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        throw new Error("The selected video duration is invalid.");
      }

      const safeStart = toSingleDecimal(clamp(startTime, 0, video.duration));
      const safeEnd = toSingleDecimal(clamp(endTime, 0, video.duration));

      if (safeEnd <= safeStart) {
        throw new Error("End time must be greater than start time.");
      }

      const timestamps: number[] = [];
      for (
        let time = safeStart;
        time <= safeEnd + 1e-6;
        time += effectiveInterval
      ) {
        const timestamp = Math.min(time, safeEnd);
        timestamps.push(timestamp);

        if (timestamp === safeEnd) {
          break;
        }

        if (timestamps.length > MAX_EXTRACTABLE_FRAMES) {
          throw new Error(
            "Selected range is too large. Narrow Start/End range or increase interval.",
          );
        }
      }

      const frameCount = timestamps.length;
      if (!frameCount) {
        throw new Error("No frames found in selected range.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Your browser cannot process this video.");
      }

      const nextFrames: ExtractedFrame[] = [];
      const fileBaseName = videoFile.name.replace(/\.[^/.]+$/, "");

      for (let index = 0; index < frameCount; index += 1) {
        const timestamp = Math.min(
          timestamps[index],
          Math.max(video.duration - 0.001, 0),
        );

        await seekVideo(video, timestamp);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const blob = await canvasToBlob(
          canvas,
          selectedOutputFormatOption.mimeType,
          selectedOutputFormatOption.quality,
        );

        const frameUrl = URL.createObjectURL(blob);
        const extension = selectedOutputFormatOption.extension;

        nextFrames.push({
          id: `frame-${index}`,
          url: frameUrl,
          timestamp,
          blob,
          filename: `${fileBaseName}_frame_${String(index + 1).padStart(4, "0")}.${extension}`,
        });

        setExtractionProgress(((index + 1) / frameCount) * 100);
      }

      setExtractedFrames(nextFrames);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Failed to extract video frames.",
      );
    } finally {
      setIsExtracting(false);
    }
  }, [
    endTime,
    extractionMode,
    frameInterval,
    revokeFrames,
    selectedOutputFormatOption,
    startTime,
    videoFile,
    videoInfo?.frameRate,
    videoUrl,
  ]);

  const downloadFrame = useCallback((frame: ExtractedFrame) => {
    downloadBlob(frame.blob, frame.filename);
  }, []);

  const exportZip = useCallback(async () => {
    if (!extractedFrames.length) {
      return;
    }

    setIsExportingZip(true);
    setError("");

    try {
      const zip = new JSZip();

      for (const frame of extractedFrames) {
        zip.file(frame.filename, frame.blob);
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const baseName = (videoFile?.name ?? "video").replace(/\.[^/.]+$/, "");
      downloadBlob(zipBlob, `${baseName}_frames.zip`);
    } catch {
      setError("Failed to export ZIP. Please try again.");
    } finally {
      setIsExportingZip(false);
    }
  }, [extractedFrames, videoFile]);

  return (
    <div className="space-y-6">
      {!videoFile || !videoUrl ? (
        <VideoUploadCard
          acceptedFormats={acceptedFormats}
          maxFileSizeMB={maxFileSizeMB}
          onFileSelected={handleFileSelected}
        />
      ) : (
        <>
          <VideoPreviewCard
            file={videoFile}
            videoUrl={videoUrl}
            videoInfo={videoInfo}
            isAnalyzingVideo={isAnalyzingVideo}
            onSetStartAtCurrent={handleStartTimeChange}
            onSetEndAtCurrent={handleEndTimeChange}
            onClear={clearVideo}
          />
          <VideoSettingsCard
            extractionMode={extractionMode}
            frameInterval={frameInterval}
            startTime={startTime}
            endTime={endTime}
            maxDuration={videoInfo?.duration ?? null}
            maxFrameRate={
              videoInfo?.frameRate
                ? Math.min(videoInfo.frameRate, MAX_EXTRACTION_FPS)
                : null
            }
            outputFormat={outputFormat}
            outputFormatOptions={OUTPUT_FORMAT_OPTIONS}
            isExtracting={isExtracting}
            extractionProgress={extractionProgress}
            onExtractionModeChange={handleExtractionModeChange}
            onFrameIntervalChange={handleFrameIntervalChange}
            onStartTimeChange={handleStartTimeChange}
            onEndTimeChange={handleEndTimeChange}
            onOutputFormatChange={(value: OutputFormat) =>
              setOutputFormat(value)
            }
            onExtract={extractFrames}
          />
        </>
      )}

      <VideoResultsGrid
        frames={extractedFrames}
        isExportingZip={isExportingZip}
        onDownloadFrame={downloadFrame}
        onExportZip={exportZip}
      />

      <VideoConverterErrorAlert message={error} />
    </div>
  );
}
