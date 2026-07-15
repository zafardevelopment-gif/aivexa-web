"use client";

import { useEffect, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
  baseName,
} from "@/components/tools/imageUtils";

export default function MemeGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const [fontScale, setFontScale] = useState(10); // % of image width
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

    const size = Math.max(12, Math.round((canvas.width * fontScale) / 100));
    ctx.font = `bold ${size}px Impact, "Arial Black", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = Math.max(2, size / 12);
    ctx.lineJoin = "round";

    const drawLine = (text: string, y: number, baseline: CanvasTextBaseline) => {
      if (!text.trim()) return;
      ctx.textBaseline = baseline;
      const t = text.toUpperCase();
      ctx.strokeText(t, canvas.width / 2, y, canvas.width * 0.94);
      ctx.fillText(t, canvas.width / 2, y, canvas.width * 0.94);
    };

    drawLine(topText, size * 0.35, "top");
    drawLine(bottomText, canvas.height - size * 0.35, "bottom");
  }, [img, topText, bottomText, fontScale]);

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    try {
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, `${baseName(file.name)}-meme.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    }
  }

  return (
    <ToolPageLayout
      title="Meme Generator"
      description="Classic top/bottom text memes with bold white Impact lettering — made in your browser."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone accept="image/*" onFiles={onFiles} />

        {img && (
          <>
            <Field label="Top text">
              <TextInput value={topText} onChange={(e) => setTopText(e.target.value)} />
            </Field>
            <Field label="Bottom text">
              <TextInput
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
              />
            </Field>
            <Field label={`Font size: ${fontScale}% of width`}>
              <input
                type="range"
                min={4}
                max={20}
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                style={{ width: "100%" }}
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
                Download Meme PNG
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
