"use client";

import { Merge, Info } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MergeVideosPage() {
  return (
    <SimpleToolPage
      title="Merge Videos"
      description="Stitch multiple videos into a single file. Clips are joined in the order you upload them."
      icon={Merge}
      accent="purple"
      categoryHref="/tools/video"
      categoryLabel="Video Tools"
      features={["Unlimited clips", "Sequential join", "Preserves audio"]}
      actionLabel="Merge videos"
      actionIcon={Merge}
      processingMessage="Merging your videos..."
      resultSuffix="_merged"
      minFiles={2}
      dropzone={{
        kind: "video",
        accept: "video/*",
        acceptLabel: "MP4, MOV, WebM",
        maxSize: 500,
        multiple: true,
        maxFiles: 20,
      }}
      options={
        <Alert className="border-border-strong bg-surface">
          <Info className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground">
            Videos are joined top-to-bottom in the order shown above. Upload at
            least 2 clips.
          </AlertDescription>
        </Alert>
      }
    />
  );
}
