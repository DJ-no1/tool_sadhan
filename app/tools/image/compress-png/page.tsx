"use client";

import { ImageDown } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";
import { useState } from "react";

const LEVELS = [
  { id: "lossy", label: "Lossy", desc: "Smallest file, nearly identical" },
  {
    id: "balanced",
    label: "Balanced",
    desc: "Recommended for most images",
  },
  { id: "lossless", label: "Lossless", desc: "Pixel-perfect compression" },
];

export default function CompressPNGPage() {
  const [level, setLevel] = useState("balanced");

  return (
    <SimpleToolPage
      title="Compress PNG"
      description="Squeeze PNG images without losing transparency. Keeps alpha channels intact."
      icon={ImageDown}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["Transparency safe", "Smart palette", "Batch compress"]}
      actionLabel="Compress PNG"
      actionIcon={ImageDown}
      processingMessage="Optimizing PNG..."
      resultSuffix="_compressed"
      dropzone={{
        kind: "image",
        accept: "image/png",
        acceptLabel: "PNG only",
        maxSize: 50,
        multiple: true,
        maxFiles: 20,
      }}
      options={
        <OptionsPanel title="Compression mode">
          <OptionGroup title="Choose strategy">
            <div className="grid gap-2">
              {LEVELS.map((l) => (
                <OptionCard
                  key={l.id}
                  selected={level === l.id}
                  onClick={() => setLevel(l.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">
                        {l.label}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        {l.desc}
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
