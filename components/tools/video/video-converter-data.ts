import { Download, Eye, Shield, Zap } from "lucide-react";
import type { VideoConverterFaqItem, VideoConverterFeature, VideoConverterStep } from "./types";

export const VIDEO_CONVERTER_FEATURES: VideoConverterFeature[] = [
    {
        icon: Shield,
        title: "Private by Design",
        description: "Video processing happens entirely in your browser. Files never leave your device.",
    },
    {
        icon: Zap,
        title: "Fast Frame Extraction",
        description: "Capture frames at custom intervals with live progress updates.",
    },
    {
        icon: Eye,
        title: "Quality Control",
        description: "Choose output format buttons like PNG, JPG, or WEBP before extraction.",
    },
    {
        icon: Download,
        title: "Quick Downloads",
        description: "Download a single frame instantly or save all extracted frames in one flow.",
    },
];

export const VIDEO_CONVERTER_STEPS: VideoConverterStep[] = [
    {
        title: "Upload Video",
        description: "Drop an MP4, WebM, MOV, or OGG file up to 500MB.",
    },
    {
        title: "Tune Settings",
        description: "Pick frame mode and output format, then start extraction.",
    },
    {
        title: "Download Frames",
        description: "Preview frames, download one by one, or download all in sequence.",
    },
];

export const VIDEO_CONVERTER_FAQ: VideoConverterFaqItem[] = [
    {
        question: "Which video formats are supported?",
        answer: "MP4, WebM, MOV, and OGG are supported by default.",
    },
    {
        question: "Is there a file size limit?",
        answer: "Yes. The default limit is 500MB for smooth browser performance.",
    },
    {
        question: "Are videos uploaded to a server?",
        answer: "No. The entire conversion runs locally using browser APIs.",
    },
    {
        question: "Can I control output quality?",
        answer: "Yes. You can adjust JPEG quality from 10% to 100% before extracting frames.",
    },
    {
        question: "How do I download extracted frames?",
        answer: "Use the download button on individual frames or the Download All button in the results card.",
    },
];
