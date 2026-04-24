"use client";

import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionsPanelProps {
  children: ReactNode;
  advancedChildren?: ReactNode;
  className?: string;
  title?: string;
}

export function OptionsPanel({
  children,
  advancedChildren,
  className,
  title = "Options",
}: OptionsPanelProps) {
  if (!advancedChildren) {
    return (
      <Card className={cn("border-border bg-card p-6", className)}>
        <div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface-2 text-muted-foreground">
            <Settings className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
        </div>
        {children}
      </Card>
    );
  }

  return (
    <Card className={cn("border-border bg-card p-6", className)}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 bg-surface-2">
          <TabsTrigger
            value="basic"
            className="flex items-center gap-1.5 text-[13px] data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
            Basic
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="flex items-center gap-1.5 text-[13px] data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Sliders className="h-3.5 w-3.5" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {children}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {advancedChildren}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

interface OptionGroupProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function OptionGroup({
  title,
  description,
  children,
  className,
}: OptionGroupProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div>
        <h4 className="text-[13px] font-medium text-foreground">{title}</h4>
        {description && (
          <p className="text-[12px] text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

interface OptionCardProps {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function OptionCard({
  selected,
  onClick,
  children,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-md border p-3.5 text-left transition-all duration-200",
        selected
          ? "border-red-500/40 bg-red-500/5 ring-1 ring-inset ring-red-500/20"
          : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
        className,
      )}
    >
      {children}
    </button>
  );
}
