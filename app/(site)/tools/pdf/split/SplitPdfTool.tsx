"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, Field, TextInput, TabGroup, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  formatBytes,
  pdfErrorMessage,
} from "@/lib/pdf-utils";

export default function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState("range");
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("1");
  const [every, setEvery] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<{ files: number; size: number } | null>(null);

  async function onFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setPageCount(null);
    setError("");
    setSummary(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer());
      const n = doc.getPageCount();
      setPageCount(n);
      setTo(String(n));
    } catch (e) {
      setFile(null);
      setError(pdfErrorMessage(e));
    }
  }

  async function split() {
    if (!file || pageCount === null) return;
    setError("");
    setSummary(null);
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const name = baseName(file.name);

      if (mode === "range") {
        const f = parseInt(from, 10);
        const t = parseInt(to, 10);
        if (!Number.isFinite(f) || !Number.isFinite(t) || f < 1 || t > pageCount || f > t) {
          throw new Error(`Enter a valid range between 1 and ${pageCount} (from ≤ to).`);
        }
        const out = await PDFDocument.create();
        const indices = Array.from({ length: t - f + 1 }, (_, i) => f - 1 + i);
        const pages = await out.copyPages(src, indices);
        for (const p of pages) out.addPage(p);
        const bytes = await out.save({ useObjectStreams: true });
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `${name}-pages-${f}-${t}.pdf`);
        setSummary({ files: 1, size: blob.size });
      } else {
        const n = parseInt(every, 10);
        if (!Number.isFinite(n) || n < 1) throw new Error("Enter a chunk size of 1 or more pages.");
        const chunks: number[][] = [];
        for (let start = 0; start < pageCount; start += n) {
          chunks.push(
            Array.from({ length: Math.min(n, pageCount - start) }, (_, i) => start + i)
          );
        }
        if (chunks.length === 1) {
          const out = await PDFDocument.create();
          const pages = await out.copyPages(src, chunks[0]);
          for (const p of pages) out.addPage(p);
          const bytes = await out.save({ useObjectStreams: true });
          const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
          downloadBlob(blob, `${name}-part-1.pdf`);
          setSummary({ files: 1, size: blob.size });
        } else {
          const JSZip = (await import("jszip")).default;
          const zip = new JSZip();
          for (let c = 0; c < chunks.length; c++) {
            const out = await PDFDocument.create();
            const pages = await out.copyPages(src, chunks[c]);
            for (const p of pages) out.addPage(p);
            const bytes = await out.save({ useObjectStreams: true });
            zip.file(`${name}-part-${c + 1}.pdf`, bytes);
          }
          const blob = await zip.generateAsync({ type: "blob" });
          downloadBlob(blob, `${name}-split.zip`);
          setSummary({ files: chunks.length, size: blob.size });
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Split PDF"
      description="Extract a page range, or split a PDF into chunks of N pages. Multiple output files download as a zip — all in your browser."
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

            <TabGroup
              options={[
                { value: "range", label: "Extract page range" },
                { value: "every", label: "Split every N pages" },
              ]}
              value={mode}
              onChange={setMode}
            />

            {mode === "range" ? (
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <Field label="From page">
                    <TextInput type="number" min={1} max={pageCount} value={from} onChange={(e) => setFrom(e.target.value)} />
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="To page">
                    <TextInput type="number" min={1} max={pageCount} value={to} onChange={(e) => setTo(e.target.value)} />
                  </Field>
                </div>
              </div>
            ) : (
              <Field label="Pages per file">
                <TextInput type="number" min={1} max={pageCount} value={every} onChange={(e) => setEvery(e.target.value)} />
              </Field>
            )}

            <button type="button" className="btn-primary" onClick={split} disabled={busy}>
              {busy ? "Splitting…" : "Split & Download"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {summary && (
          <ResultBox>
            <ResultRow label="Output files" value={summary.files} />
            <ResultRow label="Download size" value={formatBytes(summary.size)} />
            <p style={{ marginTop: ".8rem", fontSize: ".85rem", color: "var(--muted)" }}>
              {summary.files > 1
                ? "Your files were downloaded together as a zip archive."
                : "Your PDF has been downloaded."}
            </p>
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
