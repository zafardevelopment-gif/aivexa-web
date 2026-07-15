"use client";

import { useEffect, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
} from "@/components/tools/imageUtils";

const LAYOUTS = [
  { id: "2x1", cols: 2, rows: 1 },
  { id: "1x2", cols: 1, rows: 2 },
  { id: "2x2", cols: 2, rows: 2 },
  { id: "3x2", cols: 3, rows: 2 },
  { id: "3x3", cols: 3, rows: 3 },
] as const;

const CELL = 500;

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

export default function CollageMakerTool() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [layout, setLayout] = useState("2x2");
  const [spacing, setSpacing] = useState(12);
  const [bg, setBg] = useState("#ffffff");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function onFiles(files: File[]) {
    setError("");
    try {
      const loaded = await Promise.all(files.map(loadImageFromFile));
      setImages((prev) => [...prev, ...loaded].slice(0, 9));
    } catch {
      setError("One or more files could not be read as images.");
    }
  }

  const active = LAYOUTS.find((l) => l.id === layout) ?? LAYOUTS[2];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const { cols, rows } = active;
    canvas.width = cols * CELL + spacing * (cols + 1);
    canvas.height = rows * CELL + spacing * (rows + 1);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols * rows && i < images.length; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      drawCover(
        ctx,
        images[i],
        spacing + c * (CELL + spacing),
        spacing + r * (CELL + spacing),
        CELL,
        CELL
      );
    }
  }, [images, active, spacing, bg]);

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, "collage.png");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    }
  }

  return (
    <ToolPageLayout
      title="Photo Collage Maker"
      description="Combine 2–9 photos into a clean grid collage — all rendered locally."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone
          accept="image/*"
          multiple
          onFiles={onFiles}
          label="Drop 2–9 images here, or click to browse"
        />

        {images.length > 0 && (
          <>
            <p style={{ fontSize: ".88rem", color: "var(--muted)", marginBottom: ".8rem" }}>
              {images.length} image{images.length > 1 ? "s" : ""} added.{" "}
              <button
                type="button"
                className="btn-secondary sm"
                onClick={() => setImages([])}
                style={{ marginLeft: ".4rem" }}
              >
                Clear all
              </button>
            </p>

            <Field label="Layout">
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                {LAYOUTS.map((l) => {
                  const enabled = images.length >= Math.min(2, l.cols * l.rows) &&
                    images.length >= l.cols * l.rows - 2;
                  const activeBtn = l.id === layout;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      className={activeBtn ? "btn-primary sm" : "btn-secondary sm"}
                      disabled={!enabled}
                      style={{ opacity: enabled ? 1 : 0.45 }}
                      onClick={() => setLayout(l.id)}
                    >
                      {l.id} ({l.cols * l.rows})
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label={`Spacing: ${spacing}px`}>
              <input
                type="range"
                min={0}
                max={60}
                value={spacing}
                onChange={(e) => setSpacing(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </Field>

            <Field label="Background color">
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                style={{
                  width: "80px",
                  height: "42px",
                  border: "1px solid var(--border-2)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: "#fff",
                }}
              />
            </Field>

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
                Download Collage PNG
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
