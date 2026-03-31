"use client";

import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionsPanelProps {
  children: ReactNode;
  advancedChildren?: ReactNode;
  className?: string;
}

export function OptionsPanel({
  children,
  advancedChildren,
  className,
}: OptionsPanelProps) {
  if (!advancedChildren) {
    return (
      <div className={cn("rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6", className)}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
            <Settings className="h-5 w-5 text-zinc-400" />
          </div>
          <h3 className="font-semibold text-lg">Options</h3>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6", className)}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-800/50">
          <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-zinc-700">
            <Settings className="h-4 w-4" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2 data-[state=active]:bg-zinc-700">
            <Sliders className="h-4 w-4" />
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
    </div>
  );
}

interface OptionGroupProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function OptionGroup({ title, description, children, className }: OptionGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        {description && <p className="text-sm text-zinc-500">{description}</p>}
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

export function OptionCard({ selected, onClick, children, className }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all",
        selected
          ? "border-red-500 bg-red-500/10"
          : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50",
        className
      )}
    >
      {children}
    </button>
  );
}
