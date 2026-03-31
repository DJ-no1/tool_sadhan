import { TOOL_CATEGORIES } from "@/lib/constants";
import { ToolCard } from "@/components/shared/tool-card";
import { FileText, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function PDFToolsPage() {
  const pdfCategory = TOOL_CATEGORIES.find((cat) => cat.id === "pdf")!;

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      {/* Left decorative cut */}
      <div className="fixed left-0 top-0 h-full w-16 md:w-24 lg:w-32 pointer-events-none z-10">
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-red-500/20 to-transparent" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-red-500/30 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-blue-500/30 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
        <div className="absolute top-1/4 left-4 w-2 h-2 rounded-full bg-red-500/50 blur-sm" />
        <div className="absolute top-1/2 left-6 w-1.5 h-1.5 rounded-full bg-blue-500/50 blur-sm" />
        <div className="absolute top-3/4 left-3 w-2 h-2 rounded-full bg-purple-500/50 blur-sm" />
      </div>

      {/* Right decorative cut */}
      <div className="fixed right-0 top-0 h-full w-16 md:w-24 lg:w-32 pointer-events-none z-10">
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute top-1/4 right-0 w-full h-px bg-gradient-to-l from-purple-500/30 to-transparent" />
        <div className="absolute top-1/2 right-0 w-full h-px bg-gradient-to-l from-blue-500/30 to-transparent" />
        <div className="absolute top-3/4 right-0 w-full h-px bg-gradient-to-l from-red-500/30 to-transparent" />
        <div className="absolute top-1/4 right-4 w-2 h-2 rounded-full bg-purple-500/50 blur-sm" />
        <div className="absolute top-1/2 right-6 w-1.5 h-1.5 rounded-full bg-red-500/50 blur-sm" />
        <div className="absolute top-3/4 right-3 w-2 h-2 rounded-full bg-blue-500/50 blur-sm" />
      </div>

      {/* Main content */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-zinc-100 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-zinc-100">PDF Tools</span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-red-500/20 mb-6 relative">
            <FileText className="h-12 w-12 text-red-500" />
            <div className="absolute -inset-2 rounded-3xl bg-red-500/10 blur-xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{pdfCategory.name}</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">{pdfCategory.description}</p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-300">
              <Zap className="h-4 w-4 text-yellow-400" />
              Fast Processing
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-300">
              <Shield className="h-4 w-4 text-green-400" />
              100% Secure
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-300">
              <Sparkles className="h-4 w-4 text-blue-400" />
              Free Forever
            </div>
          </div>
        </div>

        {/* Tool Subcategories */}
        <div className="space-y-12">
          {pdfCategory.subcategories.map((subcategory) => (
            <div key={subcategory.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                <h2 className="text-lg font-semibold text-zinc-300 px-4">{subcategory.name}</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-zinc-700 to-transparent" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {subcategory.tools.map((tool) => (
                  <ToolCard key={tool.id} {...tool} color="text-red-500" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
