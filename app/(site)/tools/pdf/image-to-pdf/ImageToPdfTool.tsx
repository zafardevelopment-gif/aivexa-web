"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import { downloadBlob, formatBytes } from "@/lib/pdf-utils";

const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN = 28;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read image "${file.name}".`));
    };
    img.src = url;
  });
}

export default function ImageToPdfTool() {
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

  async function convert() {
    if (files.length === 0) return;
    setError("");
    setResultSize(null);
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "p" });
      for (let i = 0; i < files.length; i++) {
        const img = await loadImage(files[i]);
        // Normalize through a canvas so any browser-supported format works.
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is not available in this browser.");
        const isPng = files[i].type === "image/png";
        if (!isPng) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = isPng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.92);

        if (i > 0) doc.addPage("a4", "p");
        const maxW = A4_W - MARGIN * 2;
        const maxH = A4_H - MARGIN * 2;
        const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
        const w = canvas.width * ratio;
        const h = canvas.height * ratio;
        const x = (A4_W - w) / 2;
        const y = (A4_H - h) / 2;
        doc.addImage(dataUrl, isPng ? "PNG" : "JPEG", x, y, w, h);
        canvas.width = 0;
        canvas.height = 0;
      }
      const blob = doc.output("blob");
      setResultSize(blob.size);
      downloadBlob(blob, "images.pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build the PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Image to PDF"
      description="Combine JPG, PNG or WebP images into one PDF. Each image is centered and fitted onto an A4 page — all in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="image/*"
          multiple
          onFiles={(f) =>
            setFiles((prev) => [...prev, ...f.filter((x) => x.type.startsWith("image/"))])
          }
          label="Drag & drop images here, or click to browse"
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
                <span style={{ color: "var(--muted)", fontSize: ".8rem" }}>{formatBytes(file.size)}</span>
                <button type="button" className="btn-secondary sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  &uarr;
                </button>
                <button type="button" className="btn-secondary sm" onClick={() => move(i, 1)} disabled={i === files.length - 1} aria-label="Move down">
                  &darr;
                </button>
                <button type="button" className="btn-secondary sm" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} aria-label="Remove">
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="button" className="btn-primary" onClick={convert} disabled={busy || files.length === 0}>
          {busy ? "Building PDF…" : "Create PDF"}
        </button>

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {resultSize !== null && (
          <ResultBox>
            <ResultRow label="Images" value={files.length} />
            <ResultRow label="PDF size" value={formatBytes(resultSize)} />
            <p style={{ marginTop: ".8rem", fontSize: ".85rem", color: "var(--muted)" }}>
              Downloaded as <strong>images.pdf</strong>.
            </p>
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
