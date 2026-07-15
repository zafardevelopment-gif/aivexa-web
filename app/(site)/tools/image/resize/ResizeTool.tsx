"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TabGroup } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
  baseName,
  dimsOk,
} from "@/components/tools/imageUtils";

export default function ResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState("px");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percent, setPercent] = useState("50");
  const [keepAspect, setKeepAspect] = useState(true);
  const [format, setFormat] = useState("png");
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFiles(files: File[]) {
    setError("");
    setResultUrl("");
    try {
      const image = await loadImageFromFile(files[0]);
      setFile(files[0]);
      setImg(image);
      setWidth(String(image.naturalWidth));
      setHeight(String(image.naturalHeight));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load image.");
    }
  }

  function targetDims(): { w: number; h: number } | null {
    if (!img) return null;
    if (mode === "percent") {
      const p = Number(percent);
      if (!Number.isFinite(p) || p <= 0 || p > 1000) return null;
      return {
        w: Math.max(1, Math.round((img.naturalWidth * p) / 100)),
        h: Math.max(1, Math.round((img.naturalHeight * p) / 100)),
      };
    }
    const w = Math.round(Number(width));
    const h = Math.round(Number(height));
    if (!Number.isFinite(w) || !Number.isFinite(h)) return null;
    return { w, h };
  }

  async function resize() {
    if (!img || !file) return;
    const dims = targetDims();
    if (!dims || !dimsOk(dims.w, dims.h)) {
      setError("Please enter valid dimensions (1–16000 px, percentage 1–1000).");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = dims.w;
      canvas.height = dims.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.imageSmoothingQuality = "high";
      if (format === "jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, dims.w, dims.h);
      }
      ctx.drawImage(img, 0, 0, dims.w, dims.h);
      const blob = await canvasToBlob(
        canvas,
        format === "jpg" ? "image/jpeg" : "image/png",
        format === "jpg" ? 0.92 : undefined
      );
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      downloadBlob(blob, `${baseName(file.name)}-${dims.w}x${dims.h}.${format}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resize failed.");
    } finally {
      setBusy(false);
    }
  }

  function onWidthChange(v: string) {
    setWidth(v);
    if (keepAspect && img) {
      const w = Number(v);
      if (Number.isFinite(w) && w > 0) {
        setHeight(String(Math.max(1, Math.round((w * img.naturalHeight) / img.naturalWidth))));
      }
    }
  }

  function onHeightChange(v: string) {
    setHeight(v);
    if (keepAspect && img) {
      const h = Number(v);
      if (Number.isFinite(h) && h > 0) {
        setWidth(String(Math.max(1, Math.round((h * img.naturalWidth) / img.naturalHeight))));
      }
    }
  }

  return (
    <ToolPageLayout
      title="Image Resizer"
      description="Resize any image by pixels or percentage — processed entirely in your browser."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone accept="image/*" onFiles={onFiles} />

        {img && file && (
          <>
            <p style={{ fontSize: ".88rem", color: "var(--muted)", marginBottom: "1rem" }}>
              Original: {img.naturalWidth} × {img.naturalHeight} px
            </p>
            <TabGroup
              options={[
                { value: "px", label: "Pixels" },
                { value: "percent", label: "Percentage" },
              ]}
              value={mode}
              onChange={setMode}
            />

            {mode === "px" ? (
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 130 }}>
                  <Field label="Width (px)">
                    <TextInput
                      type="number"
                      min={1}
                      value={width}
                      onChange={(e) => onWidthChange(e.target.value)}
                    />
                  </Field>
                </div>
                <div style={{ flex: 1, minWidth: 130 }}>
                  <Field label="Height (px)">
                    <TextInput
                      type="number"
                      min={1}
                      value={height}
                      onChange={(e) => onHeightChange(e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ) : (
              <Field label="Scale (%)">
                <TextInput
                  type="number"
                  min={1}
                  max={1000}
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                />
              </Field>
            )}

            {mode === "px" && (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  marginBottom: "1.1rem",
                  fontSize: ".9rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={keepAspect}
                  onChange={(e) => setKeepAspect(e.target.checked)}
                />
                Maintain aspect ratio
              </label>
            )}

            <TabGroup
              options={[
                { value: "png", label: "PNG" },
                { value: "jpg", label: "JPG" },
              ]}
              value={format}
              onChange={setFormat}
            />

            <button type="button" className="btn-primary" onClick={resize} disabled={busy}>
              {busy ? "Resizing…" : "Resize & Download"}
            </button>
          </>
        )}

        {error && (
          <p style={{ color: "#b91c1c", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>
        )}

        {resultUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resultUrl}
            alt="Resized preview"
            style={{
              maxWidth: "100%",
              marginTop: "1.3rem",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          />
        )}
      </Card>
    </ToolPageLayout>
  );
}
