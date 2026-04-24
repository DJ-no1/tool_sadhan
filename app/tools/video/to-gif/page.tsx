"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
} from "@/components/tools/pdf/options-panel";
import { Slider } from "@/components/ui/slider";

export default function VideoToGIFPage() {
  const [fps, setFps] = useState(15);
  const [width, setWidth] = useState(480);

  return (
    <SimpleToolPage
      title="Video to GIF"
      description="Turn short videos into lightweight GIFs — control FPS and width for the perfect size."
      icon={Play}
      accent="purple"
      categoryHref="/tools/video"
      categoryLabel="Video Tools"
      features={["Adjustable FPS", "Auto optimize", "Client-side"]}
      actionLabel="Convert to GIF"
      actionIcon={Play}
      processingMessage="Encoding GIF..."
      resultSuffix=""
      resultExtension="gif"
      dropzone={{
        kind: "video",
        accept: "video/*",
        acceptLabel: "MP4, WebM, MOV",
        maxSize: 200,
      }}
      options={
        <OptionsPanel title="GIF settings">
          <OptionGroup title="Frame rate">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">FPS</span>
                <span className="font-mono text-[20px] font-semibold text-purple-400">
                  {fps}
                </span>
              </div>
              <Slider
                value={[fps]}
                onValueChange={([v]) => setFps(v)}
                min={5}
                max={30}
                step={1}
              />
            </div>
          </OptionGroup>
          <OptionGroup title="Width (px)">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">
                  Output width
                </span>
                <span className="font-mono text-[20px] font-semibold text-purple-400">
                  {width}px
                </span>
              </div>
              <Slider
                value={[width]}
                onValueChange={([v]) => setWidth(v)}
                min={160}
                max={1280}
                step={20}
              />
            </div>
          </OptionGroup>
        </OptionsPanel>
      }
    />
  );
}
