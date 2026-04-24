"use client";

import { Image as ImageIcon } from "lucide-react";
import { SimpleToolPage } from "@/components/tools/shared";

export default function JPGToPNGPage() {
  return (
    <SimpleToolPage
      title="JPG to PNG"
      description="Convert JPEG images to lossless PNG. Preserves every pixel exactly."
      icon={ImageIcon}
      accent="blue"
      categoryHref="/tools/image"
      categoryLabel="Image Tools"
      features={["Lossless output", "Transparency ready", "Batch support"]}
      actionLabel="Convert to PNG"
      actionIcon={ImageIcon}
      processingMessage="Converting JPG to PNG..."
      resultSuffix=""
      resultExtension="png"
      dropzone={{
        kind: "image",
        accept: "image/jpeg,image/jpg",
        acceptLabel: "JPG only",
        maxSize: 50,
        multiple: true,
        maxFiles: 20,
      }}
    />
  );
}
