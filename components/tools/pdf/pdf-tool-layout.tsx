"use client";

import { ReactNode } from "react";
import { LucideIcon, ArrowLeft, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PDFToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  features?: string[];
}

export function PDFToolLayout({
  title,
  description,
  icon: Icon,
  iconColor = "text-red-500",
  children,
  features = ["Fast Processing", "100% Secure", "Free Forever"],
}: PDFToolLayoutProps) {
  const featureIcons = [Zap, Shield, Sparkles];

  return (
    <div className="min-h-screen relative">
      {/* Background with gradient and grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      {/* Decorative elements - Left Cut */}
      <div className="fixed left-0 top-0 h-full w-16 md:w-24 lg:w-32 pointer-events-none z-10">
        <div className="absolute inset-y-0 left-0 w-full">
          {/* Gradient edge */}
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-red-500/20 to-transparent" />
          
          {/* Decorative lines */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-red-500/30 to-transparent" />
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-blue-500/30 to-transparent" />
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-red-500/20 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
          
          {/* Glowing dots */}
          <div className="absolute top-1/4 left-4 w-2 h-2 rounded-full bg-red-500/50 blur-sm" />
          <div className="absolute top-1/2 left-6 w-1.5 h-1.5 rounded-full bg-blue-500/50 blur-sm" />
          <div className="absolute top-3/4 left-3 w-2 h-2 rounded-full bg-purple-500/50 blur-sm" />
        </div>
      </div>

      {/* Decorative elements - Right Cut */}
      <div className="fixed right-0 top-0 h-full w-16 md:w-24 lg:w-32 pointer-events-none z-10">
        <div className="absolute inset-y-0 right-0 w-full">
          {/* Gradient edge */}
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
          
          {/* Decorative lines */}
          <div className="absolute top-1/4 right-0 w-full h-px bg-gradient-to-l from-purple-500/30 to-transparent" />
          <div className="absolute top-1/3 right-0 w-full h-px bg-gradient-to-l from-red-500/20 to-transparent" />
          <div className="absolute top-1/2 right-0 w-full h-px bg-gradient-to-l from-blue-500/30 to-transparent" />
          <div className="absolute top-2/3 right-0 w-full h-px bg-gradient-to-l from-purple-500/20 to-transparent" />
          <div className="absolute top-3/4 right-0 w-full h-px bg-gradient-to-l from-red-500/30 to-transparent" />
          
          {/* Glowing dots */}
          <div className="absolute top-1/4 right-4 w-2 h-2 rounded-full bg-purple-500/50 blur-sm" />
          <div className="absolute top-1/2 right-6 w-1.5 h-1.5 rounded-full bg-red-500/50 blur-sm" />
          <div className="absolute top-3/4 right-3 w-2 h-2 rounded-full bg-blue-500/50 blur-sm" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 py-8">
        {/* Back Button */}
        <Link
          href="/tools/pdf"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to PDF Tools
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-red-500/20 mb-6 relative">
            <Icon className={cn("h-10 w-10", iconColor)} />
            <div className="absolute -inset-1 rounded-2xl bg-red-500/10 blur-xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">{description}</p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {features.map((feature, idx) => {
              const FeatureIcon = featureIcons[idx % featureIcons.length];
              return (
                <div
                  key={feature}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-300"
                >
                  <FeatureIcon className="h-4 w-4 text-blue-400" />
                  {feature}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tool Content */}
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
