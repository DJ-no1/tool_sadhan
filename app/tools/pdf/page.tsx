import { FileText } from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/constants";
import { ToolCard } from "@/components/shared/tool-card";
import { CategoryHero } from "@/components/shared/category-hero";
import { Badge } from "@/components/ui/badge";

export default function PDFToolsPage() {
  const pdfCategory = TOOL_CATEGORIES.find((cat) => cat.id === "pdf")!;
  const allPdfTools = pdfCategory.subcategories.flatMap((s) => s.tools);
  const liveCount = allPdfTools.filter((t) => !t.comingSoon).length;

  return (
    <div>
      <CategoryHero
        title={pdfCategory.name}
        description={pdfCategory.description}
        icon={FileText}
        accent={pdfCategory.accent}
        totalCount={allPdfTools.length}
        liveCount={liveCount}
        breadcrumbs={[{ label: "PDF Tools" }]}
      />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <SubcategoryNav subcategories={pdfCategory.subcategories} />

        <div className="mt-12 space-y-16">
          {pdfCategory.subcategories.map((subcategory) => {
            const subLive = subcategory.tools.filter(
              (t) => !t.comingSoon,
            ).length;
            return (
              <section key={subcategory.id} id={subcategory.id}>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                      {subcategory.name}
                    </h2>
                    <Badge
                      variant="outline"
                      className="border-border bg-surface-2 font-mono text-[10px] text-muted-foreground"
                    >
                      {subLive} / {subcategory.tools.length}
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {subcategory.tools.map((tool) => (
                    <ToolCard key={tool.id} {...tool} accent="red" />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SubcategoryNav({
  subcategories,
}: {
  subcategories: Array<{ id: string; name: string; tools: unknown[] }>;
}) {
  return (
    <nav className="flex flex-wrap gap-2 rounded-lg border border-border bg-surface p-2">
      {subcategories.map((sub) => (
        <a
          key={sub.id}
          href={`#${sub.id}`}
          className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-border hover:bg-surface-2 hover:text-foreground"
        >
          {sub.name}
          <span className="font-mono text-[10px] text-muted-foreground/70">
            {sub.tools.length}
          </span>
        </a>
      ))}
    </nav>
  );
}
