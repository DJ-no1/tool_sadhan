# Tool Library - Project Documentation

## Overview

A modular tool library website built with Next.js 14+, shadcn/ui, and Tailwind CSS. Features a sleek dark professional theme inspired by Vercel/GitHub design.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Project Structure

```
tool_sadhan/
├── app/
│   ├── layout.tsx           # Root layout with Header/Footer
│   ├── page.tsx             # Homepage with tool categories
│   ├── globals.css          # Dark theme styles
│   └── tools/               # Tool pages
│       ├── pdf/
│       │   ├── page.tsx     # PDF tools overview
│       │   ├── merge/
│       │   ├── compress/
│       │   ├── split/
│       │   └── convert/
│       ├── image/
│       │   ├── page.tsx     # Image tools overview
│       │   ├── compress/
│       │   ├── resize/
│       │   └── convert/
│       └── video/
│           ├── page.tsx     # Video tools overview
│           ├── compress/
│           └── convert/
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/
│   │   ├── header.tsx       # Top navigation
│   │   └── footer.tsx
│   └── shared/
│       ├── tool-card.tsx    # Reusable tool card
│       ├── category-section.tsx
│       └── file-dropzone.tsx # File upload component
├── lib/
│   ├── utils.ts             # Utility functions (cn)
│   └── constants.ts         # Tool metadata & categories
├── types/
│   └── index.ts             # TypeScript interfaces
└── docs/
    ├── README.md            # This file
    └── SHADCN-SETUP.md      # shadcn components guide

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Set up folder structure (if needed)
node create-structure.js

# Install shadcn components
pnpm dlx shadcn@latest add button card badge input label progress separator tabs dialog dropdown-menu select slider toast alert
```

### Development

```bash
pnpm dev
```

Visit http://localhost:3000

### Build

```bash
pnpm build
pnpm start
```

## Design System

### Colors

- **Background**: zinc-950 (nearly black)
- **Cards**: zinc-900/50 with zinc-800 borders
- **Text**: zinc-50 (primary), zinc-400 (secondary)
- **Accents**: 
  - PDF Tools: red-500
  - Image Tools: blue-500
  - Video Tools: purple-500

### Components

#### ToolCard
Displays individual tools with icon, name, description, and link.

```tsx
<ToolCard
  id="pdf-merge"
  name="Merge PDF"
  description="Combine multiple PDF files"
  href="/tools/pdf/merge"
  icon={FileText}
  color="text-red-500"
/>
```

#### CategorySection
Groups tools by category with header and grid layout.

```tsx
<CategorySection
  title="PDF Tools"
  description="Work with PDF files"
  icon={FileText}
  tools={pdfTools}
  color="text-red-500"
/>
```

#### FileDropzone
Drag & drop file upload with file preview.

```tsx
<FileDropzone
  accept=".pdf"
  multiple={true}
  maxSize={10}
  onFilesSelected={(files) => console.log(files)}
/>
```

## Adding New Tools

### 1. Add Tool to Constants

```typescript
// lib/constants.ts
{
  id: "pdf-rotate",
  name: "Rotate PDF",
  description: "Rotate PDF pages",
  href: "/tools/pdf/rotate",
  icon: RotateCw,
  category: "pdf",
}
```

### 2. Create Tool Page

```bash
mkdir app/tools/pdf/rotate
```

Create `app/tools/pdf/rotate/page.tsx`:

```tsx
import { FileDropzone } from "@/components/shared/file-dropzone";

export default function RotatePDFPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Your tool UI */}
      <FileDropzone accept=".pdf" />
    </div>
  );
}
```

### 3. Add Tool Logic

Create processing logic in `lib/tools/pdf/rotate.ts`

## Tool Categories

### PDF Tools
- Merge PDF
- Compress PDF
- Split PDF
- Convert PDF

### Image Tools
- Compress Image
- Resize Image
- Convert Image

### Video Tools
- Compress Video
- Convert Video

## Roadmap

- [ ] Client-side file processing
- [ ] Progress indicators
- [ ] Download functionality
- [ ] More tool categories (Document, AI, Developer)
- [ ] Search functionality
- [ ] Tool favorites
- [ ] Dark/Light theme toggle

## Contributing

1. Follow the established folder structure
2. Use TypeScript with proper types
3. Keep components small and focused
4. Document new features in `/docs`
5. Use pnpm for package management

## License

MIT
