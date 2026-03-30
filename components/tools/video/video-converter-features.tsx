import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VIDEO_CONVERTER_FEATURES } from "./video-converter-data";

export function VideoConverterFeatures() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {VIDEO_CONVERTER_FEATURES.map((feature) => {
        const Icon = feature.icon;

        return (
          <Card key={feature.title} className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">{feature.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
