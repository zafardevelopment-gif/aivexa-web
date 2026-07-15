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

export default function ReorderPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  // order[i] = original page index shown at position i
  const [order, setOrder] = useState<number[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [resultSize, setResultSize] = useState<number | null>(null);

  async function onFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setThumbs([]);
    setOrder([]);
    setError("");
    setResultSize(null);
    setBusy(true);
    try {
      const t = await renderThumbnails(await f.arrayBuffer(), 140, (done, total) =>
        setProgress(`Loading page ${done} of ${total}…`)
      );
      setThumbs(t);
      setOrder(t.map((_, i) => i));
    } catch (e) {
      setFile(null);
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  function moveTo(fromPos: number, toPos: number) {
    if (fromPos === toPos) return;
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromPos, 1);
      next.splice(toPos, 0, item);
      return next;
    });
  }

  function nudge(pos: number, dir: -1 | 1) {
    const target = pos + dir;
    if (target < 0 || target >= order.length) return;
    moveTo(pos, target);
  }

  async function apply() {
    if (!file) return;
    setError("");
    setResultSize(null);
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, order);
      for (const p of pages) out.addPage(p);
      const bytes = await out.save({ useObjectStreams: true });
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      setResultSize(blob.size);
      downloadBlob(blob, `${baseName(file.name)}-reordered.pdf`);
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const changed = order.some((orig, pos) => orig !== pos);

  return (
    <ToolPageLayout
      title="Reorder PDF Pages"
      description="Drag page thumbnails into a new order (or use the arrow buttons), then download the rearranged PDF — all in your browser."
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

        {file && order.length > 0 && (
          <>
            <p style={{ fontSize: ".9rem", marginBottom: "1rem", color: "var(--muted)" }}>
              <strong style={{ color: "var(--text)" }}>{file.name}</strong> — {order.length} pages, {formatBytes(file.size)}.
              Drag thumbnails to rearrange.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: ".8rem",
                marginBottom: "1.2rem",
              }}
            >
              {order.map((orig, pos) => (
                <div
                  key={orig}
                  draggable
                  onDragStart={() => setDragIndex(pos)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverIndex(pos);
                  }}
                  onDragLeave={() => setOverIndex((v) => (v === pos ? null : v))}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null) moveTo(dragIndex, pos);
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  style={{
                    border:
                      overIndex === pos && dragIndex !== null && dragIndex !== pos
                        ? "2px dashed var(--indigo, #4f46e5)"
                        : "1px solid var(--border-2)",
                    borderRadius: "10px",
                    padding: ".35rem",
                    background: "#fff",
                    cursor: "grab",
                    opacity: dragIndex === pos ? 0.5 : 1,
                    textAlign: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbs[orig]}
                    alt={`Original page ${orig + 1}`}
                    style={{ width: "100%", height: "auto", borderRadius: "6px", pointerEvents: "none" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: ".3rem",
                    }}
                  >
                    <button type="button" className="btn-secondary sm" onClick={() => nudge(pos, -1)} disabled={pos === 0} aria-label="Move earlier">
                      &larr;
                    </button>
                    <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>
                      {pos + 1}
                      {orig !== pos ? ` (was ${orig + 1})` : ""}
                    </span>
                    <button type="button" className="btn-secondary sm" onClick={() => nudge(pos, 1)} disabled={pos === order.length - 1} aria-label="Move later">
                      &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="btn-primary" onClick={apply} disabled={busy || !changed}>
              {busy ? "Rebuilding…" : changed ? "Apply New Order & Download" : "Reorder pages first"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {resultSize !== null && (
          <ResultBox>
            <ResultRow label="Pages" value={order.length} />
            <ResultRow label="Output size" value={formatBytes(resultSize)} />
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
