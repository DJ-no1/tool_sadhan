import { TOOL_CATEGORIES, getToolsByCategory } from "@/lib/constants";
import { CategorySection } from "@/components/shared/category-section";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-8 md:px-16 lg:px-24 py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-12 text-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 space-y-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-zinc-300">100% Free • No Signup Required</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your Complete
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"> Tool Library</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Professional-grade tools for PDF manipulation, image processing, and video conversion. 
            All tools work in your browser - your files never leave your device.
          </p>
        </div>
      </section>

      {/* Tool Categories */}
      {TOOL_CATEGORIES.map((category) => {
        const tools = getToolsByCategory(category.id);
        return (
          <CategorySection
            key={category.id}
            title={category.name}
            description={category.description}
            icon={category.icon}
            tools={tools}
            color={category.color}
          />
        );
      })}
    </div>
  );
}
