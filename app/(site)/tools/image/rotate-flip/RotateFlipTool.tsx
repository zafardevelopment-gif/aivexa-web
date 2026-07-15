"use client";

import { useEffect, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
  baseName,
} from "@/components/tools/imageUtils";

export default function RotateFlipTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  // rotation in quarter turns (0-3), flips applied before rotation
  const [turns, setTurns] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function onFiles(files: File[]) {
    setError("");
    setTurns(0);
    setFlipH(false);
    setFlipV(false);
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
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const rotated = turns % 2 === 1;
    canvas.width = rotated ? h : w;
    canvas.height = rotated ? w : h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((turns * Math.PI) / 2);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2);
    ctx.restore();
  }, [img, turns, flipH, flipV]);

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    try {
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, `${baseName(file.name)}-rotated.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    }
  }

  const btn = (label: string, onClick: () => void) => (
    <button type="button" className="btn-secondary sm" onClick={onClick}>
      {label}
    </button>
  );

  return (
    <ToolPageLayout
      title="Rotate & Flip Image"
      description="Rotate 90°/180° and mirror your images — operations stack, all in the browser."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone accept="image/*" onFiles={onFiles} />

        {img && (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: ".55rem",
                marginBottom: "1.1rem",
              }}
            >
              {btn("Rotate 90° CW", () => setTurns((t) => (t + 1) % 4))}
              {btn("Rotate 90° CCW", () => setTurns((t) => (t + 3) % 4))}
              {btn("Rotate 180°", () => setTurns((t) => (t + 2) % 4))}
              {btn("Flip Horizontal", () =>
                turns % 2 === 0 ? setFlipH((v) => !v) : setFlipV((v) => !v)
              )}
              {btn("Flip Vertical", () =>
                turns % 2 === 0 ? setFlipV((v) => !v) : setFlipH((v) => !v)
              )}
              {btn("Reset", () => {
                setTurns(0);
                setFlipH(false);
                setFlipV(false);
              })}
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
                Download PNG
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
