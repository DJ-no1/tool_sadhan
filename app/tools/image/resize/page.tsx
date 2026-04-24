"use client";

import { useState } from "react";
import { Maximize2, Lock } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
} from "@/components/tools/pdf/options-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResizeImagePage() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [lockRatio, setLockRatio] = useState(true);

  return (
    <SimpleToolPage
      title="Resize Image"
      description="Change the dimensions of your image while keeping the quality intact. Supports JPG, PNG, WebP, and GIF."
      icon={Maximize2}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["Pixel perfect", "Aspect ratio lock", "Batch support"]}
      actionLabel="Resize image"
      actionIcon={Maximize2}
      processingMessage="Resizing your image..."
      resultSuffix="_resized"
      dropzone={{
        kind: "image",
        accept: "image/*",
        acceptLabel: "JPG, PNG, WebP",
        maxSize: 50,
      }}
      options={
        <OptionsPanel title="Target dimensions">
          <OptionGroup
            title="Pixel dimensions"
            description="Set the new width and height in pixels"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width" className="text-[12px]">
                  Width (px)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                  className="bg-surface-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-[12px]">
                  Height (px)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                  className="bg-surface-2"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLockRatio((v) => !v)}
              className="mt-3 inline-flex items-center gap-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Lock
                className={`h-3.5 w-3.5 ${lockRatio ? "text-blue-400" : ""}`}
              />
              {lockRatio ? "Locked aspect ratio" : "Free resize"}
            </button>
          </OptionGroup>
        </OptionsPanel>
      }
    />
  );
}
