const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
  'components/tools/video',
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`Created: ${dir}`);
});

// Create component files
const files = {
  'components/tools/video/video-to-jpg-converter.tsx': `"use client";

import { useState, useCallback } from "react";
import { Upload, FileVideo, Image as ImageIcon, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ExtractedFrame {
  id: string;
  url: string;
  timestamp: number;
  filename: string;
}

interface VideoToJpgConverterProps {
  maxFileSize?: number;
  acceptedFormats?: string[];
}

export function VideoToJpgConverter({
  maxFileSize = 500 * 1024 * 1024, // 500MB default
  acceptedFormats = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
}: VideoToJpgConverterProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [frameInterval, setFrameInterval] = useState(1);
  const [quality, setQuality] = useState(0.92);
  const [error, setError] = useState<string>("");

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError("");

      // Validate file size
      if (file.size > maxFileSize) {
        setError(\`File size exceeds \${maxFileSize / 1024 / 1024}MB limit\`);
        return;
      }

      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        setError("Unsupported video format. Please use MP4, WebM, or MOV.");
        return;
      }

      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setExtractedFrames([]);
    },
    [maxFileSize, acceptedFormats]
  );

  const extractFrames = useCallback(async () => {
    if (!videoFile || !videoUrl) return;

    setIsExtracting(true);
    setExtractionProgress(0);
    setExtractedFrames([]);

    try {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.preload = "metadata";

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
      });

      const duration = video.duration;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      const frames: ExtractedFrame[] = [];
      const totalFrames = Math.floor(duration / frameInterval);

      for (let i = 0; i < totalFrames; i++) {
        const timestamp = i * frameInterval;

        video.currentTime = timestamp;
        await new Promise((resolve) => {
          video.onseeked = resolve;
        });

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Failed to create blob"));
            },
            "image/jpeg",
            quality
          );
        });

        const url = URL.createObjectURL(blob);
        const filename = \`\${videoFile.name.replace(/\\.[^/.]+$/, "")}_frame_\${String(i + 1).padStart(4, "0")}.jpg\`;

        frames.push({
          id: \`frame-\${i}\`,
          url,
          timestamp,
          filename,
        });

        setExtractionProgress(((i + 1) / totalFrames) * 100);
      }

      setExtractedFrames(frames);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract frames");
    } finally {
      setIsExtracting(false);
    }
  }, [videoFile, videoUrl, frameInterval, quality]);

  const downloadFrame = useCallback((frame: ExtractedFrame) => {
    const link = document.createElement("a");
    link.href = frame.url;
    link.download = frame.filename;
    link.click();
  }, []);

  const downloadAllFrames = useCallback(async () => {
    for (const frame of extractedFrames) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      downloadFrame(frame);
    }
  }, [extractedFrames, downloadFrame]);

  const clearVideo = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    extractedFrames.forEach((frame) => URL.revokeObjectURL(frame.url));
    setVideoFile(null);
    setVideoUrl("");
    setExtractedFrames([]);
    setError("");
  }, [videoUrl, extractedFrames]);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!videoFile ? (
        <Card className="border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-12">
          <label className="flex cursor-pointer flex-col items-center gap-4">
            <div className="rounded-full bg-purple-500/10 p-6">
              <Upload className="h-12 w-12 text-purple-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Click to upload video</p>
              <p className="text-sm text-zinc-400">
                MP4, WebM, MOV up to {maxFileSize / 1024 / 1024}MB
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={acceptedFormats.join(",")}
              onChange={handleFileSelect}
            />
          </label>
        </Card>
      ) : (
        <>
          {/* Video Preview and Controls */}
          <Card className="bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileVideo className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">{videoFile.name}</p>
                  <p className="text-sm text-zinc-400">
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearVideo}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <video
              src={videoUrl}
              controls
              className="w-full rounded-lg bg-black"
            />

            {/* Extraction Settings */}
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Frame Interval (seconds)
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={frameInterval}
                  onChange={(e) => setFrameInterval(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2"
                />
                <p className="text-xs text-zinc-400">
                  Extract one frame every {frameInterval} second(s)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  JPEG Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <Button
                onClick={extractFrames}
                disabled={isExtracting}
                className="w-full"
              >
                {isExtracting ? (
                  <>Extracting... {Math.round(extractionProgress)}%</>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4" />
                    Extract Frames to JPG
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Extracted Frames */}
          {extractedFrames.length > 0 && (
            <Card className="bg-zinc-900/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Extracted Frames ({extractedFrames.length})
                </h3>
                <Button onClick={downloadAllFrames} variant="outline">
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {extractedFrames.map((frame) => (
                  <div
                    key={frame.id}
                    className="group relative overflow-hidden rounded-lg border border-zinc-700"
                  >
                    <img
                      src={frame.url}
                      alt={\`Frame at \${frame.timestamp.toFixed(1)}s\`}
                      className="aspect-video w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        onClick={() => downloadFrame(frame)}
                        size="sm"
                        variant="secondary"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    <div className="bg-zinc-800/90 p-2 text-xs text-zinc-400">
                      {frame.timestamp.toFixed(1)}s
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-500/50 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      )}
    </div>
  );
}`,
  'components/tools/video/video-converter-features.tsx': `import { Shield, Zap, Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "100% Private",
    description: "All processing happens in your browser. Your videos never leave your device.",
  },
  {
    icon: Zap,
    title: "Fast Extraction",
    description: "Extract frames at custom intervals with real-time progress tracking.",
  },
  {
    icon: Eye,
    title: "High Quality",
    description: "Adjustable JPEG quality from 10% to 100% for perfect results.",
  },
  {
    icon: Download,
    title: "Batch Download",
    description: "Download individual frames or all at once with a single click.",
  },
];

export function VideoConverterFeatures() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {features.map((feature, index) => (
        <Card key={index} className="bg-zinc-900/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
            <feature.icon className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
          <p className="text-sm text-zinc-400">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
}`,
  'components/tools/video/video-converter-faq.tsx': `import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "What video formats are supported?",
    answer:
      "We support MP4, WebM, MOV, and OGG video formats. Most modern video files will work perfectly.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "Yes, the maximum file size is 500MB. This is to ensure smooth performance in your browser.",
  },
  {
    question: "How does frame extraction work?",
    answer:
      "You can set a custom interval (in seconds) to extract frames. For example, setting 1 second will extract one frame every second of your video.",
  },
  {
    question: "Are my videos uploaded to a server?",
    answer:
      "No! All processing happens locally in your browser using HTML5 Canvas API. Your videos never leave your device.",
  },
  {
    question: "Can I adjust the output quality?",
    answer:
      "Yes, you can adjust the JPEG quality from 10% to 100% before extraction. Higher quality means larger file sizes but better image quality.",
  },
  {
    question: "How do I download the frames?",
    answer:
      "You can download frames individually by hovering over them and clicking the download button, or use 'Download All' to get all frames at once.",
  },
];

export function VideoConverterFAQ() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="bg-zinc-900/50 p-6">
            <h3 className="mb-2 font-medium text-zinc-100">{faq.question}</h3>
            <p className="text-sm text-zinc-400">{faq.answer}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}`,
  'components/tools/video/index.ts': `export { VideoToJpgConverter } from "./video-to-jpg-converter";
export { VideoConverterFeatures } from "./video-converter-features";
export { VideoConverterFAQ } from "./video-converter-faq";
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content);
  console.log(\`Created: \${filePath}\`);
});

console.log('All files created successfully!');
