"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  formatBytes,
  parsePageRanges,
  pdfErrorMessage,
} from "@/lib/pdf-utils";

export default function ExtractPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pagesInput, setPagesInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ pages: number; size: number } | null>(null);

  async function onFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setPageCount(null);
    setError("");
    setResult(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch (e) {
      setFile(null);
      setError(pdfErrorMessage(e));
    }
  }

  async function extract() {
    if (!file || pageCount === null) return;
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const pages = parsePageRanges(pagesInput, pageCount);
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p - 1));
      for (const p of copied) out.addPage(p);
      const bytes = await out.save({ useObjectStreams: true });
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      setResult({ pages: pages.length, size: blob.size });
      downloadBlob(blob, `${baseName(file.name)}-extracted.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Extract PDF Pages"
      description="Pick pages or ranges (e.g. 2-5 or 1,3,8) and download them as a new PDF — all in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="application/pdf"
          onFiles={onFiles}
          label="Drag & drop a PDF here, or click to browse"
        />

        {file && pageCount !== null && (
          <>
            <p style={{ fontSize: ".9rem", marginBottom: "1rem", color: "var(--muted)" }}>
              <strong style={{ color: "var(--text)" }}>{file.name}</strong> — {pageCount} page{pageCount === 1 ? "" : "s"}, {formatBytes(file.size)}
            </p>
            <Field label={`Pages to extract (1–${pageCount})`}>
              <TextInput
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                placeholder="e.g. 2-5 or 1,3,8"
              />
            </Field>
            <button type="button" className="btn-primary" onClick={extract} disabled={busy}>
              {busy ? "Extracting…" : "Extract & Download"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {result && (
          <ResultBox>
            <ResultRow label="Pages extracted" value={result.pages} />
            <ResultRow label="Output size" value={formatBytes(result.size)} />
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
