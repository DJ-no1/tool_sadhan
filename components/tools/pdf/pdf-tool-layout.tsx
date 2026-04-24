"use client";

import { ReactNode } from "react";
import {
  type LucideIcon,
  ArrowLeft,
  Shield,
  Zap,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PDFToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
  features?: string[];
}

export function PDFToolLayout({
  title,
  description,
  icon: Icon,
  children,
  features = ["Client-side", "No watermark", "Unlimited"],
}: PDFToolLayoutProps) {
  const featureIcons = [Zap, Shield, Sparkles];

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[350px] bg-[radial-gradient(ellipse_35%_40%_at_50%_0%,rgba(239,68,68,0.16),transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40 mask-radial-fade"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
          <nav className="mb-6 flex items-center gap-1 text-[13px] text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <Link
              href="/tools/pdf"
              className="transition-colors hover:text-foreground"
            >
              PDF Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-foreground">{title}</span>
          </nav>

          <Link
            href="/tools/pdf"
            className="group mb-8 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to PDF tools
          </Link>

          <div className="flex flex-col gap-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20">
              <Icon className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
              <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {features.map((feature, idx) => {
                const FeatureIcon = featureIcons[idx % featureIcons.length];
                return (
                  <Badge
                    key={feature}
                    variant="outline"
                    className={cn(
                      "border-border bg-surface/80 backdrop-blur font-mono text-[11px] font-medium text-muted-foreground",
                    )}
                  >
                    <FeatureIcon className="mr-1.5 h-3 w-3" />
                    {feature}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">{children}</div>
    </div>
  );
}
