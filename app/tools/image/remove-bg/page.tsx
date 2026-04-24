"use client";

import { useState } from "react";
import { Eraser } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";

const MODES = [
  { id: "auto", label: "Auto", desc: "AI detects subject vs. background" },
  { id: "portrait", label: "Portrait", desc: "Optimized for people" },
  { id: "product", label: "Product", desc: "Optimized for objects" },
];

export default function RemoveBGPage() {
  const [mode, setMode] = useState("auto");

  return (
    <SimpleToolPage
      title="Remove Background"
      description="Erase the background from any photo. Keeps subjects crisp and ships a transparent PNG."
      icon={Eraser}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["AI powered", "Transparent PNG", "HD preserved"]}
      actionLabel="Remove background"
      actionIcon={Eraser}
      processingMessage="Detecting subject & removing background..."
      resultSuffix="_no_bg"
      resultExtension="png"
      dropzone={{
        kind: "image",
        accept: "image/*",
        acceptLabel: "Any image",
        maxSize: 50,
      }}
      options={
        <OptionsPanel title="Mode">
          <OptionGroup
            title="Detection mode"
            description="Pick a preset that matches your photo"
          >
            <div className="grid gap-2 sm:grid-cols-3">
              {MODES.map((m) => (
                <OptionCard
                  key={m.id}
                  selected={mode === m.id}
                  onClick={() => setMode(m.id)}
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      {m.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {m.desc}
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
