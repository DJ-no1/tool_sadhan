"use client";

import { useState } from "react";
import { Crop, Square, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";
import { cn } from "@/lib/utils";

const RATIOS = [
  { id: "1:1", label: "Square", aspect: "1:1", icon: Square },
  {
    id: "16:9",
    label: "Landscape",
    aspect: "16:9",
    icon: RectangleHorizontal,
  },
  { id: "4:3", label: "Standard", aspect: "4:3", icon: RectangleHorizontal },
  { id: "9:16", label: "Portrait", aspect: "9:16", icon: RectangleVertical },
];

export default function CropImagePage() {
  const [ratio, setRatio] = useState("1:1");

  return (
    <SimpleToolPage
      title="Crop Image"
      description="Trim your image to a specific aspect ratio or custom dimensions. Perfect for social profiles and covers."
      icon={Crop}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["Aspect presets", "Custom crop", "Lossless output"]}
      actionLabel="Crop image"
      actionIcon={Crop}
      processingMessage="Cropping your image..."
      resultSuffix="_cropped"
      dropzone={{
        kind: "image",
        accept: "image/*",
        acceptLabel: "JPG, PNG, WebP",
        maxSize: 50,
      }}
      options={
        <OptionsPanel title="Crop settings">
          <OptionGroup
            title="Aspect ratio"
            description="Choose a common ratio or keep it free-form"
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RATIOS.map((r) => (
                <OptionCard
                  key={r.id}
                  selected={ratio === r.id}
                  onClick={() => setRatio(r.id)}
                  className="p-3"
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <r.icon
                      className={cn(
                        "h-5 w-5",
                        ratio === r.id
                          ? "text-blue-400"
                          : "text-muted-foreground",
                      )}
                    />
                    <div>
                      <p className="text-[13px] font-medium text-foreground">
                        {r.label}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {r.aspect}
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
