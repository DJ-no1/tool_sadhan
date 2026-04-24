"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
} from "@/components/tools/pdf/options-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TrimVideoPage() {
  const [start, setStart] = useState("00:00:00");
  const [end, setEnd] = useState("00:00:30");

  return (
    <SimpleToolPage
      title="Trim Video"
      description="Cut out the part of a video you want — set precise start and end timestamps."
      icon={Scissors}
      accent="purple"
      categoryHref="/tools/video"
      categoryLabel="Video Tools"
      features={["Frame-accurate", "Lossless trim", "Client-side"]}
      actionLabel="Trim video"
      actionIcon={Scissors}
      processingMessage="Trimming your video..."
      resultSuffix="_trimmed"
      dropzone={{
        kind: "video",
        accept: "video/*",
        acceptLabel: "Any video",
        maxSize: 500,
      }}
      options={
        <OptionsPanel title="Trim range">
          <OptionGroup
            title="Timestamps"
            description="Format HH:MM:SS — inclusive of start, exclusive of end"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start" className="text-[12px]">
                  Start
                </Label>
                <Input
                  id="start"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="bg-surface-2 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end" className="text-[12px]">
                  End
                </Label>
                <Input
                  id="end"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="bg-surface-2 font-mono"
                />
              </div>
            </div>
          </OptionGroup>
        </OptionsPanel>
      }
    />
  );
}
