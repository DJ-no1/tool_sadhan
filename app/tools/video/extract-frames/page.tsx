"use client";

import { useState } from "react";
import { Timer } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
} from "@/components/tools/pdf/options-panel";
import { Slider } from "@/components/ui/slider";

export default function ExtractFramesPage() {
  const [fps, setFps] = useState(1);

  return (
    <SimpleToolPage
      title="Extract Frames"
      description="Pull still frames from a video at a chosen rate. Returns a ZIP of PNG images."
      icon={Timer}
      accent="purple"
      categoryHref="/tools/video"
      categoryLabel="Video Tools"
      features={["Adjustable rate", "PNG output", "ZIP package"]}
      actionLabel="Extract frames"
      actionIcon={Timer}
      processingMessage="Extracting frames..."
      resultSuffix="_frames"
      resultExtension="zip"
      dropzone={{
        kind: "video",
        accept: "video/*",
        acceptLabel: "Any video",
        maxSize: 500,
      }}
      options={
        <OptionsPanel title="Extraction rate">
          <OptionGroup
            title="Frames per second"
            description="Pick how often to sample the video"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">Rate</span>
                <span className="font-mono text-[20px] font-semibold text-purple-400">
                  {fps} fps
                </span>
              </div>
              <Slider
                value={[fps]}
                onValueChange={([v]) => setFps(v)}
                min={1}
                max={30}
                step={1}
              />
              <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                <span>1 per second</span>
                <span>30 per second</span>
              </div>
            </div>
          </OptionGroup>
        </OptionsPanel>
      }
    />
  );
}
