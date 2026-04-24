import { Card, CardContent } from "@/components/ui/card";
import { VIDEO_CONVERTER_FAQ } from "./video-converter-data";

export function VideoConverterFAQ() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      {VIDEO_CONVERTER_FAQ.map((item) => (
        <Card key={item.question} className="border-border bg-surface">
          <CardContent className="space-y-2 p-6">
            <h3 className="font-medium text-foreground">{item.question}</h3>
            <p className="text-sm text-muted-foreground">{item.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
