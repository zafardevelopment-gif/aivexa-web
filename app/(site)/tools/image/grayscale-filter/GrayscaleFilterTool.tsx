"use client";

import { useEffect, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TabGroup } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
  baseName,
} from "@/components/tools/imageUtils";

type Preset = "none" | "grayscale" | "sepia" | "bw" | "invert";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "none", label: "None" },
  { value: "grayscale", label: "Grayscale" },
  { value: "sepia", label: "Sepia" },
  { value: "bw", label: "High Contrast B&W" },
  { value: "invert", label: "Invert" },
];

function filterFor(preset: Preset, brightness: number): string {
  const b = `brightness(${brightness}%)`;
  switch (preset) {
    case "grayscale":
      return `grayscale(100%) ${b}`;
    case "sepia":
      return `sepia(100%) ${b}`;
    case "bw":
      return `grayscale(100%) contrast(180%) ${b}`;
    case "invert":
      return `invert(100%) ${b}`;
    default:
      return b;
  }
}

export default function GrayscaleFilterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [preset, setPreset] = useState<Preset>("grayscale");
  const [brightness, setBrightness] = useState(100);
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function onFiles(files: File[]) {
    setError("");
    setShowOriginal(false);
    try {
      const image = await loadImageFromFile(files[0]);
      setFile(files[0]);
      setImg(image);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load image.");
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = showOriginal ? "none" : filterFor(preset, brightness);
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";
  }, [img, preset, brightness, showOriginal]);

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    try {
      // ensure the filtered version is what we export
      setShowOriginal(false);
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, `${baseName(file.name)}-${preset}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    }
  }

  return (
    <ToolPageLayout
      title="Grayscale & Photo Filters"
      description="One-click grayscale, sepia, high-contrast B&W and invert filters with brightness control."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone accept="image/*" onFiles={onFiles} />

        {img && (
          <>
            <TabGroup
              options={PRESETS.map((p) => ({ value: p.value, label: p.label }))}
              value={preset}
              onChange={(v) => {
                setPreset(v as Preset);
                setShowOriginal(false);
              }}
            />

            <Field label={`Brightness: ${brightness}%`}>
              <input
                type="range"
                min={30}
                max={200}
                value={brightness}
                onChange={(e) => {
                  setBrightness(Number(e.target.value));
                  setShowOriginal(false);
                }}
                style={{ width: "100%" }}
              />
            </Field>

            <div style={{ marginBottom: ".8rem" }}>
              <button
                type="button"
                className="btn-secondary sm"
                onClick={() => setShowOriginal((v) => !v)}
              >
                {showOriginal ? "Show Filtered" : "Show Original"}
              </button>
              <span style={{ fontSize: ".82rem", color: "var(--muted)", marginLeft: ".6rem" }}>
                Currently showing: {showOriginal ? "original" : "filtered"}
              </span>
            </div>

            <canvas
              ref={canvasRef}
              style={{
                maxWidth: "100%",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                marginBottom: "1.1rem",
              }}
            />
            <div>
              <button type="button" className="btn-primary" onClick={download}>
                Download Filtered PNG
              </button>
            </div>
          </>
        )}

        {error && (
          <p style={{ color: "#b91c1c", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
