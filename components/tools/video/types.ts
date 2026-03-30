import type { LucideIcon } from "lucide-react";

export type ExtractionMode = "interval" | "max-fps";

export type OutputFormat = "png" | "jpg" | "webp";

export interface ExtractedFrame {
    id: string;
    url: string;
    timestamp: number;
    filename: string;
    blob: Blob;
}

export interface VideoToJpgConverterProps {
    maxFileSize?: number;
    acceptedFormats?: string[];
}

export interface VideoInfo {
    duration: number;
    width: number;
    height: number;
    frameRate: number | null;
}

export interface OutputFormatOption {
    id: OutputFormat;
    label: string;
    description: string;
    mimeType: "image/png" | "image/jpeg" | "image/webp";
    extension: "png" | "jpg" | "webp";
    quality?: number;
}

export interface VideoConverterFeature {
    icon: LucideIcon;
    title: string;
    description: string;
}

export interface VideoConverterFaqItem {
    question: string;
    answer: string;
}

export interface VideoConverterStep {
    title: string;
    description: string;
}
