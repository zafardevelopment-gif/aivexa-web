"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, TabGroup, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
  formatBytes,
  baseName,
} from "@/components/tools/imageUtils";

const FORMATS: Record<string, { mime: string; ext: string }> = {
  jpg: { mime: "image/jpeg", ext: "jpg" },
  png: { mime: "image/png", ext: "png" },
  webp: { mime: "image/webp", ext: "webp" },
};

export default function ConvertTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [format, setFormat] = useState("png");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  async function onFiles(files: File[]) {
    setError("");
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    try {
      const image = await loadImageFromFile(files[0]);
      setFile(files[0]);
      setImg(image);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load image.");
    }
  }

  async function convert() {
    if (!img || !file) return;
    setBusy(true);
    setError("");
    try {
      const { mime } = FORMATS[format];
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      if (mime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, mime, mime === "image/png" ? undefined : 0.92);
      if (result) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Image Format Converter"
      description="Convert JPG, PNG, WebP (and GIF input) between formats — fully in your browser."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone accept="image/*" onFiles={onFiles} />

        {img && file && (
          <>
            <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".9rem" }}>
              Output format (GIF is accepted as input — first frame only — but GIF output
              is not supported by browsers):
            </p>
            <TabGroup
              options={[
                { value: "jpg", label: "JPG" },
                { value: "png", label: "PNG" },
                { value: "webp", label: "WebP" },
              ]}
              value={format}
              onChange={setFormat}
            />
            <button type="button" className="btn-primary" onClick={convert} disabled={busy}>
              {busy ? "Converting…" : `Convert to ${format.toUpperCase()}`}
            </button>
          </>
        )}

        {error && (
          <p style={{ color: "#b91c1c", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>
        )}

        {result && file && (
          <ResultBox>
            <ResultRow label="Original" value={`${file.type || "unknown"} · ${formatBytes(file.size)}`} />
            <ResultRow label="Converted" value={`${result.blob.type} · ${formatBytes(result.blob.size)}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt="Converted preview"
              style={{
                maxWidth: "100%",
                marginTop: "1rem",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}
            />
            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  downloadBlob(result.blob, `${baseName(file.name)}.${FORMATS[format].ext}`)
                }
              >
                Download {format.toUpperCase()}
              </button>
            </div>
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
