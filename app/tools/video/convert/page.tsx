import Link from "next/link";
import { Video, ArrowLeft, ChevronRight, Zap, Shield, Sparkles } from "lucide-react";
import {
  VideoToJpgConverter,
  VideoConverterFeatures,
  VideoConverterFAQ,
  VideoConverterHowItWorks,
  VideoConverterSeoContent,
} from "@/components/tools/video/index";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Video to JPG Converter - ToolSadhan",
  description:
    "Extract frames from videos and convert them to JPG images. Fast, secure, and completely free. All processing happens in your browser.",
};

export default function VideoConvertPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(ellipse_35%_40%_at_50%_0%,rgba(168,85,247,0.18),transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40 mask-radial-fade"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-6 py-14 lg:px-8 lg:py-20">
          <nav className="mb-6 flex items-center gap-1 text-[13px] text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <Link
              href="/tools/video"
              className="transition-colors hover:text-foreground"
            >
              Video Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-foreground">Video to JPG</span>
          </nav>

          <Link
            href="/tools/video"
            className="group mb-8 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to video tools
          </Link>

          <div className="flex flex-col gap-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 ring-1 ring-inset ring-purple-500/20">
              <Video className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="border-transparent bg-emerald-500/15 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/20">
                  New
                </Badge>
                <span className="text-[12px] text-muted-foreground">
                  First video tool live
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Video to JPG Converter
              </h1>
              <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                Extract frames from your videos and save them as images.
                Everything runs in your browser — your files never leave your
                device.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge
                variant="outline"
                className="border-border bg-surface/80 backdrop-blur font-mono text-[11px] font-medium text-muted-foreground"
              >
                <Zap className="mr-1.5 h-3 w-3" />
                Client-side
              </Badge>
              <Badge
                variant="outline"
                className="border-border bg-surface/80 backdrop-blur font-mono text-[11px] font-medium text-muted-foreground"
              >
                <Shield className="mr-1.5 h-3 w-3" />
                No upload
              </Badge>
              <Badge
                variant="outline"
                className="border-border bg-surface/80 backdrop-blur font-mono text-[11px] font-medium text-muted-foreground"
              >
                <Sparkles className="mr-1.5 h-3 w-3" />
                Free
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <main className="mb-16">
          <VideoToJpgConverter />
        </main>

        <Separator className="my-12" />

        <section className="mb-12">
          <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Why choose our converter
          </h2>
          <VideoConverterFeatures />
        </section>

        <section className="mb-12">
          <VideoConverterHowItWorks />
        </section>

        <section className="mb-12">
          <VideoConverterFAQ />
        </section>

        <section>
          <VideoConverterSeoContent />
        </section>
      </div>
    </div>
  );
}
