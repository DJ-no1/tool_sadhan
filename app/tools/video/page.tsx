import { Video } from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/constants";
import { ToolCard } from "@/components/shared/tool-card";
import { CategoryHero } from "@/components/shared/category-hero";
import { Badge } from "@/components/ui/badge";

export default function VideoToolsPage() {
  const videoCategory = TOOL_CATEGORIES.find((cat) => cat.id === "video")!;
  const allVideoTools = videoCategory.subcategories.flatMap((s) => s.tools);
  const liveCount = allVideoTools.filter((t) => !t.comingSoon).length;

  return (
    <div>
      <CategoryHero
        title={videoCategory.name}
        description={videoCategory.description}
        icon={Video}
        accent={videoCategory.accent}
        totalCount={allVideoTools.length}
        liveCount={liveCount}
        breadcrumbs={[{ label: "Video Tools" }]}
      />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="space-y-16">
          {videoCategory.subcategories.map((subcategory) => {
            const subLive = subcategory.tools.filter(
              (t) => !t.comingSoon,
            ).length;
            return (
              <section key={subcategory.id}>
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
                    <ToolCard key={tool.id} {...tool} accent="purple" />
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
