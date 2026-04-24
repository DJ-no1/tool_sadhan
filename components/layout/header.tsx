"use client";

import Link from "next/link";
import { ChevronDown, Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TOOL_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const accentIconBg: Record<string, string> = {
  pdf: "bg-red-500/10 text-red-400 ring-red-500/20",
  image: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  video: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
};

const accentFeatureBg: Record<string, string> = {
  pdf: "from-red-500/15 to-red-500/5 border-red-500/20",
  image: "from-blue-500/15 to-blue-500/5 border-blue-500/20",
  video: "from-purple-500/15 to-purple-500/5 border-purple-500/20",
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-strong bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-[14px] font-semibold tracking-tight transition-colors"
        >
          <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-foreground text-background transition-transform group-hover:scale-[1.04]">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.5),transparent_50%)] opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="relative text-[12px] font-bold leading-none">T</span>
          </div>
          <span className="text-foreground">ToolSadhan</span>
          <Badge
            variant="outline"
            className="hidden border-border bg-surface font-mono text-[9px] font-medium uppercase tracking-wider text-muted-foreground sm:inline-flex"
          >
            Beta
          </Badge>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-0.5">
            {TOOL_CATEGORIES.map((category) => {
              const popular = category.subcategories
                .flatMap((s) => s.tools)
                .find((t) => t.isPopular && !t.comingSoon);

              return (
                <NavigationMenuItem key={category.id}>
                  <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-[13px] font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground data-[state=open]:bg-surface-2 data-[state=open]:text-foreground">
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[720px] p-0">
                      <div className="grid grid-cols-[220px_1fr]">
                        <div
                          className={cn(
                            "relative overflow-hidden border-r border-border bg-gradient-to-br p-5",
                            accentFeatureBg[category.id],
                          )}
                        >
                          <div
                            className={cn(
                              "mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md ring-1 ring-inset",
                              accentIconBg[category.id],
                            )}
                          >
                            <category.icon className="h-5 w-5" />
                          </div>
                          <h3 className="text-[15px] font-semibold text-foreground">
                            {category.name}
                          </h3>
                          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                            {category.description}
                          </p>
                          <Link
                            href={`/tools/${category.id}`}
                            className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-foreground hover:underline"
                          >
                            Browse all
                            <ArrowRight className="h-3 w-3" />
                          </Link>

                          {popular && (
                            <div className="mt-5 border-t border-border/80 pt-4">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Featured
                              </p>
                              <Link
                                href={popular.href}
                                className="mt-2 flex items-start gap-2 rounded-md border border-transparent p-2 transition-colors hover:border-border hover:bg-background/40"
                              >
                                <popular.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                                <div>
                                  <p className="text-[12px] font-medium text-foreground">
                                    {popular.name}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {popular.description}
                                  </p>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            {category.subcategories.map((subcategory) => (
                              <div key={subcategory.id} className="space-y-2">
                                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                  {subcategory.name}
                                </h4>
                                <ul className="space-y-0.5">
                                  {subcategory.tools.slice(0, 5).map((tool) => (
                                    <li key={tool.id}>
                                      <NavigationMenuLink asChild>
                                        <Link
                                          href={tool.href}
                                          className={cn(
                                            "flex items-center gap-2 rounded-sm px-2 py-1.5 text-[12.5px] transition-colors",
                                            tool.comingSoon
                                              ? "cursor-not-allowed text-muted-foreground/60"
                                              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                                          )}
                                          onClick={(e) => {
                                            if (tool.comingSoon)
                                              e.preventDefault();
                                          }}
                                        >
                                          <tool.icon className="h-3.5 w-3.5 shrink-0" />
                                          <span className="truncate">
                                            {tool.name}
                                          </span>
                                          {tool.comingSoon && (
                                            <Badge
                                              variant="outline"
                                              className="ml-auto border-border bg-surface-2 text-[9px] font-normal text-muted-foreground"
                                            >
                                              soon
                                            </Badge>
                                          )}
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}

            <NavigationMenuItem>
              <Link
                href="/tools"
                className="flex h-9 items-center rounded-md px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                All tools
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 items-center justify-end gap-1.5">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden h-8 gap-1.5 text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">GitHub</span>
            </Link>
          </Button>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-2 hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto max-w-7xl px-6 py-4">
            <div className="space-y-1">
              {TOOL_CATEGORIES.map((category) => (
                <MobileMenuCategory
                  key={category.id}
                  category={category}
                  onLinkClick={() => setMobileMenuOpen(false)}
                />
              ))}
              <Link
                href="/tools"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-2"
              >
                All tools
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileMenuCategory({
  category,
  onLinkClick,
}: {
  category: (typeof TOOL_CATEGORIES)[number];
  onLinkClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-2"
      >
        <span className="flex items-center gap-2">
          <Sparkles
            className={cn(
              "h-3.5 w-3.5",
              category.id === "pdf" && "text-red-400",
              category.id === "image" && "text-blue-400",
              category.id === "video" && "text-purple-400",
            )}
          />
          {category.name}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen && (
        <div className="ml-3 space-y-3 border-l border-border pl-4 pt-2 pb-2">
          {category.subcategories.map((subcategory) => (
            <div key={subcategory.id}>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {subcategory.name}
              </p>
              <div className="space-y-0.5">
                {subcategory.tools.slice(0, 4).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    onClick={(e) => {
                      if (tool.comingSoon) {
                        e.preventDefault();
                        return;
                      }
                      onLinkClick();
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-sm px-2 py-1 text-sm",
                      tool.comingSoon
                        ? "cursor-not-allowed text-muted-foreground/50"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                    )}
                  >
                    {tool.name}
                    {tool.comingSoon && (
                      <Badge
                        variant="outline"
                        className="ml-auto border-border bg-surface-2 text-[9px] text-muted-foreground"
                      >
                        soon
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link
            href={`/tools/${category.id}`}
            onClick={onLinkClick}
            className="block rounded-sm px-2 py-1 text-sm font-medium text-foreground"
          >
            View all {category.name} →
          </Link>
        </div>
      )}
    </div>
  );
}
