import { getToolsByCategory, TOOL_CATEGORIES } from "@/lib/constants";
import { ToolCard } from "@/components/shared/tool-card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PDFToolsPage() {
  const pdfCategory = TOOL_CATEGORIES.find((cat) => cat.id === "pdf")!;
  const tools = getToolsByCategory("pdf");

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/" className="hover:text-zinc-100 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-zinc-100">PDF Tools</span>
      </div>

      {/* Header */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50 text-red-500">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{pdfCategory.name}</h1>
            <p className="text-lg text-zinc-400">{pdfCategory.description}</p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} {...tool} color="text-red-500" />
        ))}
      </div>
    </div>
  );
}
