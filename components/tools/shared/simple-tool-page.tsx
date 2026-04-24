"use client";

import { ReactNode, useCallback, useState } from "react";
import { type LucideIcon } from "lucide-react";
import { ToolLayout, type ToolAccent } from "./tool-layout";
import { MediaDropzone, type MediaFile } from "./media-dropzone";
import {
  ProcessingPanel,
  type ProcessingStatus,
} from "@/components/tools/pdf/processing-panel";
import { ActionButton } from "@/components/tools/pdf/action-button";

interface SimpleToolPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: ToolAccent;
  categoryHref: string;
  categoryLabel: string;
  features?: string[];
  actionLabel: string;
  actionIcon?: LucideIcon;
  processingMessage?: string;
  resultSuffix?: string;
  resultExtension?: string;
  dropzone: {
    kind: "image" | "video" | "pdf" | "generic";
    accept: string;
    acceptLabel?: string;
    maxSize?: number;
    multiple?: boolean;
    maxFiles?: number;
    title?: string;
  };
  options?: ReactNode;
  minFiles?: number;
}

export function SimpleToolPage({
  title,
  description,
  icon,
  accent,
  categoryHref,
  categoryLabel,
  features,
  actionLabel,
  actionIcon,
  processingMessage,
  resultSuffix = "_processed",
  resultExtension,
  dropzone,
  options,
  minFiles = 1,
}: SimpleToolPageProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  const handleFilesChange = useCallback((next: MediaFile[]) => {
    setFiles(next);
    setStatus("idle");
    setResultFile(null);
  }, []);

  const deriveResultName = (originalName: string) => {
    const dotIndex = originalName.lastIndexOf(".");
    const base =
      dotIndex > 0 ? originalName.substring(0, dotIndex) : originalName;
    const ext =
      resultExtension ??
      (dotIndex > 0 ? originalName.substring(dotIndex + 1) : "");
    return ext ? `${base}${resultSuffix}.${ext}` : `${base}${resultSuffix}`;
  };

  const handleAction = async () => {
    if (files.length < minFiles) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [15, 30, 45, 60, 75, 90, 100];
    for (const p of intervals) {
      await new Promise((r) => setTimeout(r, 250));
      setProgress(p);
    }

    const first = files[0]?.file;
    if (first) {
      setResultFile({
        name: deriveResultName(first.name),
        size: Math.floor(first.size * 0.85),
      });
    }
    setStatus("completed");
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
  };

  const handleDownload = () => {
    // In real implementation, download would happen here.
    console.log(`Downloading ${resultFile?.name}`);
  };

  return (
    <ToolLayout
      title={title}
      description={description}
      icon={icon}
      accent={accent}
      categoryHref={categoryHref}
      categoryLabel={categoryLabel}
      features={features}
    >
      <div className="space-y-6">
        {status === "idle" && (
          <>
            <MediaDropzone
              accent={accent}
              kind={dropzone.kind}
              accept={dropzone.accept}
              acceptLabel={dropzone.acceptLabel}
              maxSize={dropzone.maxSize}
              multiple={dropzone.multiple}
              maxFiles={dropzone.maxFiles}
              title={dropzone.title}
              onFilesChange={handleFilesChange}
            />

            {files.length >= minFiles && options}

            {files.length >= minFiles && (
              <ActionButton icon={actionIcon} onClick={handleAction}>
                {actionLabel}
              </ActionButton>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? processingMessage : undefined}
          resultFile={resultFile || undefined}
          originalSize={files[0]?.file.size}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </ToolLayout>
  );
}
