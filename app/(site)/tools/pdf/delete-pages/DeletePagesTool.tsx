"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  formatBytes,
  pdfErrorMessage,
  renderThumbnails,
} from "@/lib/pdf-utils";

export default function DeletePagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ removed: number; size: number } | null>(null);

  async function onFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setThumbs([]);
    setMarked(new Set());
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const t = await renderThumbnails(await f.arrayBuffer(), 140, (done, total) =>
        setProgress(`Loading page ${done} of ${total}…`)
      );
      setThumbs(t);
    } catch (e) {
      setFile(null);
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  function toggle(index: number) {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function apply() {
    if (!file) return;
    setError("");
    setResult(null);
    if (marked.size === 0) {
      setError("Click at least one page thumbnail to mark it for deletion.");
      return;
    }
    if (marked.size >= thumbs.length) {
      setError("You cannot delete every page — at least one must remain.");
      return;
    }
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const keep = src.getPageIndices().filter((i) => !marked.has(i));
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, keep);
      for (const p of pages) out.addPage(p);
      const bytes = await out.save({ useObjectStreams: true });
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      setResult({ removed: marked.size, size: blob.size });
      downloadBlob(blob, `${baseName(file.name)}-pages-removed.pdf`);
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Delete PDF Pages"
      description="Click pages to mark them for removal, then download the PDF without them — all in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="application/pdf"
          onFiles={onFiles}
          label="Drag & drop a PDF here, or click to browse"
        />

        {busy && progress && (
          <p style={{ fontSize: ".9rem", color: "var(--muted)", marginBottom: "1rem" }}>{progress}</p>
        )}

        {file && thumbs.length > 0 && (
          <>
            <p style={{ fontSize: ".9rem", marginBottom: "1rem", color: "var(--muted)" }}>
              <strong style={{ color: "var(--text)" }}>{file.name}</strong> — {thumbs.length} pages, {formatBytes(file.size)}.
              Click a page to mark it for deletion.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                gap: ".8rem",
                marginBottom: "1.2rem",
              }}
            >
              {thumbs.map((src, i) => {
                const isMarked = marked.has(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    style={{
                      position: "relative",
                      border: isMarked ? "2px solid #dc2626" : "1px solid var(--border-2)",
                      borderRadius: "10px",
                      padding: ".35rem",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    aria-pressed={isMarked}
                    aria-label={`Page ${i + 1}${isMarked ? " (marked for deletion)" : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Page ${i + 1}`}
                      style={{ width: "100%", height: "auto", borderRadius: "6px", opacity: isMarked ? 0.4 : 1 }}
                    />
                    {isMarked && (
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "2rem",
                          fontWeight: 700,
                          color: "#dc2626",
                        }}
                        aria-hidden
                      >
                        &times;
                      </span>
                    )}
                    <span style={{ display: "block", fontSize: ".75rem", marginTop: ".25rem", color: "var(--muted)" }}>
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <button type="button" className="btn-primary" onClick={apply} disabled={busy}>
              {busy ? "Working…" : `Delete ${marked.size || ""} Page${marked.size === 1 ? "" : "s"} & Download`}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {result && (
          <ResultBox>
            <ResultRow label="Pages removed" value={result.removed} />
            <ResultRow label="Pages remaining" value={thumbs.length - result.removed} />
            <ResultRow label="Output size" value={formatBytes(result.size)} />
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
