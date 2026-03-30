import { FileText, Image, Video, LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    description: "Merge, split, compress and convert PDF files",
    icon: FileText,
    color: "text-red-500",
    gradient: "from-red-500/20 to-pink-500/20",
  },
  {
    id: "image",
    name: "Image Tools",
    description: "Compress, resize, and convert images",
    icon: Image,
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "video",
    name: "Video Tools",
    description: "Convert and compress video files",
    icon: Video,
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-violet-500/20",
  },
];

export const TOOLS: Tool[] = [
  // PDF Tools
  {
    id: "pdf-merge",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one",
    href: "/tools/pdf/merge",
    icon: FileText,
    category: "pdf",
  },
  {
    id: "pdf-compress",
    name: "Compress PDF",
    description: "Reduce PDF file size",
    href: "/tools/pdf/compress",
    icon: FileText,
    category: "pdf",
  },
  {
    id: "pdf-split",
    name: "Split PDF",
    description: "Extract pages from PDF",
    href: "/tools/pdf/split",
    icon: FileText,
    category: "pdf",
  },
  {
    id: "pdf-convert",
    name: "Convert PDF",
    description: "Convert PDF to other formats",
    href: "/tools/pdf/convert",
    icon: FileText,
    category: "pdf",
  },
  // Image Tools
  {
    id: "image-compress",
    name: "Compress Image",
    description: "Reduce image file size",
    href: "/tools/image/compress",
    icon: Image,
    category: "image",
  },
  {
    id: "image-resize",
    name: "Resize Image",
    description: "Change image dimensions",
    href: "/tools/image/resize",
    icon: Image,
    category: "image",
  },
  {
    id: "image-convert",
    name: "Convert Image",
    description: "Convert between image formats",
    href: "/tools/image/convert",
    icon: Image,
    category: "image",
  },
  // Video Tools
  {
    id: "video-compress",
    name: "Compress Video",
    description: "Reduce video file size",
    href: "/tools/video/compress",
    icon: Video,
    category: "video",
  },
  {
    id: "video-convert",
    name: "Convert Video",
    description: "Convert between video formats",
    href: "/tools/video/convert",
    icon: Video,
    category: "video",
  },
];

export const getToolsByCategory = (categoryId: string) => {
  return TOOLS.filter((tool) => tool.category === categoryId);
};
