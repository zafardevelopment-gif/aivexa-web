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

function hexToRgb01(hex: string): { r: number; g: number; b: number } {
  const m = hex.replace("#", "");
  const int = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
  return {
    r: ((int >> 16) & 255) / 255,
    g: ((int >> 8) & 255) / 255,
    b: (int & 255) / 255,
  };
}

export default function WatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState("48");
  const [rotation, setRotation] = useState("45");
  const [color, setColor] = useState("#dc2626");
  const [placement, setPlacement] = useState("center");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ pages: number; size: number } | null>(null);

  async function apply() {
    if (!file) return;
    setError("");
    setResult(null);
    if (!text.trim()) {
      setError("Enter watermark text.");
      return;
    }
    setBusy(true);
    try {
      const size = parseFloat(fontSize);
      const rot = parseFloat(rotation);
      if (!Number.isFinite(size) || size < 6 || size > 200) {
        throw new Error("Font size must be between 6 and 200.");
      }
      const { PDFDocument, StandardFonts, rgb, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      let textWidth: number;
      try {
        textWidth = font.widthOfTextAtSize(text, size);
      } catch {
        throw new Error(
          "This watermark text contains characters the built-in PDF font cannot encode. Use basic Latin characters."
        );
      }
      const { r, g, b } = hexToRgb01(color);
      const rad = (rot * Math.PI) / 180;

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        if (placement === "center") {
          const x = width / 2 - (textWidth / 2) * Math.cos(rad);
          const y = height / 2 - (textWidth / 2) * Math.sin(rad);
          page.drawText(text, {
            x,
            y,
            size,
            font,
            color: rgb(r, g, b),
            opacity,
            rotate: degrees(rot),
          });
        } else {
          const stepX = textWidth + 90;
          const stepY = size + 110;
          for (let y = -stepY; y < height + stepY; y += stepY) {
            for (let x = -stepX; x < width + stepX; x += stepX) {
              page.drawText(text, {
                x,
                y,
                size,
                font,
                color: rgb(r, g, b),
                opacity,
                rotate: degrees(rot),
              });
            }
          }
        }
      }

      const bytes = await doc.save({ useObjectStreams: true });
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      setResult({ pages: doc.getPageCount(), size: blob.size });
      downloadBlob(blob, `${baseName(file.name)}-watermarked.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Add Watermark to PDF"
      description="Stamp a text watermark across every page — control opacity, size, angle, color and placement. All in your browser."
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
            <Field label="Watermark text">
              <TextInput value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
            <div className="tool-cols" style={{ gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              <Field label="Placement">
                <SelectInput value={placement} onChange={(e) => setPlacement(e.target.value)}>
                  <option value="center">Center (single)</option>
                  <option value="tiled">Tiled (repeated)</option>
                </SelectInput>
              </Field>
              <Field label="Rotation (degrees)">
                <TextInput type="number" min={-90} max={90} value={rotation} onChange={(e) => setRotation(e.target.value)} />
              </Field>
              <Field label="Font size">
                <TextInput type="number" min={6} max={200} value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
              </Field>
              <Field label="Color">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: "100%", height: "2.7rem", border: "1px solid var(--border-2)", borderRadius: "10px", padding: ".2rem", background: "#fff" }}
                />
              </Field>
            </div>
            <Field label={`Opacity: ${Math.round(opacity * 100)}%`}>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                style={{ width: "100%" }}
              />
            </Field>
            <button type="button" className="btn-primary" onClick={apply} disabled={busy}>
              {busy ? "Stamping…" : "Add Watermark & Download"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {result && (
          <ResultBox>
            <ResultRow label="Pages watermarked" value={result.pages} />
            <ResultRow label="Output size" value={formatBytes(result.size)} />
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
