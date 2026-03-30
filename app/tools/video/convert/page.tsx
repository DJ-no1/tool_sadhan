import Link from "next/link";
import { Video, ArrowLeft } from "lucide-react";
import {
  VideoToJpgConverter,
  VideoConverterFeatures,
  VideoConverterFAQ,
  VideoConverterHowItWorks,
  VideoConverterSeoContent,
} from "@/components/tools/video/index";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Video to JPG Converter - Free Online Tool",
  description:
    "Extract frames from videos and convert them to JPG images. Fast, secure, and completely free. All processing happens in your browser.",
};

export default function VideoConvertPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/" className="hover:text-zinc-100 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/tools/video"
          className="hover:text-zinc-100 transition-colors"
        >
          Video Tools
        </Link>
        <span>/</span>
        <span className="text-zinc-100">Convert Video to JPG</span>
      </div>

      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/tools/video">
          <ArrowLeft className="h-4 w-4" />
          Back to Video Tools
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500/20 to-violet-500/20 text-purple-500">
            <Video className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Video to JPG Converter
            </h1>
            <p className="text-lg text-zinc-400">
              Extract frames from your videos and save them as JPG images
            </p>
          </div>
        </div>
      </div>

      {/* Main Tool */}
      <div className="mb-12">
        <VideoToJpgConverter />
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">
          Why Choose Our Video to JPG Converter?
        </h2>
        <VideoConverterFeatures />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <VideoConverterHowItWorks />
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <VideoConverterFAQ />
      </div>

      {/* SEO Content */}
      <div className="max-w-none">
        <VideoConverterSeoContent />
      </div>
    </div>
  );
}
