"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, Field, TabGroup, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  formatBytes,
  openPdfWithPdfJs,
  pdfErrorMessage,
  renderPageToCanvas,
} from "@/lib/pdf-utils";

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState("lossless");
  const [quality, setQuality] = useState(0.6);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ before: number; after: number } | null>(null);

  async function compress() {
    if (!file) return;
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const before = file.size;
      let blob: Blob;

      if (mode === "lossless") {
        setProgress("Re-saving PDF…");
        const { PDFDocument } = await import("pdf-lib");
        const doc = await PDFDocument.load(await file.arrayBuffer());
        const bytes = await doc.save({ useObjectStreams: true });
        blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      } else {
        const pdf = await openPdfWithPdfJs(await file.arrayBuffer());
        const { jsPDF } = await import("jspdf");
        let out: InstanceType<typeof jsPDF> | null = null;
        for (let i = 1; i <= pdf.numPages; i++) {
          setProgress(`Rendering page ${i} of ${pdf.numPages}…`);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1 });
          const canvas = await renderPageToCanvas(page, 1.5);
          const img = canvas.toDataURL("image/jpeg", quality);
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
        blob = out.output("blob");
        await pdf.cleanup();
      }

      setResult({ before, after: blob.size });
      downloadBlob(blob, `${baseName(file.name)}-compressed.pdf`);
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  const saved =
    result && result.before > 0
      ? Math.round(((result.before - result.after) / result.before) * 100)
      : 0;

  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Shrink a PDF in your browser. Lossless mode cleans up the file structure; aggressive mode recompresses pages as JPEG images for big savings on scans."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="application/pdf"
          onFiles={(f) => {
            setFile(f[0]);
            setResult(null);
            setError("");
          }}
          label="Drag & drop a PDF here, or click to browse"
        />

        {file && (
          <>
            <p style={{ fontSize: ".9rem", marginBottom: "1rem", color: "var(--muted)" }}>
              <strong style={{ color: "var(--text)" }}>{file.name}</strong> — {formatBytes(file.size)}
            </p>

            <TabGroup
              options={[
                { value: "lossless", label: "Lossless clean-up" },
                { value: "aggressive", label: "Aggressive (image-based)" },
              ]}
              value={mode}
              onChange={setMode}
            />

            {mode === "lossless" ? (
              <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: "1.1rem" }}>
                Re-saves the PDF with object streams and removes unused data. Text and images stay
                exactly as they are — savings depend on how the file was created.
              </p>
            ) : (
              <>
                <Field label={`JPEG quality: ${Math.round(quality * 100)}%`}>
                  <input
                    type="range"
                    min={0.2}
                    max={0.9}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </Field>
                <p style={{ fontSize: ".85rem", color: "#b45309", marginBottom: "1.1rem" }}>
                  Note: aggressive mode rebuilds every page as a JPEG image. File size drops a lot
                  for scan-heavy PDFs, but text becomes non-selectable and non-searchable.
                </p>
              </>
            )}

            <button type="button" className="btn-primary" onClick={compress} disabled={busy}>
              {busy ? progress || "Compressing…" : "Compress & Download"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {result && (
          <ResultBox>
            <ResultRow label="Original size" value={formatBytes(result.before)} />
            <ResultRow label="Compressed size" value={formatBytes(result.after)} />
            <ResultRow
              label="Change"
              value={
                result.after < result.before
                  ? `${saved}% smaller`
                  : "No reduction (file was already optimized)"
              }
            />
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
