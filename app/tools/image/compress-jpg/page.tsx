"use client";

import { useState } from "react";
import { ImageDown } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
} from "@/components/tools/pdf/options-panel";
import { Slider } from "@/components/ui/slider";

export default function CompressJPGPage() {
  const [quality, setQuality] = useState(75);

  return (
    <SimpleToolPage
      title="Compress JPG"
      description="Shrink JPEG images up to 80% without visible loss in quality. Perfect for web and email."
      icon={ImageDown}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["JPEG specialist", "Smart quantization", "Keep EXIF optional"]}
      actionLabel="Compress JPG"
      actionIcon={ImageDown}
      processingMessage="Optimizing JPG..."
      resultSuffix="_compressed"
      dropzone={{
        kind: "image",
        accept: "image/jpeg,image/jpg",
        acceptLabel: "JPG only",
        maxSize: 50,
        multiple: true,
        maxFiles: 20,
      }}
      options={
        <OptionsPanel title="JPG settings">
          <OptionGroup title="JPEG quality">
            <div className="space-y-4">
              <div className="text-center">
                <span className="font-mono text-[32px] font-semibold text-blue-400">
                  {quality}
                </span>
                <p className="text-[12px] text-muted-foreground">
                  quality • 100 = best
                </p>
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
