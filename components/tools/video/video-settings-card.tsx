"use client";

import { Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExtractionMode, OutputFormat, OutputFormatOption } from "./types";

interface VideoSettingsCardProps {
  extractionMode: ExtractionMode;
  frameInterval: number;
  startTime: number;
  endTime: number;
  maxDuration: number | null;
  maxFrameRate: number | null;
  outputFormat: OutputFormat;
  outputFormatOptions: OutputFormatOption[];
  isExtracting: boolean;
  extractionProgress: number;
  onExtractionModeChange: (value: ExtractionMode) => void;
  onFrameIntervalChange: (value: number) => void;
  onStartTimeChange: (value: number) => void;
  onEndTimeChange: (value: number) => void;
  onOutputFormatChange: (value: OutputFormat) => void;
  onExtract: () => void;
}

export function VideoSettingsCard({
  extractionMode,
  frameInterval,
  startTime,
  endTime,
  maxDuration,
  maxFrameRate,
  outputFormat,
  outputFormatOptions,
  isExtracting,
  extractionProgress,
  onExtractionModeChange,
  onFrameIntervalChange,
  onStartTimeChange,
  onEndTimeChange,
  onOutputFormatChange,
  onExtract,
}: VideoSettingsCardProps) {
  const selectedOutputFormat = outputFormatOptions.find(
    (option) => option.id === outputFormat,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extraction Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Frame Selection</Label>
          <Select
            value={extractionMode}
            onValueChange={(value) =>
              onExtractionModeChange(value as ExtractionMode)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose extraction mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interval">Custom Interval</SelectItem>
              <SelectItem value="max-fps" disabled={!maxFrameRate}>
                Max Frame Rate{" "}
                {maxFrameRate
                  ? `(${maxFrameRate.toFixed(2)} FPS cap)`
                  : "(Detecting...)"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {extractionMode === "interval" ? (
          <div className="space-y-2">
            <Label>Frame Interval (seconds)</Label>
            <Input
              type="number"
              min={0.1}
              max={10}
              step={0.1}
              value={frameInterval}
              onChange={(event) =>
                onFrameIntervalChange(Number(event.target.value))
              }
            />
          </div>
        ) : (
          <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
            Extracting at detected frame rate, capped to 60 FPS.
          </div>
        )}

        <div className="space-y-2">
          <Label>Range (seconds)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Start</Label>
              <Input
                type="number"
                min={0}
                step={0.1}
                value={startTime}
                onChange={(event) =>
                  onStartTimeChange(Number(event.target.value))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">End</Label>
              <Input
                type="number"
                min={0.1}
                step={0.1}
                value={endTime}
                onChange={(event) =>
                  onEndTimeChange(Number(event.target.value))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onStartTimeChange(0)}
            >
              Start 0.0s
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEndTimeChange(maxDuration ?? endTime)}
            >
              End {maxDuration ? `${maxDuration.toFixed(1)}s` : "Max"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Convert To</Label>
          <div className="grid grid-cols-3 gap-2">
            {outputFormatOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={outputFormat === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => onOutputFormatChange(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          {selectedOutputFormat && (
            <p className="text-xs text-muted-foreground">
              {selectedOutputFormat.description}
            </p>
          )}
        </div>

        {isExtracting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Extracting frames...</span>
              <span>{Math.round(extractionProgress)}%</span>
            </div>
            <Progress value={extractionProgress} />
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Max extraction rate is 60 FPS.
        </p>

        <Button onClick={onExtract} disabled={isExtracting}>
          {isExtracting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Extracting Frames
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              Extract Frames
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
