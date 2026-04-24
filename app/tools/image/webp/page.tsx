"use client";

import { useState } from "react";
import { Image as ImageIcon, ArrowLeftRight } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";

export default function WebPConvertPage() {
  const [direction, setDirection] = useState<"to-webp" | "from-webp">(
    "to-webp",
  );

  return (
    <SimpleToolPage
      title="WebP Convert"
      description="Convert images to WebP for tiny file sizes — or convert WebP back to JPG/PNG for broader compatibility."
      icon={ImageIcon}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["Two-way convert", "Tiny files", "Preserves alpha"]}
      actionLabel={
        direction === "to-webp" ? "Convert to WebP" : "Convert from WebP"
      }
      actionIcon={ArrowLeftRight}
      processingMessage="Converting..."
      resultSuffix=""
      resultExtension={direction === "to-webp" ? "webp" : "png"}
      dropzone={{
        kind: "image",
        accept: direction === "to-webp" ? "image/*" : "image/webp",
        acceptLabel: direction === "to-webp" ? "Any image" : "WebP only",
        maxSize: 50,
        multiple: true,
        maxFiles: 20,
      }}
      options={
        <OptionsPanel title="Direction">
          <OptionGroup title="Convert direction">
            <div className="grid grid-cols-2 gap-2">
              <OptionCard
                selected={direction === "to-webp"}
                onClick={() => setDirection("to-webp")}
              >
                <div className="text-center">
                  <p className="text-[13px] font-medium text-foreground">
                    Image → WebP
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    JPG/PNG → .webp
                  </p>
                </div>
              </OptionCard>
              <OptionCard
                selected={direction === "from-webp"}
                onClick={() => setDirection("from-webp")}
              >
                <div className="text-center">
                  <p className="text-[13px] font-medium text-foreground">
                    WebP → Image
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    .webp → JPG/PNG
                  </p>
                </div>
              </OptionCard>
            </div>
          </OptionGroup>
        </OptionsPanel>
      }
    />
  );
}
