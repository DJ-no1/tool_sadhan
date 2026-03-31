"use client";

import { LucideIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export function ActionButton({
  onClick,
  disabled,
  loading,
  icon: Icon,
  children,
  className,
  variant = "primary",
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "relative h-14 text-lg font-semibold gap-3 transition-all overflow-hidden group",
        variant === "primary"
          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25"
          : "bg-zinc-800 hover:bg-zinc-700 text-white",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Background shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <span className="relative flex items-center gap-3">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : Icon ? (
          <Icon className="h-5 w-5" />
        ) : null}
        {children}
      </span>
    </Button>
  );
}
