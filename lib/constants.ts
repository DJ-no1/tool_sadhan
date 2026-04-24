import {
  FileText,
  Image,
  Video,
  Merge,
  Split,
  Minimize2,
  FileOutput,
  RotateCw,
  Scissors,
  Layers,
  FileImage,
  Lock,
  Unlock,
  Stamp,
  Hash,
  PenLine,
  Crop,
  Maximize2,
  ImageDown,
  Palette,
  Eraser,
  Play,
  Film,
  Clapperboard,
  Timer,
  type LucideIcon,
} from "lucide-react";

export type CategoryAccent = "red" | "blue" | "purple";

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: string;
  subcategory?: string;
  comingSoon?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface ToolSubcategory {
  id: string;
  name: string;
  tools: Tool[];
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  accent: CategoryAccent;
  subcategories: ToolSubcategory[];
}

// PDF Tools
const PDF_TOOLS: Tool[] = [
  // Organize PDF
  { id: "pdf-merge", name: "Merge PDF", description: "Combine multiple PDFs into one", href: "/tools/pdf/merge", icon: Merge, category: "pdf", subcategory: "organize", isPopular: true },
  { id: "pdf-split", name: "Split PDF", description: "Extract pages from PDF", href: "/tools/pdf/split", icon: Split, category: "pdf", subcategory: "organize", isPopular: true },
  { id: "pdf-remove", name: "Remove Pages", description: "Delete pages from PDF", href: "/tools/pdf/remove", icon: Scissors, category: "pdf", subcategory: "organize" },
  { id: "pdf-extract", name: "Extract Pages", description: "Extract specific pages", href: "/tools/pdf/extract", icon: FileOutput, category: "pdf", subcategory: "organize" },
  { id: "pdf-organize", name: "Organize PDF", description: "Reorder PDF pages", href: "/tools/pdf/organize", icon: Layers, category: "pdf", subcategory: "organize" },

  // Optimize PDF
  { id: "pdf-compress", name: "Compress PDF", description: "Reduce PDF file size", href: "/tools/pdf/compress", icon: Minimize2, category: "pdf", subcategory: "optimize", isPopular: true },
  { id: "pdf-repair", name: "Repair PDF", description: "Fix corrupted PDFs", href: "/tools/pdf/repair", icon: FileText, category: "pdf", subcategory: "optimize" },

  // Convert to PDF
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Convert images to PDF", href: "/tools/pdf/jpg-to-pdf", icon: FileImage, category: "pdf", subcategory: "convert-to" },
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert Word to PDF", href: "/tools/pdf/word-to-pdf", icon: FileText, category: "pdf", subcategory: "convert-to" },
  { id: "excel-to-pdf", name: "Excel to PDF", description: "Convert Excel to PDF", href: "/tools/pdf/excel-to-pdf", icon: FileText, category: "pdf", subcategory: "convert-to" },
  { id: "ppt-to-pdf", name: "PowerPoint to PDF", description: "Convert PPT to PDF", href: "/tools/pdf/ppt-to-pdf", icon: FileText, category: "pdf", subcategory: "convert-to" },

  // Convert from PDF
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF to images", href: "/tools/pdf/pdf-to-jpg", icon: Image, category: "pdf", subcategory: "convert-from", isPopular: true },
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF to Word", href: "/tools/pdf/pdf-to-word", icon: FileText, category: "pdf", subcategory: "convert-from" },
  { id: "pdf-to-excel", name: "PDF to Excel", description: "Convert PDF to Excel", href: "/tools/pdf/pdf-to-excel", icon: FileText, category: "pdf", subcategory: "convert-from" },
  { id: "pdf-to-ppt", name: "PDF to PowerPoint", description: "Convert PDF to PPT", href: "/tools/pdf/pdf-to-ppt", icon: FileText, category: "pdf", subcategory: "convert-from" },

  // Edit PDF
  { id: "pdf-rotate", name: "Rotate PDF", description: "Rotate PDF pages", href: "/tools/pdf/rotate", icon: RotateCw, category: "pdf", subcategory: "edit" },
  { id: "pdf-crop", name: "Crop PDF", description: "Crop PDF pages", href: "/tools/pdf/crop", icon: Crop, category: "pdf", subcategory: "edit" },
  { id: "pdf-watermark", name: "Add Watermark", description: "Add watermark to PDF", href: "/tools/pdf/watermark", icon: Stamp, category: "pdf", subcategory: "edit" },
  { id: "pdf-page-numbers", name: "Page Numbers", description: "Add page numbers", href: "/tools/pdf/page-numbers", icon: Hash, category: "pdf", subcategory: "edit" },
  { id: "pdf-edit", name: "Edit PDF", description: "Edit PDF content", href: "/tools/pdf/edit", icon: PenLine, category: "pdf", subcategory: "edit" },

  // PDF Security
  { id: "pdf-unlock", name: "Unlock PDF", description: "Remove PDF password", href: "/tools/pdf/unlock", icon: Unlock, category: "pdf", subcategory: "security" },
  { id: "pdf-protect", name: "Protect PDF", description: "Add password to PDF", href: "/tools/pdf/protect", icon: Lock, category: "pdf", subcategory: "security" },
  { id: "pdf-sign", name: "Sign PDF", description: "Add signature to PDF", href: "/tools/pdf/sign", icon: PenLine, category: "pdf", subcategory: "security" },
];

// Image Tools — all pages are shipped; mark fresh arrivals with isNew.
const IMAGE_TOOLS: Tool[] = [
  { id: "image-resize", name: "Resize Image", description: "Change image dimensions", href: "/tools/image/resize", icon: Maximize2, category: "image", subcategory: "resize", isNew: true },
  { id: "image-crop", name: "Crop Image", description: "Crop and trim images", href: "/tools/image/crop", icon: Crop, category: "image", subcategory: "resize", isNew: true },

  { id: "image-compress", name: "Compress Image", description: "Reduce image file size", href: "/tools/image/compress", icon: Minimize2, category: "image", subcategory: "compress", isPopular: true },
  { id: "image-compress-jpg", name: "Compress JPG", description: "Compress JPEG images", href: "/tools/image/compress-jpg", icon: ImageDown, category: "image", subcategory: "compress", isNew: true },
  { id: "image-compress-png", name: "Compress PNG", description: "Compress PNG images", href: "/tools/image/compress-png", icon: ImageDown, category: "image", subcategory: "compress", isNew: true },

  { id: "image-convert", name: "Convert Image", description: "Convert image formats", href: "/tools/image/convert", icon: FileOutput, category: "image", subcategory: "convert", isPopular: true },
  { id: "jpg-to-png", name: "JPG to PNG", description: "Convert JPG to PNG", href: "/tools/image/jpg-to-png", icon: Image, category: "image", subcategory: "convert", isNew: true },
  { id: "png-to-jpg", name: "PNG to JPG", description: "Convert PNG to JPG", href: "/tools/image/png-to-jpg", icon: Image, category: "image", subcategory: "convert", isNew: true },
  { id: "webp-convert", name: "WebP Convert", description: "Convert to/from WebP", href: "/tools/image/webp", icon: Image, category: "image", subcategory: "convert", isNew: true },

  { id: "image-edit", name: "Edit Image", description: "Basic image editing", href: "/tools/image/edit", icon: PenLine, category: "image", subcategory: "edit", isNew: true },
  { id: "image-filters", name: "Image Filters", description: "Apply filters to images", href: "/tools/image/filters", icon: Palette, category: "image", subcategory: "edit", isNew: true },
  { id: "remove-bg", name: "Remove Background", description: "Remove image background", href: "/tools/image/remove-bg", icon: Eraser, category: "image", subcategory: "edit", isPopular: true },
];

// Video Tools — all pages are shipped.
const VIDEO_TOOLS: Tool[] = [
  { id: "video-convert", name: "Video to JPG", description: "Extract frames as images", href: "/tools/video/convert", icon: Image, category: "video", subcategory: "convert", isPopular: true },
  { id: "video-to-gif", name: "Video to GIF", description: "Convert video to GIF", href: "/tools/video/to-gif", icon: Play, category: "video", subcategory: "convert", isNew: true },
  { id: "video-to-mp4", name: "Convert to MP4", description: "Convert video to MP4", href: "/tools/video/to-mp4", icon: Film, category: "video", subcategory: "convert", isNew: true },

  { id: "video-compress", name: "Compress Video", description: "Reduce video file size", href: "/tools/video/compress", icon: Minimize2, category: "video", subcategory: "compress", isPopular: true },

  { id: "video-trim", name: "Trim Video", description: "Cut video segments", href: "/tools/video/trim", icon: Scissors, category: "video", subcategory: "edit", isNew: true },
  { id: "video-merge", name: "Merge Videos", description: "Combine multiple videos", href: "/tools/video/merge", icon: Merge, category: "video", subcategory: "edit", isNew: true },
  { id: "video-rotate", name: "Rotate Video", description: "Rotate video orientation", href: "/tools/video/rotate", icon: RotateCw, category: "video", subcategory: "edit", isNew: true },

  { id: "video-extract-audio", name: "Extract Audio", description: "Extract audio from video", href: "/tools/video/extract-audio", icon: Clapperboard, category: "video", subcategory: "extract", isNew: true },
  { id: "video-extract-frames", name: "Extract Frames", description: "Extract video frames", href: "/tools/video/extract-frames", icon: Timer, category: "video", subcategory: "extract", isNew: true },
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    description: "Merge, split, compress and convert PDF files",
    icon: FileText,
    color: "text-red-500",
    gradient: "from-red-500/20 to-pink-500/20",
    accent: "red",
    subcategories: [
      { id: "organize", name: "Organize PDF", tools: PDF_TOOLS.filter(t => t.subcategory === "organize") },
      { id: "optimize", name: "Optimize PDF", tools: PDF_TOOLS.filter(t => t.subcategory === "optimize") },
      { id: "convert-to", name: "Convert to PDF", tools: PDF_TOOLS.filter(t => t.subcategory === "convert-to") },
      { id: "convert-from", name: "Convert from PDF", tools: PDF_TOOLS.filter(t => t.subcategory === "convert-from") },
      { id: "edit", name: "Edit PDF", tools: PDF_TOOLS.filter(t => t.subcategory === "edit") },
      { id: "security", name: "PDF Security", tools: PDF_TOOLS.filter(t => t.subcategory === "security") },
    ],
  },
  {
    id: "image",
    name: "Image Tools",
    description: "Compress, resize, and convert images",
    icon: Image,
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-cyan-500/20",
    accent: "blue",
    subcategories: [
      { id: "resize", name: "Resize & Crop", tools: IMAGE_TOOLS.filter(t => t.subcategory === "resize") },
      { id: "compress", name: "Compress", tools: IMAGE_TOOLS.filter(t => t.subcategory === "compress") },
      { id: "convert", name: "Convert", tools: IMAGE_TOOLS.filter(t => t.subcategory === "convert") },
      { id: "edit", name: "Edit", tools: IMAGE_TOOLS.filter(t => t.subcategory === "edit") },
    ],
  },
  {
    id: "video",
    name: "Video Tools",
    description: "Convert, compress and edit video files",
    icon: Video,
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-violet-500/20",
    accent: "purple",
    subcategories: [
      { id: "convert", name: "Convert", tools: VIDEO_TOOLS.filter(t => t.subcategory === "convert") },
      { id: "compress", name: "Compress", tools: VIDEO_TOOLS.filter(t => t.subcategory === "compress") },
      { id: "edit", name: "Edit", tools: VIDEO_TOOLS.filter(t => t.subcategory === "edit") },
      { id: "extract", name: "Extract", tools: VIDEO_TOOLS.filter(t => t.subcategory === "extract") },
    ],
  },
];

export const TOOLS: Tool[] = [...PDF_TOOLS, ...IMAGE_TOOLS, ...VIDEO_TOOLS];

export const getToolsByCategory = (categoryId: string) => {
  return TOOLS.filter((tool) => tool.category === categoryId);
};

export const getPopularTools = (limit = 8) => {
  return TOOLS.filter((t) => t.isPopular && !t.comingSoon).slice(0, limit);
};

export const getLiveToolCount = () => {
  return TOOLS.filter((t) => !t.comingSoon).length;
};

export const getTotalToolCount = () => TOOLS.length;
