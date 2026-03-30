import { VIDEO_CONVERTER_STEPS } from "./video-converter-data";

export function VideoConverterHowItWorks() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">How to Convert Video to JPG</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {VIDEO_CONVERTER_STEPS.map((step, index) => (
          <div key={step.title} className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-sm font-bold text-purple-400">
              {index + 1}
            </div>
            <h3 className="text-lg font-medium">{step.title}</h3>
            <p className="text-sm text-zinc-400">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
