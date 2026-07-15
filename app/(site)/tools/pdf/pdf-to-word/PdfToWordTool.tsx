"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  extractTextLines,
  formatBytes,
  openPdfWithPdfJs,
  pdfErrorMessage,
} from "@/lib/pdf-utils";

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ pages: number; size: number } | null>(null);

  async function convert() {
    if (!file) return;
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const pdf = await openPdfWithPdfJs(await file.arrayBuffer());
      const pages = await extractTextLines(pdf);
      await pdf.cleanup();

      if (pages.every((lines) => lines.join("").trim() === "")) {
        throw new Error(
          "No selectable text found in this PDF. Scanned documents need OCR, which this tool does not perform."
        );
      }

      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const children = pages.flatMap((lines, pageIdx) => {
        const paras = (lines.length > 0 ? lines : [""]).map(
          (line, lineIdx) =>
            new Paragraph({
              children: [new TextRun(line)],
              pageBreakBefore: pageIdx > 0 && lineIdx === 0,
            })
        );
        return paras;
      });
      const doc = new Document({
        sections: [{ children }],
      });
      const blob = await Packer.toBlob(doc);
      setResult({ pages: pages.length, size: blob.size });
      downloadBlob(blob, `${baseName(file.name)}.docx`);
    } catch (e) {
      setError(e instanceof Error ? e.message : pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="PDF to Word"
      description="Convert the text content of a PDF into an editable Word (.docx) document — entirely in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="application/pdf"
          onFiles={(f) => {
            setFile(f[0]);
            setError("");
            setResult(null);
          }}
          label="Drag & drop a PDF here, or click to browse"
        />

        {file && (
          <>
            <p style={{ fontSize: ".9rem", marginBottom: "1rem", color: "var(--muted)" }}>
              <strong style={{ color: "var(--text)" }}>{file.name}</strong> — {formatBytes(file.size)}
            </p>
            <p style={{ fontSize: ".85rem", color: "#b45309", marginBottom: "1.1rem" }}>
              Note: this converts the text content. Complex layouts, tables, fonts and images
              are not preserved.
            </p>
            <button type="button" className="btn-primary" onClick={convert} disabled={busy}>
              {busy ? "Converting…" : "Convert to .docx"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {result && (
          <ResultBox>
            <ResultRow label="Pages converted" value={result.pages} />
            <ResultRow label="Word file size" value={formatBytes(result.size)} />
            <p style={{ marginTop: ".8rem", fontSize: ".85rem", color: "var(--muted)" }}>
              Downloaded as <strong>{baseName(file?.name ?? "document")}.docx</strong>.
            </p>
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
