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
    <div className="min-h-screen py-8 md:py-12">
      {/* Centered Container */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
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
          <span className="text-zinc-100">Convert</span>
        </nav>

        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link href="/tools/video">
            <ArrowLeft className="h-4 w-4" />
            Back to Video Tools
          </Link>
        </Button>

        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 text-purple-500">
            <Video className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Video to JPG Converter
          </h1>
          <p className="mt-2 text-zinc-400">
            Extract frames from your videos and save them as images
          </p>
        </header>

        {/* Main Tool */}
        <main className="mb-16">
          <VideoToJpgConverter />
        </main>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-xl font-semibold">
            Why Choose Our Converter?
          </h2>
          <VideoConverterFeatures />
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <VideoConverterHowItWorks />
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <VideoConverterFAQ />
        </section>

        {/* SEO Content */}
        <section>
          <VideoConverterSeoContent />
        </section>
      </div>
    </div>
  );
}
