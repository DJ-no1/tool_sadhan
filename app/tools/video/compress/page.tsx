"use client";

import { useState } from "react";
import { Minimize2, Gauge, Target, FileText } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";
import { cn } from "@/lib/utils";

const PRESETS = [
  {
    id: "max",
    label: "Maximum compression",
    desc: "Smallest file, reduced quality",
    icon: Gauge,
    reduction: "Up to 80% smaller",
  },
  {
    id: "balanced",
    label: "Balanced",
    desc: "Best tradeoff — recommended",
    icon: Target,
    reduction: "Up to 50% smaller",
  },
  {
    id: "light",
    label: "Light compression",
    desc: "Keeps quality, modest savings",
    icon: FileText,
    reduction: "Up to 25% smaller",
  },
];

export default function CompressVideoPage() {
  const [preset, setPreset] = useState("balanced");

  return (
    <SimpleToolPage
      title="Compress Video"
      description="Reduce video file size while keeping great quality. Perfect for sharing and uploading."
      icon={Minimize2}
      accent="purple"
      categoryHref="/tools/video"
      categoryLabel="Video Tools"
      features={["Smart bitrate", "Up to 80% smaller", "Batch support"]}
      actionLabel="Compress video"
      actionIcon={Minimize2}
      processingMessage="Compressing your video..."
      resultSuffix="_compressed"
      dropzone={{
        kind: "video",
        accept: "video/*",
        acceptLabel: "MP4, MOV, WebM",
        maxSize: 500,
      }}
      options={
        <OptionsPanel title="Compression preset">
          <OptionGroup title="Pick a preset">
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <OptionCard
                  key={p.id}
                  selected={preset === p.id}
                  onClick={() => setPreset(p.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md",
                        preset === p.id
                          ? "bg-purple-500/15 text-purple-400"
                          : "bg-surface-2 text-muted-foreground",
                      )}
                    >
                      <p.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-foreground">
                          {p.label}
                        </span>
                        <span
                          className={cn(
                            "text-[12px]",
                            preset === p.id
                              ? "text-purple-400"
                              : "text-muted-foreground",
                          )}
                        >
                          {p.reduction}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted-foreground">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </OptionCard>
              ))}
            </div>
          </OptionGroup>
        </OptionsPanel>
      }
    />
  );
}
