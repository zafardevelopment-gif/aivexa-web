"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, Field, TextInput, SelectInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  formatBytes,
  pdfErrorMessage,
} from "@/lib/pdf-utils";

const MARGIN = 32;

export default function PageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState("bottom-center");
  const [format, setFormat] = useState("n");
  const [start, setStart] = useState("1");
  const [fontSize, setFontSize] = useState("11");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ pages: number; size: number } | null>(null);

  async function apply() {
    if (!file) return;
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const startNum = parseInt(start, 10);
      const size = parseFloat(fontSize);
      if (!Number.isFinite(startNum)) throw new Error("Enter a valid start number.");
      if (!Number.isFinite(size) || size < 4 || size > 72) {
        throw new Error("Font size must be between 4 and 72.");
      }
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const total = doc.getPageCount();

      doc.getPages().forEach((page, i) => {
        const n = startNum + i;
        const label =
          format === "page-n" ? `Page ${n}` : format === "n-of-total" ? `${n} of ${startNum + total - 1}` : `${n}`;
        const textWidth = font.widthOfTextAtSize(label, size);
        const { width, height } = page.getSize();

        let x: number;
        if (position.endsWith("center")) x = (width - textWidth) / 2;
        else if (position.endsWith("right")) x = width - MARGIN - textWidth;
        else x = MARGIN;
        const y = position.startsWith("top") ? height - MARGIN : MARGIN - size / 2 + 4;

        page.drawText(label, { x, y, size, font, color: rgb(0.2, 0.2, 0.2) });
      });

      const bytes = await doc.save({ useObjectStreams: true });
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      setResult({ pages: total, size: blob.size });
      downloadBlob(blob, `${baseName(file.name)}-numbered.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Add Page Numbers"
      description="Stamp page numbers on every page of a PDF — pick position, format, starting number and font size. All in your browser."
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              <Field label="Position">
                <SelectInput value={position} onChange={(e) => setPosition(e.target.value)}>
                  <option value="bottom-center">Bottom center</option>
                  <option value="bottom-right">Bottom right</option>
                  <option value="bottom-left">Bottom left</option>
                  <option value="top-center">Top center</option>
                  <option value="top-right">Top right</option>
                </SelectInput>
              </Field>
              <Field label="Format">
                <SelectInput value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="n">1</option>
                  <option value="page-n">Page 1</option>
                  <option value="n-of-total">1 of N</option>
                </SelectInput>
              </Field>
              <Field label="Start at">
                <TextInput type="number" value={start} onChange={(e) => setStart(e.target.value)} />
              </Field>
              <Field label="Font size">
                <TextInput type="number" min={4} max={72} value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
              </Field>
            </div>
            <button type="button" className="btn-primary" onClick={apply} disabled={busy}>
              {busy ? "Numbering…" : "Add Numbers & Download"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {result && (
          <ResultBox>
            <ResultRow label="Pages numbered" value={result.pages} />
            <ResultRow label="Output size" value={formatBytes(result.size)} />
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
