"use client";

import { ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit";
}

export function ActionButton({
  onClick,
  disabled,
  loading,
  icon: Icon,
  children,
  variant = "primary",
  className,
  type = "button",
}: ActionButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      size="lg"
      variant={variant === "primary" ? "default" : "outline"}
      className={cn(
        "h-11 w-full gap-2 text-[14px] font-medium",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      {children}
    </Button>
  );
}
