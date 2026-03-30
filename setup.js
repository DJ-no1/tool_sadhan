const fs = require('fs');
const path = require('path');

console.log('\n🏗️  Creating Complete Tool Component Structure...\n');

// Define the structure
const toolCategories = {
  pdf: {
    tools: ['merge', 'compress', 'split', 'convert'],
    color: 'red',
    icon: 'FileText'
  },
  image: {
    tools: ['compress', 'resize', 'convert'],
    color: 'blue',
    icon: 'Image'
  },
  video: {
    tools: ['compress', 'convert'],
    color: 'purple',
    icon: 'Video'
  }
};

// Create directories
Object.keys(toolCategories).forEach(category => {
  const categoryDir = path.join(__dirname, 'components', 'tools', category);
  fs.mkdirSync(categoryDir, { recursive: true });
  console.log(`✅ Created: components/tools/${category}/`);
});

console.log('\n📦 Creating Shared Components...\n');

// ==================== SHARED COMPONENTS ====================

// File Upload Component
const fileUploadComponent = `"use client";

import { Upload } from "lucide-react";
import { useCallback } from "react";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  accept: string;
  maxSize?: number;
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function FileUpload({
  accept,
  maxSize = 50 * 1024 * 1024, // 50MB default
  multiple = false,
  onFileSelect,
  title = "Click to upload files",
  description = "Drag and drop or click to browse",
  icon
}: FileUploadProps) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFileSelect(files);
      }
    },
    [onFileSelect]
  );

  return (
    <Card className="border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-12">
      <label className="flex cursor-pointer flex-col items-center gap-4">
        <div className="rounded-full bg-zinc-800/50 p-6">
          {icon || <Upload className="h-12 w-12 text-zinc-400" />}
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">{title}</p>
          <p className="text-sm text-zinc-400">{description}</p>
          {maxSize && (
            <p className="mt-1 text-xs text-zinc-500">
              Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
      </label>
    </Card>
  );
}
`;

// File List Component
const fileListComponent = `"use client";

import { X, FileIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileItemProps {
  file: File;
  onRemove: () => void;
  icon?: React.ReactNode;
}

export function FileItem({ file, onRemove, icon }: FileItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-700/50">
          {icon || <FileIcon className="h-5 w-5 text-zinc-400" />}
        </div>
        <div>
          <p className="font-medium text-sm">{file.name}</p>
          <p className="text-xs text-zinc-400">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  icon?: React.ReactNode;
}

export function FileList({ files, onRemove, icon }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <Card className="bg-zinc-900/50 p-6">
      <h3 className="mb-4 text-lg font-medium">
        Selected Files ({files.length})
      </h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <FileItem
            key={index}
            file={file}
            onRemove={() => onRemove(index)}
            icon={icon}
          />
        ))}
      </div>
    </Card>
  );
}
`;

// Processing State Component
const processingStateComponent = `"use client";

import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProcessingStateProps {
  state: "idle" | "processing" | "success" | "error";
  progress?: number;
  message?: string;
  errorMessage?: string;
}

export function ProcessingState({
  state,
  progress = 0,
  message = "Processing...",
  errorMessage
}: ProcessingStateProps) {
  if (state === "idle") return null;

  return (
    <Card className="bg-zinc-900/50 p-6">
      <div className="flex items-center gap-4">
        {state === "processing" && (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <div className="flex-1">
              <p className="font-medium">{message}</p>
              {progress > 0 && (
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: \`\${progress}%\` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{Math.round(progress)}%</p>
                </div>
              )}
            </div>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium text-green-500">Success!</p>
              <p className="text-sm text-zinc-400">{message}</p>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="h-6 w-6 text-red-500" />
            <div>
              <p className="font-medium text-red-500">Error</p>
              <p className="text-sm text-zinc-400">{errorMessage || "Something went wrong"}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
`;

// Tool Features Component Template
const createFeaturesComponent = (category, color) => `import { Shield, Zap, Download, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "100% Private",
    description: "All processing happens in your browser. Your files never leave your device.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Optimized algorithms for quick and efficient file processing.",
  },
  {
    icon: Download,
    title: "Easy Download",
    description: "Download your processed files instantly with a single click.",
  },
  {
    icon: Globe,
    title: "No Registration",
    description: "Free to use, no signup required. Start processing immediately.",
  },
];

export function ${category.charAt(0).toUpperCase() + category.slice(1)}ToolFeatures() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {features.map((feature, index) => (
        <Card key={index} className="bg-zinc-900/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-${color}-500/10">
            <feature.icon className="h-6 w-6 text-${color}-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
          <p className="text-sm text-zinc-400">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
}
`;

// Write shared components
const sharedDir = path.join(__dirname, 'components', 'tools', 'shared');
fs.mkdirSync(sharedDir, { recursive: true });

fs.writeFileSync(path.join(sharedDir, 'file-upload.tsx'), fileUploadComponent);
console.log('✅ Created: components/tools/shared/file-upload.tsx');

fs.writeFileSync(path.join(sharedDir, 'file-list.tsx'), fileListComponent);
console.log('✅ Created: components/tools/shared/file-list.tsx');

fs.writeFileSync(path.join(sharedDir, 'processing-state.tsx'), processingStateComponent);
console.log('✅ Created: components/tools/shared/processing-state.tsx');

// Create index for shared
const sharedIndex = `export { FileUpload } from "./file-upload";
export { FileList, FileItem } from "./file-list";
export { ProcessingState } from "./processing-state";
`;
fs.writeFileSync(path.join(sharedDir, 'index.ts'), sharedIndex);
console.log('✅ Created: components/tools/shared/index.ts');

// ==================== CATEGORY-SPECIFIC COMPONENTS ====================

console.log('\n📦 Creating Category Components...\n');

Object.entries(toolCategories).forEach(([category, config]) => {
  const categoryDir = path.join(__dirname, 'components', 'tools', category);
  
  // Create features component
  const featuresContent = createFeaturesComponent(category, config.color);
  fs.writeFileSync(path.join(categoryDir, `${category}-tool-features.tsx`), featuresContent);
  console.log(`✅ Created: components/tools/${category}/${category}-tool-features.tsx`);
  
  // Create index file
  const indexContent = `export { ${category.charAt(0).toUpperCase() + category.slice(1)}ToolFeatures } from "./${category}-tool-features";
// Tool-specific exports will be added here
`;
  fs.writeFileSync(path.join(categoryDir, 'index.ts'), indexContent);
  console.log(`✅ Created: components/tools/${category}/index.ts`);
});

console.log('\n✅ Component structure created successfully!\n');
console.log('📂 Structure:');
console.log('components/tools/');
console.log('├── shared/           # Reusable components');
console.log('│   ├── file-upload.tsx');
console.log('│   ├── file-list.tsx');
console.log('│   ├── processing-state.tsx');
console.log('│   └── index.ts');
console.log('├── pdf/              # PDF tool components');
console.log('│   ├── pdf-tool-features.tsx');
console.log('│   └── index.ts');
console.log('├── image/            # Image tool components');
console.log('│   ├── image-tool-features.tsx');
console.log('│   └── index.ts');
console.log('└── video/            # Video tool components');
console.log('    ├── video-to-jpg-converter.tsx');
console.log('    ├── video-converter-features.tsx');
console.log('    ├── video-converter-faq.tsx');
console.log('    └── index.ts');
console.log('\n🎉 Ready to build amazing tools!');
