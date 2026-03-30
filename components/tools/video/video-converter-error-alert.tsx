import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VideoConverterErrorAlertProps {
  message: string;
}

export function VideoConverterErrorAlert({
  message,
}: VideoConverterErrorAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Unable to process video</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
