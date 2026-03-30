# Video to JPG Converter - Quick Start

## Installation

Run ONE of these commands in your project root:

### Windows (Double-click):
```
install-video-tool.bat
```

### Command Line:
```bash
node install-video-tool.js
```

That's it! The script will create all necessary files.

## What You Get

### 📁 File Structure
```
components/tools/video/
├── video-to-jpg-converter.tsx    # Main converter component
├── video-converter-features.tsx   # Features grid
├── video-converter-faq.tsx        # FAQ section
└── index.ts                       # Clean exports

app/tools/video/convert/
└── page.tsx                       # Full page implementation
```

### 🎯 Features
- ✅ Extract video frames as JPG images
- ✅ Adjustable frame interval (0.1-10s)
- ✅ Quality control (10%-100%)
- ✅ Batch download all frames
- ✅ 100% private (browser-only processing)
- ✅ Supports MP4, WebM, MOV, OGG
- ✅ Up to 500MB file size

### 🚀 Usage After Installation

1. Start dev server:
```bash
npm run dev
```

2. Visit:
```
http://localhost:3000/tools/video/convert
```

3. Or import components anywhere:
```tsx
import { VideoToJpgConverter } from "@/components/tools/video";

<VideoToJpgConverter />
```

## Component API

```tsx
<VideoToJpgConverter
  maxFileSize={500 * 1024 * 1024}  // 500MB default
  acceptedFormats={[               // Supported formats
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime"
  ]}
/>
```

## Technology Stack
- Next.js 16 (App Router)
- TypeScript
- React 19
- Tailwind CSS
- HTML5 Canvas API
- Lucide React Icons

## Key Benefits
- **Modular**: Each component is independent and reusable
- **Type-safe**: Full TypeScript support
- **Private**: No server uploads, all processing in browser
- **Fast**: Optimized frame extraction
- **Accessible**: Follows WCAG guidelines
- **Responsive**: Works on all screen sizes

Need help? Check VIDEO-TOOL-README.md for detailed documentation.
