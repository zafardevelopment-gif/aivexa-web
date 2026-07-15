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

const CHECKER =
  "repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 0 0 / 20px 20px";

export default function BackgroundColorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [format, setFormat] = useState("png");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function onFiles(files: File[]) {
    setError("");
    try {
      const image = await loadImageFromFile(files[0]);
      setFile(files[0]);
      setImg(image);
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      setOriginalUrl(URL.createObjectURL(files[0]));
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
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [img, color]);

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    try {
      const blob = await canvasToBlob(
        canvas,
        format === "jpg" ? "image/jpeg" : "image/png",
        format === "jpg" ? 0.92 : undefined
      );
      downloadBlob(blob, `${baseName(file.name)}-bg.${format}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    }
  }

  return (
    <ToolPageLayout
      title="Change Image Background Color"
      description="Put a solid color behind a transparent PNG — pick any color, download instantly."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone
          accept="image/png,image/webp,image/gif"
          onFiles={onFiles}
          label="Drop a transparent PNG here, or click to browse"
        />

        {img && originalUrl && (
          <>
            <Field label="Background color">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
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

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: ".82rem", fontWeight: 600, marginBottom: ".4rem" }}>
                  Original (checkerboard = transparent)
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="Original"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: CHECKER,
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: ".82rem", fontWeight: 600, marginBottom: ".4rem" }}>
                  With new background
                </p>
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: "100%",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1.2rem" }}>
              <TabGroup
                options={[
                  { value: "png", label: "PNG" },
                  { value: "jpg", label: "JPG" },
                ]}
                value={format}
                onChange={setFormat}
              />
              <button type="button" className="btn-primary" onClick={download}>
                Download {format.toUpperCase()}
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
