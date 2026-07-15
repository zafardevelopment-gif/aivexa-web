"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  formatBytes,
  openPdfWithPdfJs,
  renderPageToCanvas,
} from "@/lib/pdf-utils";

export default function UnlockPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [resultSize, setResultSize] = useState<number | null>(null);

  async function unlock() {
    if (!file) return;
    setError("");
    setResultSize(null);
    setBusy(true);
    try {
      let pdf;
      try {
        pdf = await openPdfWithPdfJs(await file.arrayBuffer(), password || undefined);
      } catch (e) {
        const name = (e as { name?: string })?.name;
        if (name === "PasswordException") {
          throw new Error(
            password
              ? "Wrong password. This tool removes a password you already know — it cannot crack unknown passwords."
              : "This PDF requires a password. Enter it above."
          );
        }
        throw e;
      }
      const { jsPDF } = await import("jspdf");
      let out: InstanceType<typeof jsPDF> | null = null;
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Rebuilding page ${i} of ${pdf.numPages}…`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = await renderPageToCanvas(page, 2);
        const img = canvas.toDataURL("image/jpeg", 0.85);
        const w = viewport.width;
        const h = viewport.height;
        const orientation = w > h ? "l" : "p";
        if (!out) {
          out = new jsPDF({ unit: "pt", format: [w, h], orientation, compress: true });
        } else {
          out.addPage([w, h], orientation);
        }
        out.addImage(img, "JPEG", 0, 0, w, h);
        canvas.width = 0;
        canvas.height = 0;
      }
      if (!out) throw new Error("The PDF has no pages.");
      const blob = out.output("blob");
      await pdf.cleanup();
      setResultSize(blob.size);
      downloadBlob(blob, `${baseName(file.name)}-unlocked.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not unlock this PDF.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <ToolPageLayout
      title="Unlock PDF"
      description="Remove a password from a PDF you can already open. Enter the correct password and download an unprotected copy — all in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="application/pdf"
          onFiles={(f) => {
            setFile(f[0]);
            setError("");
            setResultSize(null);
          }}
          label="Drag & drop a password-protected PDF here, or click to browse"
        />

        {file && (
          <>
            <p style={{ fontSize: ".9rem", marginBottom: "1rem", color: "var(--muted)" }}>
              <strong style={{ color: "var(--text)" }}>{file.name}</strong> — {formatBytes(file.size)}
            </p>
            <Field label="Current password">
              <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
            </Field>
            <p style={{ fontSize: ".85rem", color: "#b45309", marginBottom: "1.1rem" }}>
              This removes a password you already know — it cannot crack unknown passwords.
              The unlocked PDF is rebuilt from page images, so text will not be selectable.
            </p>
            <button type="button" className="btn-primary" onClick={unlock} disabled={busy}>
              {busy ? progress || "Unlocking…" : "Unlock & Download"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {resultSize !== null && (
          <ResultBox>
            <ResultRow label="Output size" value={formatBytes(resultSize)} />
            <ResultRow label="Password" value="Removed" />
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
