"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  downloadBlob,
  formatBytes,
  pdfErrorMessage,
} from "@/lib/pdf-utils";

export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resultSize, setResultSize] = useState<number | null>(null);

  function move(index: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function merge() {
    setError("");
    setResultSize(null);
    if (files.length < 2) {
      setError("Add at least two PDF files to merge.");
      return;
    }
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      for (const file of files) {
        let src;
        try {
          src = await PDFDocument.load(await file.arrayBuffer());
        } catch (e) {
          throw new Error(`"${file.name}" — ${pdfErrorMessage(e)}`);
        }
        const pages = await out.copyPages(src, src.getPageIndices());
        for (const p of pages) out.addPage(p);
      }
      const bytes = await out.save({ useObjectStreams: true });
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      setResultSize(blob.size);
      downloadBlob(blob, "merged.pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Reorder them before merging — everything happens in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="application/pdf"
          multiple
          onFiles={(f) =>
            setFiles((prev) => [
              ...prev,
              ...f.filter((x) => x.type === "application/pdf" || /\.pdf$/i.test(x.name)),
            ])
          }
          label="Drag & drop PDF files here, or click to browse"
        />

        {files.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.2rem" }}>
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".6rem",
                  padding: ".55rem .8rem",
                  border: "1px solid var(--border-2)",
                  borderRadius: "10px",
                  marginBottom: ".5rem",
                  fontSize: ".9rem",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--muted)" }}>{i + 1}.</span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {file.name}
                </span>
                <span style={{ color: "var(--muted)", fontSize: ".8rem" }}>
                  {formatBytes(file.size)}
                </span>
                <button type="button" className="btn-secondary sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  &uarr;
                </button>
                <button type="button" className="btn-secondary sm" onClick={() => move(i, 1)} disabled={i === files.length - 1} aria-label="Move down">
                  &darr;
                </button>
                <button type="button" className="btn-secondary sm" onClick={() => remove(i)} aria-label="Remove">
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="button" className="btn-primary" onClick={merge} disabled={busy || files.length < 2}>
          {busy ? "Merging…" : "Merge & Download"}
        </button>

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {resultSize !== null && (
          <ResultBox>
            <ResultRow label="Files merged" value={files.length} />
            <ResultRow label="Output size" value={formatBytes(resultSize)} />
            <p style={{ marginTop: ".8rem", fontSize: ".85rem", color: "var(--muted)" }}>
              Your merged PDF has been downloaded as <strong>merged.pdf</strong>.
            </p>
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
