import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Lock,
  Sparkles,
  Zap,
  Server,
  Gauge,
  FileCheck,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import {
  TOOL_CATEGORIES,
  getToolsByCategory,
  getPopularTools,
  getLiveToolCount,
  getTotalToolCount,
} from "@/lib/constants";
import { CategorySection } from "@/components/shared/category-section";
import { ToolCard } from "@/components/shared/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const liveCount = getLiveToolCount();
  const totalCount = getTotalToolCount();
  const popularTools = getPopularTools(8);

  return (
    <div>
      <HeroSection liveCount={liveCount} totalCount={totalCount} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <CategoryShowcase />

        <section className="border-t border-border py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <Badge
                variant="outline"
                className="mb-3 border-border bg-surface font-mono text-[11px] font-medium text-muted-foreground"
              >
                Trending
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Most used tools
              </h2>
              <p className="mt-2 text-[14px] text-muted-foreground">
                The utilities people reach for every day.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/tools">
                Browse all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularTools.map((tool) => (
              <ToolCard
                key={tool.id}
                {...tool}
                accent={
                  tool.category === "pdf"
                    ? "red"
                    : tool.category === "image"
                      ? "blue"
                      : "purple"
                }
              />
            ))}
          </div>
        </section>

        <div className="space-y-16 py-8">
          {TOOL_CATEGORIES.map((category) => {
            const tools = getToolsByCategory(category.id);
            return (
              <div key={category.id} id={`${category.id}-tools`}>
                <CategorySection
                  id={category.id}
                  title={category.name}
                  description={category.description}
                  icon={category.icon}
                  tools={tools}
                  accent={category.accent}
                />
              </div>
            );
          })}
        </div>

        <FeaturesSection />
        <CTABanner />
      </div>
    </div>
  );
}

function HeroSection({
  liveCount,
  totalCount,
}: {
  liveCount: number;
  totalCount: number;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60 mask-radial-fade"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(168,85,247,0.15),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_40%_30%_at_20%_10%,rgba(239,68,68,0.1),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_40%_30%_at_80%_10%,rgba(59,130,246,0.12),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/tools/video/convert"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-[12px] text-muted-foreground backdrop-blur transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Badge className="border-transparent bg-emerald-500/15 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/20">
              New
            </Badge>
            <span>Video → JPG frame extractor is live</span>
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            The professional{" "}
            <span className="text-gradient-foreground">toolbox</span>
            <br />
            for a modern web.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            A unified suite of <span className="text-foreground">PDF</span>,{" "}
            <span className="text-foreground">image</span>, and{" "}
            <span className="text-foreground">video</span> tools built for
            speed, privacy, and precision. Everything runs locally in your
            browser — your files never leave your device.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-5">
              <Link href="#pdf-tools">
                Start with PDF tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-5"
            >
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="h-4 w-4" />
                Star on GitHub
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {liveCount} of {totalCount} tools live
            </span>
            <Separator
              orientation="vertical"
              className="hidden h-4 sm:inline-block"
            />
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              100% client-side
            </span>
            <Separator
              orientation="vertical"
              className="hidden h-4 sm:inline-block"
            />
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Free forever
            </span>
          </div>
        </div>

        <HeroStatsGrid />
      </div>
    </section>
  );
}

function HeroStatsGrid() {
  const stats = [
    { label: "Tools available", value: "40+", icon: Sparkles },
    { label: "Client-side", value: "100%", icon: Server },
    { label: "Avg. processing", value: "<1s", icon: Gauge },
    { label: "Avg. PDF saved", value: "62%", icon: FileCheck },
  ];
  return (
    <div className="relative mx-auto mt-20 grid max-w-5xl grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface/50 backdrop-blur-sm md:grid-cols-4 md:divide-y-0">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`flex flex-col gap-1.5 p-5 ${i < 2 ? "md:border-b-0" : ""}`}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <stat.icon className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
          <span className="font-mono text-2xl font-semibold tracking-tight text-foreground">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function CategoryShowcase() {
  return (
    <section className="py-16">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <Badge
            variant="outline"
            className="mb-3 border-border bg-surface font-mono text-[11px] font-medium text-muted-foreground"
          >
            Categories
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Built for every format
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] text-muted-foreground">
            Three focused toolkits, one consistent experience.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {TOOL_CATEGORIES.map((category) => {
          const tools = getToolsByCategory(category.id);
          const live = tools.filter((t) => !t.comingSoon).length;
          const accentColor =
            category.accent === "red"
              ? "rgba(239,68,68,0.18)"
              : category.accent === "blue"
                ? "rgba(59,130,246,0.18)"
                : "rgba(168,85,247,0.18)";
          const accentSolid =
            category.accent === "red"
              ? "text-red-400"
              : category.accent === "blue"
                ? "text-blue-400"
                : "text-purple-400";
          const accentBg =
            category.accent === "red"
              ? "bg-red-500/10 ring-red-500/20"
              : category.accent === "blue"
                ? "bg-blue-500/10 ring-blue-500/20"
                : "bg-purple-500/10 ring-purple-500/20";

          return (
            <Link
              key={category.id}
              href={`/tools/${category.id}`}
              className="group relative"
            >
              <Card className="relative h-full overflow-hidden border-border bg-card p-6 transition-all duration-300 hover:border-border-strong hover:shadow-xl hover:shadow-black/20">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-80"
                  style={{ background: accentColor }}
                  aria-hidden="true"
                />
                <div className="relative flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ring-1 ring-inset ${accentBg}`}
                    >
                      <category.icon className={`h-6 w-6 ${accentSolid}`} />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border bg-surface-2 font-mono text-[10px] font-medium text-muted-foreground"
                    >
                      {live} / {tools.length} live
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {category.subcategories.slice(0, 4).map((sub) => (
                      <Badge
                        key={sub.id}
                        variant="outline"
                        className="border-border bg-surface-2 text-[11px] font-normal text-muted-foreground"
                      >
                        {sub.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-[13px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Lock,
      title: "Private by design",
      description:
        "Files are processed in your browser. No uploads, no servers, no data collection.",
    },
    {
      icon: Zap,
      title: "Blazing fast",
      description:
        "WebAssembly-powered engines deliver native-level performance for heavy file operations.",
    },
    {
      icon: Server,
      title: "No accounts",
      description:
        "Every tool is free, unlimited, and ready to use. No sign-ups, watermarks, or ads.",
    },
    {
      icon: Sparkles,
      title: "Modern tooling",
      description:
        "Built on Next.js, TypeScript, and shadcn/ui. Clean, fast, maintainable, open source.",
    },
  ];

  return (
    <section className="relative border-t border-border py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-lines opacity-30 mask-vertical-fade"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="mb-12 text-center">
          <Badge
            variant="outline"
            className="mb-3 border-border bg-surface font-mono text-[11px] font-medium text-muted-foreground"
          >
            Why ToolSadhan
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Built differently.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[14px] text-muted-foreground">
            A fresh take on online tools — fast, private, and respectful of
            your time.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="flex flex-col gap-3 border-border bg-card p-5 transition-colors hover:border-border-strong"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2 text-foreground">
                <f.icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-medium text-foreground">
                  {f.title}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="pb-20 pt-4">
      <Card className="relative overflow-hidden border-border bg-card p-10 text-center md:p-16">
        <div
          className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40 mask-radial-fade"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 -top-40 -z-0 h-[500px] bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(168,85,247,0.12),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Ready to ship files faster?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-muted-foreground">
            Pick a tool, drop a file. No account, no upload, no friction.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-5">
              <Link href="/tools/pdf">
                Browse PDF tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-5">
              <Link href="/tools/video/convert">
                Try video → JPG
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
