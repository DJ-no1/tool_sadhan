import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ToolAccent = "red" | "blue" | "purple" | "emerald" | "amber" | "neutral";

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent?: ToolAccent;
  comingSoon?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

const accentMap: Record<
  ToolAccent,
  {
    icon: string;
    iconBg: string;
    iconRing: string;
    hoverBorder: string;
    hoverBg: string;
    glow: string;
  }
> = {
  red: {
    icon: "text-red-400",
    iconBg: "bg-red-500/10",
    iconRing: "ring-red-500/20",
    hoverBorder: "group-hover:border-red-500/40",
    hoverBg: "group-hover:bg-red-500/[0.03]",
    glow: "from-red-500/10",
  },
  blue: {
    icon: "text-blue-400",
    iconBg: "bg-blue-500/10",
    iconRing: "ring-blue-500/20",
    hoverBorder: "group-hover:border-blue-500/40",
    hoverBg: "group-hover:bg-blue-500/[0.03]",
    glow: "from-blue-500/10",
  },
  purple: {
    icon: "text-purple-400",
    iconBg: "bg-purple-500/10",
    iconRing: "ring-purple-500/20",
    hoverBorder: "group-hover:border-purple-500/40",
    hoverBg: "group-hover:bg-purple-500/[0.03]",
    glow: "from-purple-500/10",
  },
  emerald: {
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconRing: "ring-emerald-500/20",
    hoverBorder: "group-hover:border-emerald-500/40",
    hoverBg: "group-hover:bg-emerald-500/[0.03]",
    glow: "from-emerald-500/10",
  },
  amber: {
    icon: "text-amber-400",
    iconBg: "bg-amber-500/10",
    iconRing: "ring-amber-500/20",
    hoverBorder: "group-hover:border-amber-500/40",
    hoverBg: "group-hover:bg-amber-500/[0.03]",
    glow: "from-amber-500/10",
  },
  neutral: {
    icon: "text-foreground",
    iconBg: "bg-surface-2",
    iconRing: "ring-border",
    hoverBorder: "group-hover:border-border-strong",
    hoverBg: "group-hover:bg-surface-2",
    glow: "from-foreground/5",
  },
};

export function ToolCard({
  name,
  description,
  href,
  icon: Icon,
  accent = "neutral",
  comingSoon = false,
  isNew = false,
  isPopular = false,
}: ToolCardProps) {
  const styles = accentMap[accent];

  const body = (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border-border bg-card p-5 transition-all duration-200",
        !comingSoon && "hover:shadow-lg hover:shadow-black/20",
        !comingSoon && styles.hoverBorder,
        !comingSoon && styles.hoverBg,
        comingSoon && "cursor-not-allowed opacity-60",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-x-10 -top-20 h-40 bg-gradient-to-b to-transparent opacity-0 blur-2xl transition-opacity duration-300",
          !comingSoon && "group-hover:opacity-100",
          styles.glow,
        )}
      />

      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        {comingSoon && (
          <Badge
            variant="outline"
            className="border-border bg-surface-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
          >
            Soon
          </Badge>
        )}
        {isNew && !comingSoon && (
          <Badge className="border-transparent bg-emerald-500/15 text-[10px] font-medium uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/20">
            New
          </Badge>
        )}
        {isPopular && !comingSoon && !isNew && (
          <Badge
            variant="outline"
            className="border-border bg-surface-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
          >
            Popular
          </Badge>
        )}
      </div>

      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md ring-1 ring-inset transition-transform duration-200",
              !comingSoon && "group-hover:scale-[1.04]",
              styles.iconBg,
              styles.iconRing,
            )}
          >
            <Icon className={cn("h-[18px] w-[18px]", styles.icon)} />
          </div>
          {!comingSoon && (
            <ArrowUpRight className="h-4 w-4 translate-x-1 -translate-y-0.5 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-foreground group-hover:opacity-100" />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-[14px] font-medium leading-tight tracking-tight text-foreground">
            {name}
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );

  if (comingSoon) {
    return (
      <div role="link" aria-disabled="true">
        {body}
      </div>
    );
  }

  return (
    <Link href={href} className="block">
      {body}
    </Link>
  );
}

export type { ToolAccent };
