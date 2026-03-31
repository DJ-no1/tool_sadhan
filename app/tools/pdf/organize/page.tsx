"use client";

import { useState, useCallback } from "react";
import { Layers, GripVertical, Trash2, Eye, EyeOff, FileText, Plus } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Button } from "@/components/ui/button";

interface PDFFile {
  id: string;
  file: File;
}

interface PDFPage {
  id: string;
  pageNum: number;
  rotation: number;
  visible: boolean;
}

export default function OrganizePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Simulated pages
  const [pages, setPages] = useState<PDFPage[]>([]);
  const totalPages = 12;

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    
    // Simulate page detection
    if (newFiles.length > 0) {
      setPages(
        Array.from({ length: totalPages }, (_, i) => ({
          id: `page-${i + 1}`,
          pageNum: i + 1,
          rotation: 0,
          visible: true,
        }))
      );
    }
  }, []);

  const movePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length) return;
    const newPages = [...pages];
    const [movedPage] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedPage);
    setPages(newPages);
  };

  const togglePageVisibility = (id: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
  };

  const rotatePage = (id: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const deletePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
  };

  const handleOrganize = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [20, 45, 70, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", "_organized.pdf"),
      size: files[0].file.size * (pages.filter(p => p.visible).length / totalPages),
    });

    setStatus("completed");
  };

  const handleReset = () => {
    setFiles([]);
    setPages([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
  };

  const handleDownload = () => {
    console.log("Downloading organized PDF");
  };

  const visiblePages = pages.filter(p => p.visible);

  return (
    <PDFToolLayout
      title="Organize PDF"
      description="Reorder, rotate, and remove pages from your PDF. Drag and drop to rearrange pages."
      icon={Layers}
      features={["Drag to reorder", "Rotate pages", "Delete pages"]}
    >
      <div className="space-y-6">
        {status === "idle" && (
          <>
            <PDFDropzone
              multiple={false}
              maxSize={100}
              onFilesChange={handleFilesChange}
            />

            {files.length > 0 && pages.length > 0 && (
              <>
                {/* Page Grid */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Pages ({visiblePages.length} of {pages.length})</h3>
                    <span className="text-sm text-zinc-400">
                      Drag to reorder • Click icons to edit
                    </span>
                  </div>

                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {pages.map((page, index) => (
                      <div
                        key={page.id}
                        className={`group relative rounded-xl border transition-all ${
                          page.visible 
                            ? "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600" 
                            : "border-zinc-800 bg-zinc-900/50 opacity-50"
                        }`}
                      >
                        {/* Page Preview */}
                        <div 
                          className="aspect-[3/4] rounded-t-xl bg-white/5 flex items-center justify-center relative overflow-hidden cursor-grab"
                        >
                          <div
                            className="flex items-center justify-center"
                            style={{ transform: `rotate(${page.rotation}deg)` }}
                          >
                            <FileText className="h-8 w-8 text-zinc-500" />
                          </div>
                          
                          {/* Drag handle overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-6 w-6 text-white" />
                          </div>

                          {/* Page number badge */}
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-zinc-900/80 text-xs font-medium">
                            {page.pageNum}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2 flex items-center justify-between gap-1">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={index === 0}
                              onClick={() => movePage(index, index - 1)}
                              className="h-6 w-6 text-zinc-400 hover:text-white disabled:opacity-30"
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={index === pages.length - 1}
                              onClick={() => movePage(index, index + 1)}
                              className="h-6 w-6 text-zinc-400 hover:text-white disabled:opacity-30"
                            >
                              ↓
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => rotatePage(page.id)}
                              className="h-6 w-6 text-zinc-400 hover:text-white"
                              title="Rotate"
                            >
                              ↻
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePageVisibility(page.id)}
                              className={`h-6 w-6 ${page.visible ? "text-zinc-400 hover:text-white" : "text-red-500"}`}
                              title={page.visible ? "Hide" : "Show"}
                            >
                              {page.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deletePage(page.id)}
                              className="h-6 w-6 text-zinc-400 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">
                      {pages.filter(p => p.rotation !== 0).length} rotated • {pages.filter(p => !p.visible).length} hidden
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPages(pages.map(p => ({ ...p, visible: true, rotation: 0 })))}
                      className="text-zinc-400 hover:text-white"
                    >
                      Reset all
                    </Button>
                  </div>
                </div>

                <ActionButton
                  icon={Layers}
                  onClick={handleOrganize}
                  className="w-full"
                >
                  Save Changes ({visiblePages.length} pages)
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Organizing your PDF..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
