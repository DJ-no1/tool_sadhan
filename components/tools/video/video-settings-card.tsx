"use client";

import { Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  onCancel?: () => void;
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
  onCancel,
}: VideoSettingsCardProps) {
  const intervalPresets = [0.5, 1, 2, 5];

  const selectedOutputFormat = outputFormatOptions.find(
    (option) => option.id === outputFormat,
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Extraction Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Frame Selection Mode */}
        <div className="space-y-2">
          <Label className="text-sm">Frame Selection</Label>
          <Tabs
            value={extractionMode}
            onValueChange={(value) =>
              onExtractionModeChange(value as ExtractionMode)
            }
          >
            <TabsList className="grid h-9 w-full grid-cols-2">
              <TabsTrigger value="interval" className="text-sm">
                Custom Interval
              </TabsTrigger>
              <TabsTrigger
                value="max-fps"
                disabled={!maxFrameRate}
                className="text-sm"
              >
                Max FPS
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            {maxFrameRate
              ? `Detected: ${maxFrameRate.toFixed(1)} FPS`
              : "Detecting frame rate..."}
          </p>
        </div>

        {/* Interval Controls */}
        {extractionMode === "interval" ? (
          <div className="space-y-2">
            <Label className="text-sm">Interval (fps)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0.1}
                max={10}
                step={0.1}
                value={frameInterval}
                onChange={(event) =>
                  onFrameIntervalChange(Number(event.target.value))
                }
                className="h-9 w-24"
              />
              <div className="flex gap-1">
                {intervalPresets.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={frameInterval === preset ? "default" : "outline"}
                    size="sm"
                    className="h-9 px-3"
                    onClick={() => onFrameIntervalChange(preset)}
                  >
                    {preset}s
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            Extracting at detected frame rate (max 60 FPS)
          </div>
        )}

        {/* Time Range */}
        <div className="space-y-2">
          <Label className="text-sm">Time Range</Label>
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <span className="text-xs text-muted-foreground">Start</span>
              <Input
                type="number"
                min={0}
                step={0.1}
                value={startTime}
                onChange={(event) =>
                  onStartTimeChange(Number(event.target.value))
                }
                className="h-9"
              />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs text-muted-foreground">End</span>
              <Input
                type="number"
                min={0.1}
                step={0.1}
                value={endTime}
                onChange={(event) =>
                  onEndTimeChange(Number(event.target.value))
                }
                className="h-9"
              />
            </div>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => onStartTimeChange(0)}
              >
                0s
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => onEndTimeChange(maxDuration ?? endTime)}
              >
                Max
              </Button>
            </div>
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-2">
          <Label className="text-sm">Output Format</Label>
          <div className="flex gap-1">
            {outputFormatOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={outputFormat === option.id ? "default" : "outline"}
                size="sm"
                className="h-9"
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

        {/* Progress */}
        {isExtracting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Extracting...</span>
              <span className="font-medium">
                {Math.round(extractionProgress)}%
              </span>
            </div>
            <Progress value={extractionProgress} className="h-2" />
          </div>
        )}

        {/* Extract / Cancel */}
        <div className="flex gap-2">
          <Button
            onClick={onExtract}
            disabled={isExtracting}
            className="flex-1"
            size="default"
          >
            {isExtracting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Extracting frames
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4" />
                Extract frames
              </>
            )}
          </Button>
          {isExtracting && onCancel && (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
