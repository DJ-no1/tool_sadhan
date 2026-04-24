"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";

const FILTERS = [
  { id: "none", label: "Original", desc: "No filter" },
  { id: "grayscale", label: "Grayscale", desc: "Classic black & white" },
  { id: "sepia", label: "Sepia", desc: "Warm vintage tone" },
  { id: "invert", label: "Invert", desc: "Negative colors" },
  { id: "blur", label: "Blur", desc: "Soft focus effect" },
  { id: "sharpen", label: "Sharpen", desc: "Crisp detail boost" },
];

export default function ImageFiltersPage() {
  const [filter, setFilter] = useState("none");

  return (
    <SimpleToolPage
      title="Image Filters"
      description="Apply classic filters — grayscale, sepia, blur, sharpen, and more — in a single click."
      icon={Palette}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["6 filters", "Real-time preview", "One-click apply"]}
      actionLabel={`Apply ${
        FILTERS.find((f) => f.id === filter)?.label ?? "filter"
      }`}
      actionIcon={Palette}
      processingMessage="Applying filter..."
      resultSuffix={filter === "none" ? "_original" : `_${filter}`}
      dropzone={{
        kind: "image",
        accept: "image/*",
        acceptLabel: "Any image",
        maxSize: 50,
      }}
      options={
        <OptionsPanel title="Choose filter">
          <OptionGroup title="Filters">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FILTERS.map((f) => (
                <OptionCard
                  key={f.id}
                  selected={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      {f.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {f.desc}
                    </p>
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
