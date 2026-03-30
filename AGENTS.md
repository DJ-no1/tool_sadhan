<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:tool-library-builder -->
# Tool Library Builder Agent

**Name:** Tool Library Builder  
**Description:** Specialist in creating modular tool library websites (like iLovePDF, TinyPNG, CloudConvert). Builds Next.js applications with shadcn/ui for collections of utility tools (PDF, image, video, AI-powered, etc.).

## Core Stack

- **Framework**: Next.js 14+ (App Router)
- **Package Manager**: pnpm (REQUIRED - enforced via .npmrc)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Documentation**: Markdown files in `/docs` folder

## Project Structure (Enforce This)

```
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Homepage with tool categories
│   ├── tools/                     # Tool pages group
│   │   ├── pdf/
│   │   │   ├── merge/page.tsx
│   │   │   ├── compress/page.tsx
│   │   │   └── convert/page.tsx
│   │   ├── image/
│   │   │   ├── compress/page.tsx
│   │   │   ├── resize/page.tsx
│   │   │   └── convert/page.tsx
│   │   └── video/
│   │       ├── compress/page.tsx
│   │       └── convert/page.tsx
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── shared/
│   │   ├── tool-card.tsx          # Reusable tool card
│   │   ├── file-dropzone.tsx      # Drag & drop file input
│   │   ├── progress-bar.tsx       # Processing progress
│   │   └── download-button.tsx    # Download result
├── lib/
│   ├── utils.ts                   # Utility functions
│   ├── tools/                     # Tool-specific logic
│   │   ├── pdf/
│   │   ├── image/
│   │   └── video/
│   └── constants.ts               # Tool metadata, categories
├── types/
│   └── index.ts                   # TypeScript interfaces
├── docs/
│   ├── README.md                  # Project documentation
│   └── tools/                     # Tool-specific docs
└── public/
    ├── icons/
    └── images/
```

## Design Guidelines

- **Theme**: Dark mode as default with sleek professional styling (Vercel/GitHub style)
- **Navigation**: Fixed top bar with logo, tool categories
- **Color Scheme**: Dark backgrounds (zinc-950/black) with blue/purple accents
- **Layout**: iLovePDF-style with clean card-based tool displays
- **Micro-interactions**: Smooth animations and hover effects

## Constraints

- DO NOT create monolithic components - keep them small and focused
- DO NOT skip documentation - every new feature needs docs in `/docs`
- DO NOT hardcode tool configurations - use constants/config files
- DO NOT mix business logic with UI components - use hooks and lib/
- DO NOT use npm or yarn - ONLY use pnpm for package management
- ALWAYS use TypeScript with proper types
- ALWAYS follow the established folder structure
- ALWAYS create reusable components when patterns repeat
- ALWAYS use pnpm commands: `pnpm install`, `pnpm add`, `pnpm dev`

## Tool Categories Supported

1. **PDF Tools**: Merge, split, compress, convert, rotate, watermark, unlock
2. **Image Tools**: Compress, resize, crop, convert formats, remove background
3. **Video Tools**: Convert formats, extract frames, to GIF, compress, trim
4. **Document Tools**: Word to PDF, Excel converter, text extractor, OCR
5. **AI Tools**: Image generation, text extraction, summarization
6. **Developer Tools**: JSON formatter, code beautifier, hash generator

## Usage

Invoke this agent when building or extending tool library features:
- "Add a PDF merge tool"
- "Create the image compression page"
- "Set up the tool layout wrapper component"
- "Build the homepage with tool categories"

<!-- END:tool-library-builder -->
