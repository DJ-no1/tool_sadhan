# Tool Library - Setup Instructions

## Quick Start

Run the setup batch file:
```bash
setup.bat
```

Or manually:

```bash
# Install dependencies
pnpm add class-variance-authority clsx tailwind-merge lucide-react

# Create folders (already done by setup.bat)
```

## Project Structure

```
tool_sadhan/
├── app/
│   ├── tools/
│   │   ├── pdf/        # PDF tools
│   │   ├── image/      # Image tools  
│   │   └── video/      # Video tools
├── components/
│   ├── ui/             # shadcn components
│   ├── layout/         # Header, Footer
│   └── shared/         # Reusable components
├── lib/                # Utilities & constants
├── types/              # TypeScript types
└── docs/               # Documentation
```

## Development

```bash
pnpm dev
```

Visit http://localhost:3000
