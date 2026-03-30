import Link from "next/link";
import { Video, ArrowLeft } from "lucide-react";
import { VideoToJpgConverter, VideoConverterFeatures, VideoConverterFAQ } from "@/components/tools/video";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Video to JPG Converter - Free Online Tool",
  description: "Extract frames from videos and convert them to JPG images. Fast, secure, and completely free. All processing happens in your browser.",
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
        <Link href="/tools/video" className="hover:text-zinc-100 transition-colors">
          Video Tools
        </Link>
        <span>/</span>
        <span className="text-zinc-100">Convert Video to JPG</span>
      </div>

      {/* Back Button */}
      <Link href="/tools/video">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Video Tools
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 text-purple-500">
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
        <h2 className="mb-6 text-2xl font-bold">Why Choose Our Video to JPG Converter?</h2>
        <VideoConverterFeatures />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">How to Convert Video to JPG</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 font-bold">
              1
            </div>
            <h3 className="text-lg font-medium">Upload Video</h3>
            <p className="text-sm text-zinc-400">
              Click to upload your video file (MP4, WebM, MOV up to 500MB)
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 font-bold">
              2
            </div>
            <h3 className="text-lg font-medium">Configure Settings</h3>
            <p className="text-sm text-zinc-400">
              Set frame interval and JPEG quality, then click 
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 font-bold">
              3
            </div>
            <h3 className="text-lg font-medium">Download</h3>
            <p className="text-sm text-zinc-400">
              Download individual frames or all at once with one click
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <VideoConverterFAQ />
      </div>

      {/* SEO Content */}
      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">About Video to JPG Conversion</h2>
        <p className="text-zinc-400 mb-4">
          Converting video frames to JPG images is a common need for content creators, video editors, 
          and anyone working with video content. Our free online video to JPG converter makes this 
          process simple and secure. All processing happens directly in your browser using advanced 
          HTML5 technologies, meaning your videos never leave your device.
        </p>
        <p className="text-zinc-400 mb-4">
          Whether you need to extract thumbnails, create image sequences, or capture specific moments 
          from your videos, our tool provides a fast and efficient solution. With customizable frame 
          intervals and adjustable JPEG quality settings, you have complete control over the output.
        </p>
        <p className="text-zinc-400">
          The tool supports all major video formats including MP4, WebM, and MOV, making it compatible 
          with videos from any source. No registration, no watermarks, and completely free to use.
        </p>
      </div>
    </div>
  );
}
