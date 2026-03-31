"use client";

import { useState, useCallback } from "react";
import { Unlock, Key, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  PDFToolLayout,
  PDFDropzone,
  ProcessingPanel,
  OptionsPanel,
  OptionGroup,
  ActionButton,
  type ProcessingStatus,
} from "@/components/tools/pdf";
import { Input } from "@/components/ui/input";

interface PDFFile {
  id: string;
  file: File;
}

export default function UnlockPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  const [password, setPassword] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
    // Simulate detection
    setIsPasswordProtected(true);
  }, []);

  const handleUnlock = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [30, 60, 90, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", "_unlocked.pdf"),
      size: files[0].file.size * 0.99,
    });

    setStatus("completed");
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setPassword("");
  };

  const handleDownload = () => {
    console.log("Downloading unlocked PDF");
  };

  return (
    <PDFToolLayout
      title="Unlock PDF"
      description="Remove password protection from your PDF files. You need to know the password to unlock."
      icon={Unlock}
      features={["Remove passwords", "Keep formatting", "Instant unlock"]}
    >
      <div className="space-y-6">
        {status === "idle" && (
          <>
            <PDFDropzone
              multiple={false}
              maxSize={100}
              onFilesChange={handleFilesChange}
            />

            {files.length > 0 && (
              <>
                {/* Detection Status */}
                <div className={`rounded-2xl border p-6 ${
                  isPasswordProtected 
                    ? "border-yellow-500/30 bg-yellow-500/5" 
                    : "border-green-500/30 bg-green-500/5"
                }`}>
                  <div className="flex items-start gap-4">
                    {isPasswordProtected ? (
                      <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className={`font-semibold ${isPasswordProtected ? "text-yellow-500" : "text-green-500"}`}>
                        {isPasswordProtected ? "Password Protected PDF Detected" : "PDF is Not Protected"}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        {isPasswordProtected 
                          ? "This PDF requires a password to open. Enter the password below to unlock it."
                          : "This PDF doesn't have password protection. No action needed!"}
                      </p>
                    </div>
                  </div>
                </div>

                {isPasswordProtected && (
                  <OptionsPanel>
                    <OptionGroup
                      title="Enter Password"
                      description="Enter the password used to protect this PDF"
                    >
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter PDF password"
                          className="bg-zinc-800 border-zinc-700 pl-10"
                        />
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">
                        We will remove the password protection and create an unlocked copy.
                      </p>
                    </OptionGroup>

                    {/* Info box */}
                    <div className="mt-6 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <h4 className="font-medium mb-2 text-sm">Important Information</h4>
                      <ul className="space-y-1 text-xs text-zinc-400">
                        <li>• You must know the correct password to unlock the PDF</li>
                        <li>• The original file will not be modified</li>
                        <li>• All content and formatting will be preserved</li>
                        <li>• We do not store your password or file</li>
                      </ul>
                    </div>
                  </OptionsPanel>
                )}

                {isPasswordProtected && (
                  <ActionButton
                    icon={Unlock}
                    onClick={handleUnlock}
                    disabled={password.length === 0}
                    className="w-full"
                  >
                    Unlock PDF
                  </ActionButton>
                )}
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Removing password protection..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
