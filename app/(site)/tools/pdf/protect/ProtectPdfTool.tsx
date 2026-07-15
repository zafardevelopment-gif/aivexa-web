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
  pdfErrorMessage,
  renderPageToCanvas,
} from "@/lib/pdf-utils";

export default function ProtectPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [resultSize, setResultSize] = useState<number | null>(null);

  async function protect() {
    if (!file) return;
    setError("");
    setResultSize(null);
    if (password.length < 1) {
      setError("Enter a password.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const pdf = await openPdfWithPdfJs(await file.arrayBuffer());
      const { jsPDF } = await import("jspdf");
      let out: InstanceType<typeof jsPDF> | null = null;
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Encrypting page ${i} of ${pdf.numPages}…`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = await renderPageToCanvas(page, 2);
        const img = canvas.toDataURL("image/jpeg", 0.85);
        const w = viewport.width;
        const h = viewport.height;
        const orientation = w > h ? "l" : "p";
        if (!out) {
          out = new jsPDF({
            unit: "pt",
            format: [w, h],
            orientation,
            compress: true,
            encryption: {
              userPassword: password,
              ownerPassword: password,
              userPermissions: ["print"],
            },
          });
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
      downloadBlob(blob, `${baseName(file.name)}-protected.pdf`);
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <ToolPageLayout
      title="Protect PDF"
      description="Add password protection to a PDF. The output genuinely requires the password to open — encryption happens entirely in your browser."
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
          label="Drag & drop a PDF here, or click to browse"
        />

        {file && (
          <>
            <p style={{ fontSize: ".9rem", marginBottom: "1rem", color: "var(--muted)" }}>
              <strong style={{ color: "var(--text)" }}>{file.name}</strong> — {formatBytes(file.size)}
            </p>
            <Field label="Password">
              <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </Field>
            <Field label="Confirm password">
              <TextInput type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </Field>
            <p style={{ fontSize: ".85rem", color: "#b45309", marginBottom: "1.1rem" }}>
              Note: to encrypt in the browser, each page is rebuilt as a high-resolution image.
              The protected PDF opens only with your password, but its text will not be
              selectable or searchable.
            </p>
            <button type="button" className="btn-primary" onClick={protect} disabled={busy}>
              {busy ? progress || "Protecting…" : "Protect & Download"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {resultSize !== null && (
          <ResultBox>
            <ResultRow label="Output size" value={formatBytes(resultSize)} />
            <ResultRow label="Protection" value="Password required to open" />
            <p style={{ marginTop: ".8rem", fontSize: ".85rem", color: "var(--muted)" }}>
              Keep your password safe — it cannot be recovered if you forget it.
            </p>
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
