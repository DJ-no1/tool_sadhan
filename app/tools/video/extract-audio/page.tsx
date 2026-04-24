"use client";

import { useState } from "react";
import { Clapperboard } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";

const FORMATS = ["mp3", "wav", "m4a", "ogg"] as const;
type Format = (typeof FORMATS)[number];

export default function ExtractAudioPage() {
  const [format, setFormat] = useState<Format>("mp3");

  return (
    <SimpleToolPage
      title="Extract Audio"
      description="Pull the audio track out of any video. Export as MP3, WAV, M4A, or OGG."
      icon={Clapperboard}
      accent="purple"
      categoryHref="/tools/video"
      categoryLabel="Video Tools"
      features={["4 formats", "Keeps quality", "Client-side"]}
      actionLabel={`Extract ${format.toUpperCase()}`}
      actionIcon={Clapperboard}
      processingMessage="Extracting audio track..."
      resultSuffix="_audio"
      resultExtension={format}
      dropzone={{
        kind: "video",
        accept: "video/*",
        acceptLabel: "Any video",
        maxSize: 500,
      }}
      options={
        <OptionsPanel title="Output audio">
          <OptionGroup title="Format">
            <div className="grid grid-cols-4 gap-2">
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
