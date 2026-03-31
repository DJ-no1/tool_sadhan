"use client";

import Link from "next/link";
import { Wrench, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { TOOL_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75">
      <div className="container mx-auto flex h-14 items-center px-8 md:px-16 lg:px-24">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">ToolSadhan</span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <NavigationMenu className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <div className="rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-2 py-1.5 shadow-lg shadow-black/20">
          <NavigationMenuList className="gap-1">
            {TOOL_CATEGORIES.map((category) => (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger className="h-9 bg-transparent px-3 rounded-full text-sm font-medium text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100 data-[state=open]:bg-zinc-800/70 data-[state=open]:text-zinc-100 transition-all">
                  <category.icon className={cn("mr-1.5 h-4 w-4", category.color)} />
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] p-4 lg:w-[750px] rounded-2xl">
                    <div className="mb-3 border-b border-zinc-800 pb-2">
                      <Link
                        href={`/tools/${category.id}`}
                        className="text-sm font-semibold text-zinc-100 hover:text-primary"
                      >
                        All {category.name} →
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            {subcategory.name}
                          </h4>
                          <ul className="space-y-1">
                            {subcategory.tools.slice(0, 6).map((tool) => (
                              <li key={tool.id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={tool.href}
                                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-400 transition-all hover:bg-zinc-800/70 hover:text-zinc-100"
                                  >
                                    <tool.icon className={cn("h-3.5 w-3.5 shrink-0", category.color)} />
                                    <span className="truncate">{tool.name}</span>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            {/* All Tools Link */}
            <NavigationMenuItem>
              <Link
                href="/tools"
                className="flex h-9 items-center gap-1 px-4 rounded-full text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-800/70 hover:text-zinc-100"
              >
                All Tools
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          </div>
        </NavigationMenu>

        {/* Spacer for mobile layout */}
        <div className="flex-1 md:hidden" />

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <nav className="container mx-auto px-4 py-4">
            <div className="space-y-4">
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
                className="block py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100"
              >
                All Tools
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
  category: (typeof TOOL_CATEGORIES)[0];
  onLinkClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-zinc-300"
      >
        <span className="flex items-center gap-2">
          <category.icon className={cn("h-4 w-4", category.color)} />
          {category.name}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="ml-6 space-y-3 border-l border-zinc-800 pl-4 pt-2">
          {category.subcategories.map((subcategory) => (
            <div key={subcategory.id}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {subcategory.name}
              </p>
              <div className="space-y-1">
                {subcategory.tools.slice(0, 4).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    onClick={onLinkClick}
                    className="block py-1 text-sm text-zinc-400 hover:text-zinc-100"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link
            href={`/tools/${category.id}`}
            onClick={onLinkClick}
            className="block py-1 text-sm font-medium text-primary"
          >
            View all {category.name} →
          </Link>
        </div>
      )}
    </div>
  );
}
