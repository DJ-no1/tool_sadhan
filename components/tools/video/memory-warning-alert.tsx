"use client";

import { AlertTriangle, X, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface MemoryWarningAlertProps {
  risk: "low" | "medium" | "high" | "critical";
  message: string;
  estimatedMB: number;
  onDismiss?: () => void;
}

export function MemoryWarningAlert({
  risk,
  message,
  estimatedMB,
  onDismiss,
}: MemoryWarningAlertProps) {
  if (risk === "low" || !message) {
    return null;
  }

  const variants: Record<string, { variant: "default" | "destructive"; icon: typeof AlertTriangle }> = {
    medium: { variant: "default", icon: Info },
    high: { variant: "default", icon: AlertTriangle },
    critical: { variant: "destructive", icon: AlertTriangle },
  };

  const { variant, icon: Icon } = variants[risk] || variants.medium;

  return (
    <Alert variant={variant} className="relative">
      <Icon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        Memory Warning
        <span className="text-xs font-normal opacity-70">
          (~{estimatedMB}MB estimated)
        </span>
      </AlertTitle>
      <AlertDescription className="pr-8">{message}</AlertDescription>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      )}
    </Alert>
  );
}
