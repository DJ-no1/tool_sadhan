"use client";

import { useState } from "react";
import { FileOutput } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";

const FORMATS = ["jpg", "png", "webp", "avif", "bmp", "tiff"] as const;
type Format = (typeof FORMATS)[number];

export default function ConvertImagePage() {
  const [format, setFormat] = useState<Format>("webp");

  return (
    <SimpleToolPage
      title="Convert Image"
      description="Convert between popular image formats. JPG, PNG, WebP, AVIF, BMP, and TIFF — all in your browser."
      icon={FileOutput}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["6 formats", "Bulk convert", "Preserves metadata"]}
      actionLabel={`Convert to ${format.toUpperCase()}`}
      actionIcon={FileOutput}
      processingMessage="Converting your image..."
      resultSuffix=""
      resultExtension={format}
      dropzone={{
        kind: "image",
        accept: "image/*",
        acceptLabel: "Any image",
        maxSize: 50,
        multiple: true,
        maxFiles: 20,
      }}
      options={
        <OptionsPanel title="Target format">
          <OptionGroup title="Output format">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {FORMATS.map((f) => (
                <OptionCard
                  key={f}
                  selected={format === f}
                  onClick={() => setFormat(f)}
                  className="py-2"
                >
                  <div className="text-center">
                    <span className="font-mono text-[13px] font-semibold uppercase tracking-wider">
                      {f}
                    </span>
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
