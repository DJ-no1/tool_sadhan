"use client";

import { useState, useCallback } from "react";
import { Wrench, AlertCircle, CheckCircle2, XCircle, FileWarning, Shield } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { cn } from "@/lib/utils";

interface PDFFile {
  id: string;
  file: File;
}

interface RepairIssue {
  type: "warning" | "error" | "info";
  title: string;
  description: string;
  canFix: boolean;
}

type RepairLevel = "basic" | "standard" | "aggressive";

export default function RepairPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Repair state
  const [repairLevel, setRepairLevel] = useState<RepairLevel>("standard");
  const [scanComplete, setScanComplete] = useState(false);
  const [issues, setIssues] = useState<RepairIssue[]>([]);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    setScanComplete(false);
    setIssues([]);
  }, []);

  const handleScan = async () => {
    setStatus("processing");
    setProgress(0);

    // Simulate scanning
    const intervals = [20, 40, 60, 80, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(p);
    }

    // Generate mock issues
    setIssues([
      {
        type: "warning",
        title: "Corrupted cross-reference table",
        description: "The PDF's internal reference table has minor inconsistencies",
        canFix: true,
      },
      {
        type: "error",
        title: "Invalid object stream",
        description: "Object stream 247 contains invalid data",
        canFix: true,
      },
      {
        type: "info",
        title: "Outdated PDF version",
        description: "PDF is version 1.4, can be upgraded to 1.7",
        canFix: true,
      },
      {
        type: "warning",
        title: "Missing font subset",
        description: "Font 'Arial-Bold' is not fully embedded",
        canFix: true,
      },
    ]);

    setScanComplete(true);
    setStatus("idle");
    setProgress(0);
  };

  const handleRepair = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [15, 30, 50, 70, 85, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", "_repaired.pdf"),
      size: files[0].file.size,
    });

    setStatus("completed");
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setScanComplete(false);
    setIssues([]);
  };

  const handleDownload = () => {
    console.log("Downloading repaired PDF");
  };

  const repairLevels: { id: RepairLevel; name: string; desc: string; features: string[] }[] = [
    {
      id: "basic",
      name: "Basic Repair",
      desc: "Fix common issues",
      features: ["Fix cross-references", "Repair streams", "Update version"],
    },
    {
      id: "standard",
      name: "Standard Repair",
      desc: "Recommended for most PDFs",
      features: ["All Basic repairs", "Rebuild fonts", "Fix annotations", "Repair images"],
    },
    {
      id: "aggressive",
      name: "Deep Repair",
      desc: "Maximum recovery",
      features: ["All Standard repairs", "Reconstruct pages", "Extract content", "Rebuild from scratch"],
    },
  ];

  const getIssueIcon = (type: RepairIssue["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileWarning className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <PDFToolLayout
      title="Repair PDF"
      description="Fix corrupted or damaged PDF files. Recover content from broken documents."
      icon={Wrench}
      features={["Fix corruption", "Recover content", "Rebuild structure"]}
    >
      <div className="space-y-6">
        {status === "idle" && !resultFile && (
          <>
            <PDFDropzone
              multiple={false}
              maxSize={100}
              onFilesChange={handleFilesChange}
            />

            {files.length > 0 && !scanComplete && (
              <ActionButton
                icon={Shield}
                onClick={handleScan}
                className="w-full"
              >
                Scan for Issues
              </ActionButton>
            )}

            {files.length > 0 && scanComplete && (
              <>
                {/* Scan Results */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Scan Complete</h3>
                      <p className="text-sm text-zinc-400">
                        Found {issues.length} issue{issues.length !== 1 ? "s" : ""} that can be repaired
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {issues.map((issue, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-xl border flex items-start gap-3",
                          issue.type === "error"
                            ? "border-red-500/30 bg-red-500/5"
                            : issue.type === "warning"
                            ? "border-yellow-500/30 bg-yellow-500/5"
                            : "border-blue-500/30 bg-blue-500/5"
                        )}
                      >
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <p className="font-medium">{issue.title}</p>
                          <p className="text-sm text-zinc-400">{issue.description}</p>
                        </div>
                        {issue.canFix && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 font-medium">
                            Fixable
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Repair Level */}
                <OptionsPanel>
                  <OptionGroup title="Repair Level">
                    <div className="space-y-3">
                      {repairLevels.map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => setRepairLevel(level.id)}
                          className={cn(
                            "w-full p-4 rounded-xl border text-left transition-all",
                            repairLevel === level.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{level.name}</p>
                            {level.id === "standard" && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-500">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 mb-3">{level.desc}</p>
                          <div className="flex flex-wrap gap-2">
                            {level.features.map((feature) => (
                              <span
                                key={feature}
                                className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>
                </OptionsPanel>

                <ActionButton
                  icon={Wrench}
                  onClick={handleRepair}
                  className="w-full"
                >
                  Repair PDF
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={
            status === "processing"
              ? scanComplete
                ? "Repairing PDF..."
                : "Scanning for issues..."
              : undefined
          }
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />

        {/* Success info */}
        {status === "completed" && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-semibold text-green-500">Repair Successful</p>
                <p className="text-sm text-zinc-400">
                  All {issues.length} issues have been fixed. Your PDF is now healthy!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PDFToolLayout>
  );
}
