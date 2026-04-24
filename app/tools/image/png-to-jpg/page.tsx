"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
} from "@/components/tools/pdf/options-panel";
import { Slider } from "@/components/ui/slider";

export default function PNGToJPGPage() {
  const [quality, setQuality] = useState(90);

  return (
    <SimpleToolPage
      title="PNG to JPG"
      description="Convert PNG images to JPEG with tunable quality. Ideal for photos that don't need transparency."
      icon={ImageIcon}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["Tunable quality", "Smaller files", "Batch support"]}
      actionLabel="Convert to JPG"
      actionIcon={ImageIcon}
      processingMessage="Converting PNG to JPG..."
      resultSuffix=""
      resultExtension="jpg"
      dropzone={{
        kind: "image",
        accept: "image/png",
        acceptLabel: "PNG only",
        maxSize: 50,
        multiple: true,
        maxFiles: 20,
      }}
      options={
        <OptionsPanel title="Output">
          <OptionGroup title="JPG quality">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] text-muted-foreground">
                  Quality
                </span>
                <span className="font-mono text-[20px] font-semibold text-blue-400">
                  {quality}
                </span>
              </div>
              <Slider
                value={[quality]}
                onValueChange={([v]) => setQuality(v)}
                min={10}
                max={100}
                step={1}
              />
            </div>
          </OptionGroup>
        </OptionsPanel>
      }
    />
  );
}
