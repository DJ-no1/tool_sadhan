import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { ToolCard, type ToolAccent } from "./tool-card";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tools: Tool[];
  accent: ToolAccent;
}

const headerAccent: Record<ToolAccent, string> = {
  red: "text-red-400 bg-red-500/10 ring-red-500/20",
  blue: "text-blue-400 bg-blue-500/10 ring-blue-500/20",
  purple: "text-purple-400 bg-purple-500/10 ring-purple-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
  amber: "text-amber-400 bg-amber-500/10 ring-amber-500/20",
  neutral: "text-foreground bg-surface-2 ring-border",
};

export function CategorySection({
  id,
  title,
  description,
  icon: Icon,
  tools,
  accent,
}: CategorySectionProps) {
  const liveCount = tools.filter((t) => !t.comingSoon).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md ring-1 ring-inset",
              headerAccent[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              <Badge
                variant="outline"
                className="border-border bg-surface-2 font-mono text-[10px] font-medium text-muted-foreground"
              >
                {liveCount} live
              </Badge>
            </div>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <Link
          href={`/tools/${id}`}
          className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-2 hover:text-foreground"
        >
          View all {title.toLowerCase()}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} {...tool} accent={accent} />
        ))}
      </div>
    </section>
  );
}
