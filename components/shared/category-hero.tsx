import Link from "next/link";
import { type LucideIcon, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CategoryAccent } from "@/lib/constants";

interface CategoryHeroProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: CategoryAccent;
  totalCount: number;
  liveCount: number;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const accentRingMap: Record<CategoryAccent, string> = {
  red: "bg-red-500/10 ring-red-500/20 text-red-400",
  blue: "bg-blue-500/10 ring-blue-500/20 text-blue-400",
  purple: "bg-purple-500/10 ring-purple-500/20 text-purple-400",
};

const accentGlowMap: Record<CategoryAccent, string> = {
  red: "bg-[radial-gradient(ellipse_40%_40%_at_50%_0%,rgba(239,68,68,0.18),transparent_70%)]",
  blue: "bg-[radial-gradient(ellipse_40%_40%_at_50%_0%,rgba(59,130,246,0.18),transparent_70%)]",
  purple:
    "bg-[radial-gradient(ellipse_40%_40%_at_50%_0%,rgba(168,85,247,0.18),transparent_70%)]",
};

export function CategoryHero({
  title,
  description,
  icon: Icon,
  accent,
  totalCount,
  liveCount,
  breadcrumbs = [],
}: CategoryHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px] ${accentGlowMap[accent]}`}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40 mask-radial-fade"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        {breadcrumbs.length > 0 && (
          <nav className="mb-6 flex items-center gap-1 text-[13px] text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-6">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ring-1 ring-inset ${accentRingMap[accent]}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
              {description}. Everything runs in your browser — your files never
              leave your device.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge
              variant="outline"
              className="border-border bg-surface font-mono text-[11px] font-medium text-muted-foreground"
            >
              <span className="mr-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {liveCount} live
            </Badge>
            <Badge
              variant="outline"
              className="border-border bg-surface font-mono text-[11px] font-medium text-muted-foreground"
            >
              {totalCount - liveCount} coming soon
            </Badge>
            <Badge
              variant="outline"
              className="border-border bg-surface font-mono text-[11px] font-medium text-muted-foreground"
            >
              100% free
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
