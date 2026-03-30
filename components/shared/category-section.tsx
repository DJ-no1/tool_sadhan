import { LucideIcon } from "lucide-react";
import { ToolCard } from "./tool-card";
import { Tool } from "@/types";

interface CategorySectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tools: Tool[];
  color?: string;
}

export function CategorySection({ title, description, icon: Icon, tools, color }: CategorySectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800/50 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} {...tool} color={color} />
        ))}
      </div>
    </section>
  );
}
