"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import {
  OptionsPanel,
  OptionGroup,
  OptionCard,
} from "@/components/tools/pdf/options-panel";

const CODECS = [
  { id: "h264", label: "H.264", desc: "Best compatibility" },
  { id: "h265", label: "H.265 / HEVC", desc: "Smaller files, modern players" },
  { id: "vp9", label: "VP9", desc: "Web-optimized" },
];

export default function VideoToMP4Page() {
  const [codec, setCodec] = useState("h264");

  return (
    <SimpleToolPage
      title="Convert to MP4"
      description="Convert any video (MOV, AVI, MKV, WebM…) into MP4 with your preferred codec."
      icon={Film}
      accent="purple"
      categoryHref="/tools/video"
      categoryLabel="Video Tools"
      features={["Multi codec", "High quality", "Universal playback"]}
      actionLabel="Convert to MP4"
      actionIcon={Film}
      processingMessage="Transcoding video..."
      resultSuffix=""
      resultExtension="mp4"
      dropzone={{
        kind: "video",
        accept: "video/*",
        acceptLabel: "Any video",
        maxSize: 500,
      }}
      options={
        <OptionsPanel title="Encoding">
          <OptionGroup title="Codec">
            <div className="grid gap-2 sm:grid-cols-3">
              {CODECS.map((c) => (
                <OptionCard
                  key={c.id}
                  selected={codec === c.id}
                  onClick={() => setCodec(c.id)}
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      {c.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {c.desc}
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
