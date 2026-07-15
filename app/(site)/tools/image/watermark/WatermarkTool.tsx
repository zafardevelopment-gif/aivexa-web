"use client";

import { useEffect, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, SelectInput } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
  baseName,
} from "@/components/tools/imageUtils";

type Position =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "tiled";

export default function WatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("© AIVEXA");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<Position>("bottom-right");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function onFiles(files: File[]) {
    setError("");
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
    ctx.drawImage(img, 0, 0);
    if (!text.trim()) return;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(0,0,0,.55)";
    ctx.lineWidth = Math.max(1, fontSize / 20);
    const pad = Math.round(fontSize * 0.6);
    const metrics = ctx.measureText(text);
    const tw = metrics.width;
    const th = fontSize;

    const draw = (x: number, y: number) => {
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    };

    ctx.textBaseline = "alphabetic";
    if (position === "tiled") {
      const stepX = tw + fontSize * 3;
      const stepY = th * 4;
      ctx.rotate((-20 * Math.PI) / 180);
      for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          draw(x, y);
        }
      }
    } else if (position === "center") {
      draw((canvas.width - tw) / 2, (canvas.height + th * 0.35) / 2);
    } else if (position === "top-left") {
      draw(pad, pad + th);
    } else if (position === "top-right") {
      draw(canvas.width - tw - pad, pad + th);
    } else if (position === "bottom-left") {
      draw(pad, canvas.height - pad);
    } else {
      draw(canvas.width - tw - pad, canvas.height - pad);
    }
    ctx.restore();
  }, [img, text, fontSize, opacity, position]);

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    try {
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, `${baseName(file.name)}-watermarked.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    }
  }

  return (
    <ToolPageLayout
      title="Add Watermark to Image"
      description="Stamp a text watermark on your photos — position, size and opacity are up to you."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone accept="image/*" onFiles={onFiles} />

        {img && (
          <>
            <Field label="Watermark text">
              <TextInput value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
            <Field label={`Font size: ${fontSize}px`}>
              <input
                type="range"
                min={10}
                max={200}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </Field>
            <Field label={`Opacity: ${Math.round(opacity * 100)}%`}>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </Field>
            <Field label="Position">
              <SelectInput
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
              >
                <option value="center">Center</option>
                <option value="top-left">Top left</option>
                <option value="top-right">Top right</option>
                <option value="bottom-left">Bottom left</option>
                <option value="bottom-right">Bottom right</option>
                <option value="tiled">Tiled (repeated)</option>
              </SelectInput>
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
                Download Watermarked PNG
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
