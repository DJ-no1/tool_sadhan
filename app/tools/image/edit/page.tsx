"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
} from "@/components/tools/pdf/options-panel";
import { Slider } from "@/components/ui/slider";

export default function EditImagePage() {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  return (
    <SimpleToolPage
      title="Edit Image"
      description="Adjust brightness, contrast, and saturation with live controls. No account, no upload."
      icon={PenLine}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["Live controls", "Non-destructive", "Instant export"]}
      actionLabel="Apply edits"
      actionIcon={PenLine}
      processingMessage="Applying adjustments..."
      resultSuffix="_edited"
      dropzone={{
        kind: "image",
        accept: "image/*",
        acceptLabel: "Any image",
        maxSize: 50,
      }}
      options={
        <OptionsPanel title="Adjustments">
          <OptionGroup title="Basic">
            <div className="space-y-5">
              <Adjust
                label="Brightness"
                value={brightness}
                onChange={setBrightness}
              />
              <Adjust
                label="Contrast"
                value={contrast}
                onChange={setContrast}
              />
              <Adjust
                label="Saturation"
                value={saturation}
                onChange={setSaturation}
              />
            </div>
          </OptionGroup>
        </OptionsPanel>
      }
    />
  );
}

function Adjust({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <span className="font-mono text-[13px] text-blue-400">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={200}
        step={1}
      />
    </div>
  );
}
