"use client";

import { useState } from "react";
import { Minimize2 } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
} from "@/components/tools/pdf/options-panel";
import { Slider } from "@/components/ui/slider";

export default function CompressImagePage() {
  const [quality, setQuality] = useState(80);

  return (
    <SimpleToolPage
      title="Compress Image"
      description="Reduce image file size while keeping great visual quality. Works great on JPG, PNG, and WebP."
      icon={Minimize2}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["Up to 90% smaller", "Quality preserved", "Batch ready"]}
      actionLabel="Compress image"
      actionIcon={Minimize2}
      processingMessage="Compressing your image..."
      resultSuffix="_compressed"
      dropzone={{
        kind: "image",
        accept: "image/*",
        acceptLabel: "JPG, PNG, WebP",
        maxSize: 50,
        multiple: true,
        maxFiles: 20,
      }}
      options={
        <OptionsPanel title="Compression">
          <OptionGroup
            title="Quality level"
            description="Lower quality = smaller file size"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] text-muted-foreground">
                  Quality
                </span>
                <span className="font-mono text-[20px] font-semibold text-blue-400">
                  {quality}%
                </span>
              </div>
              <Slider
                value={[quality]}
                onValueChange={([v]) => setQuality(v)}
                min={10}
                max={100}
                step={5}
              />
              <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                <span>Smaller</span>
                <span>Best quality</span>
              </div>
            </div>
          </OptionGroup>
        </OptionsPanel>
      }
    />
  );
}
