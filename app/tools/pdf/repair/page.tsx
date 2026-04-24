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
import { diagnosePdf, repairPdf, type RepairIssue } from "@/lib/tools/pdf";

interface PDFFile {
  id: string;
  file: File;
}

type RepairLevel = "basic" | "standard" | "aggressive";

export default function RepairPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
    blob?: Blob;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
  }, []);

  const handleScan = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setErrorMessage(null);

    try {
      const diagnosis = await diagnosePdf(files[0].file, (p) => setProgress(p));
      setIssues(diagnosis.issues);
      setScanComplete(true);
      setStatus("idle");
      setProgress(0);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to scan PDF.",
      );
      setStatus("error");
    }
  };

  const handleRepair = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setErrorMessage(null);

    try {
      const result = await repairPdf(files[0].file, (p) => setProgress(p));
      setResultFile(result);
      setStatus("completed");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to repair PDF.",
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setScanComplete(false);
    setIssues([]);
    setErrorMessage(null);
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
                <div className="rounded-lg border border-border bg-surface p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Scan Complete</h3>
                      <p className="text-sm text-muted-foreground">
                        Found {issues.length} issue{issues.length !== 1 ? "s" : ""} that can be repaired
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {issues.map((issue, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-lg border flex items-start gap-3",
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
                          <p className="text-sm text-muted-foreground">{issue.description}</p>
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
                            "w-full p-4 rounded-lg border text-left transition-all",
                            repairLevel === level.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
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
                          <p className="text-sm text-muted-foreground mb-3">{level.desc}</p>
                          <div className="flex flex-wrap gap-2">
                            {level.features.map((feature) => (
                              <span
                                key={feature}
                                className="text-xs px-2 py-1 rounded-full bg-surface-2 text-muted-foreground"
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
              : status === "error"
                ? (errorMessage ?? undefined)
                : undefined
          }
          resultFile={resultFile || undefined}
          sourceFile={files[0]?.file ?? null}
          onReset={handleReset}
        />

        {/* Success info */}
        {status === "completed" && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-semibold text-green-500">Repair Successful</p>
                <p className="text-sm text-muted-foreground">
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
