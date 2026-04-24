import Link from "next/link";
import { Heart } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { TOOL_CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background">
                <span className="text-[11px] font-bold leading-none">T</span>
              </div>
              <span>ToolSadhan</span>
              <Badge
                variant="outline"
                className="border-border bg-surface font-mono text-[9px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Beta
              </Badge>
            </Link>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Free, professional-grade tools that run entirely in your
              browser. Your files never leave your device.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-2 hover:text-foreground"
                aria-label="GitHub"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {TOOL_CATEGORIES.map((category) => (
            <div key={category.id}>
              <div className="mb-3 flex items-center gap-2">
                <category.icon
                  className={
                    category.accent === "red"
                      ? "h-3.5 w-3.5 text-red-400"
                      : category.accent === "blue"
                        ? "h-3.5 w-3.5 text-blue-400"
                        : "h-3.5 w-3.5 text-purple-400"
                  }
                />
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-foreground">
                  {category.name}
                </h4>
              </div>
              <ul className="space-y-2">
                {category.subcategories.slice(0, 4).map((sub) => {
                  const firstTool = sub.tools[0];
                  if (!firstTool) return null;
                  return (
                    <li key={sub.id}>
                      <Link
                        href={firstTool.href}
                        className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link
                    href={`/tools/${category.id}`}
                    className="text-[13px] font-medium text-foreground transition-colors hover:underline"
                  >
                    View all →
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mt-12" />

        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
            © {new Date().getFullYear()} ToolSadhan — built with{" "}
            <Heart className="h-3 w-3 fill-red-500 text-red-500" /> for the
            web.
          </p>
          <nav className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
