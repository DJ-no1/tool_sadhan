"use client";

import { useState, useCallback } from "react";
import { Lock, Eye, EyeOff, Shield, Copy, FileText, Printer, Edit3 } from "lucide-react";
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
import { Label } from "@/components/ui/label";

interface PDFFile {
  id: string;
  file: File;
}

export default function ProtectPDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Password options
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Permissions
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(false);
  const [allowEditing, setAllowEditing] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState<"128" | "256">("256");

  const handleFilesChange = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles);
    setStatus("idle");
    setResultFile(null);
  }, []);

  const handleProtect = async () => {
    if (files.length === 0 || password !== confirmPassword || password.length < 4) return;

    setStatus("processing");
    setProgress(0);

    const intervals = [25, 50, 75, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(p);
    }

    setResultFile({
      name: files[0].file.name.replace(".pdf", "_protected.pdf"),
      size: files[0].file.size * 1.01,
    });

    setStatus("completed");
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultFile(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleDownload = () => {
    console.log("Downloading protected PDF");
  };

  const passwordsMatch = password === confirmPassword;
  const passwordValid = password.length >= 4;
  const canProtect = files.length > 0 && passwordsMatch && passwordValid;

  return (
    <PDFToolLayout
      title="Protect PDF"
      description="Add password protection to your PDF files. Set permissions for printing, copying, and editing."
      icon={Lock}
      features={["256-bit encryption", "Custom permissions", "Password protection"]}
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
                <OptionsPanel
                  advancedChildren={
                    <div className="space-y-6">
                      {/* Encryption Level */}
                      <OptionGroup
                        title="Encryption Level"
                        description="Higher encryption = more secure but may reduce compatibility"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setEncryptionLevel("128")}
                            className={`p-4 rounded-lg border text-left transition-all ${
                              encryptionLevel === "128"
                                ? "border-red-500 bg-red-500/10"
                                : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                            }`}
                          >
                            <Shield className={`h-5 w-5 mb-2 ${encryptionLevel === "128" ? "text-red-500" : "text-muted-foreground"}`} />
                            <p className="font-medium">128-bit AES</p>
                            <p className="text-xs text-muted-foreground">Good compatibility</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEncryptionLevel("256")}
                            className={`p-4 rounded-lg border text-left transition-all ${
                              encryptionLevel === "256"
                                ? "border-red-500 bg-red-500/10"
                                : "border-border-strong/50 bg-surface-2/30 hover:border-border-strong"
                            }`}
                          >
                            <Shield className={`h-5 w-5 mb-2 ${encryptionLevel === "256" ? "text-red-500" : "text-muted-foreground"}`} />
                            <p className="font-medium">256-bit AES</p>
                            <p className="text-xs text-muted-foreground">Maximum security</p>
                          </button>
                        </div>
                      </OptionGroup>

                      {/* Permissions */}
                      <OptionGroup
                        title="Document Permissions"
                        description="Control what users can do with the PDF"
                      >
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-surface-2 transition-colors">
                            <input
                              type="checkbox"
                              checked={allowPrinting}
                              onChange={(e) => setAllowPrinting(e.target.checked)}
                              className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                            />
                            <Printer className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="font-medium group-hover:text-foreground transition-colors">Allow printing</span>
                              <p className="text-xs text-muted-foreground">Users can print the document</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-surface-2 transition-colors">
                            <input
                              type="checkbox"
                              checked={allowCopying}
                              onChange={(e) => setAllowCopying(e.target.checked)}
                              className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                            />
                            <Copy className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="font-medium group-hover:text-foreground transition-colors">Allow copying</span>
                              <p className="text-xs text-muted-foreground">Users can copy text and images</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-surface-2 transition-colors">
                            <input
                              type="checkbox"
                              checked={allowEditing}
                              onChange={(e) => setAllowEditing(e.target.checked)}
                              className="w-5 h-5 rounded border-border-strong bg-surface-2 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                            />
                            <Edit3 className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="font-medium group-hover:text-foreground transition-colors">Allow editing</span>
                              <p className="text-xs text-muted-foreground">Users can modify the document</p>
                            </div>
                          </label>
                        </div>
                      </OptionGroup>
                    </div>
                  }
                >
                  {/* Password Input */}
                  <OptionGroup
                    title="Set Password"
                    description="Enter a strong password to protect your PDF"
                  >
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="bg-surface-2 border-border-strong pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className={`bg-surface-2 border-border-strong ${
                            confirmPassword && !passwordsMatch ? "border-red-500" : ""
                          }`}
                        />
                      </div>

                      {/* Password strength indicator */}
                      {password && (
                        <div className="space-y-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded ${
                                  password.length >= i * 3
                                    ? password.length >= 12
                                      ? "bg-green-500"
                                      : password.length >= 8
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                    : "bg-surface-3"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {password.length < 4 && "Password too short"}
                            {password.length >= 4 && password.length < 8 && "Weak password"}
                            {password.length >= 8 && password.length < 12 && "Good password"}
                            {password.length >= 12 && "Strong password"}
                          </p>
                        </div>
                      )}

                      {confirmPassword && !passwordsMatch && (
                        <p className="text-sm text-red-500">Passwords do not match</p>
                      )}
                    </div>
                  </OptionGroup>

                  {/* Security summary */}
                  <div className="mt-6 p-4 rounded-lg bg-surface-2 border border-border-strong/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Security Summary</span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• {encryptionLevel}-bit AES encryption</li>
                      <li>• Printing: {allowPrinting ? "Allowed" : "Blocked"}</li>
                      <li>• Copying: {allowCopying ? "Allowed" : "Blocked"}</li>
                      <li>• Editing: {allowEditing ? "Allowed" : "Blocked"}</li>
                    </ul>
                  </div>
                </OptionsPanel>

                <ActionButton
                  icon={Lock}
                  onClick={handleProtect}
                  disabled={!canProtect}
                  className="w-full"
                >
                  Protect PDF
                </ActionButton>
              </>
            )}
          </>
        )}

        <ProcessingPanel
          status={status}
          progress={progress}
          message={status === "processing" ? "Encrypting your PDF..." : undefined}
          resultFile={resultFile || undefined}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </div>
    </PDFToolLayout>
  );
}
