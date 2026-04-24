"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";

const ANGLES = [
  { id: 90, label: "90°" },
  { id: 180, label: "180°" },
  { id: 270, label: "270°" },
  { id: 0, label: "Custom" },
];

export default function RotateVideoPage() {
  const [angle, setAngle] = useState(90);

  return (
    <SimpleToolPage
      title="Rotate Video"
      description="Rotate a video by 90°, 180°, or 270°. Quickly fix upside-down or sideways clips."
      icon={RotateCw}
      accent="purple"
      categoryHref="/tools/video"
      categoryLabel="Video Tools"
      features={["Lossless rotate", "Keeps audio", "Client-side"]}
      actionLabel={`Rotate by ${angle}°`}
      actionIcon={RotateCw}
      processingMessage="Rotating your video..."
      resultSuffix="_rotated"
      dropzone={{
        kind: "video",
        accept: "video/*",
        acceptLabel: "Any video",
        maxSize: 500,
      }}
      options={
        <OptionsPanel title="Rotation">
          <OptionGroup title="Angle">
            <div className="grid grid-cols-4 gap-2">
              {ANGLES.map((a) => (
                <OptionCard
                  key={a.id}
                  selected={angle === a.id}
                  onClick={() => setAngle(a.id)}
                  className="py-3"
                >
                  <div className="text-center">
                    <span className="font-mono text-[14px] font-semibold">
                      {a.label}
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
