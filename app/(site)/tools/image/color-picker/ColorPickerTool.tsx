"use client";

import { useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, ResultBox, ResultRow, CopyButton } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { loadImageFromFile } from "@/components/tools/imageUtils";

type Picked = { hex: string; rgb: string; hsl: string };

function toHex(r: number, g: number, b: number): string {
  return (
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

function toHsl(r: number, g: number, b: number): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorPickerTool() {
  const [displayUrl, setDisplayUrl] = useState("");
  const [picked, setPicked] = useState<Picked | null>(null);
  const [history, setHistory] = useState<Picked[]>([]);
  const [error, setError] = useState("");
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgElRef = useRef<HTMLImageElement>(null);

  async function onFiles(files: File[]) {
    setError("");
    setPicked(null);
    try {
      const image = await loadImageFromFile(files[0]);
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.drawImage(image, 0, 0);
      hiddenCanvasRef.current = canvas;
      if (displayUrl) URL.revokeObjectURL(displayUrl);
      setDisplayUrl(URL.createObjectURL(files[0]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load image.");
    }
  }

  function onClick(e: ReactMouseEvent<HTMLImageElement>) {
    const canvas = hiddenCanvasRef.current;
    const el = imgElRef.current;
    if (!canvas || !el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const px = Math.min(Math.max(x, 0), canvas.width - 1);
    const py = Math.min(Math.max(y, 0), canvas.height - 1);
    const [r, g, b] = ctx.getImageData(px, py, 1, 1).data;
    const p: Picked = {
      hex: toHex(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: toHsl(r, g, b),
    };
    setPicked(p);
    setHistory((h) => [p, ...h.filter((x2) => x2.hex !== p.hex)].slice(0, 8));
  }

  return (
    <ToolPageLayout
      title="Image Color Picker"
      description="Click any pixel to get its HEX, RGB and HSL — with a history of your recent picks."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone accept="image/*" onFiles={onFiles} />

        {displayUrl && (
          <>
            <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".6rem" }}>
              Click anywhere on the image to pick a color.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgElRef}
              src={displayUrl}
              alt="Pick a color"
              onClick={onClick}
              style={{
                maxWidth: "100%",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                cursor: "crosshair",
                display: "block",
              }}
            />
          </>
        )}

        {picked && (
          <ResultBox>
            <div
              style={{
                width: "100%",
                height: 48,
                background: picked.hex,
                borderRadius: 8,
                border: "1px solid var(--border)",
                marginBottom: ".8rem",
              }}
            />
            <ResultRow
              label="HEX"
              value={
                <span style={{ display: "inline-flex", gap: ".5rem", alignItems: "center" }}>
                  {picked.hex} <CopyButton text={picked.hex} />
                </span>
              }
            />
            <ResultRow
              label="RGB"
              value={
                <span style={{ display: "inline-flex", gap: ".5rem", alignItems: "center" }}>
                  {picked.rgb} <CopyButton text={picked.rgb} />
                </span>
              }
            />
            <ResultRow
              label="HSL"
              value={
                <span style={{ display: "inline-flex", gap: ".5rem", alignItems: "center" }}>
                  {picked.hsl} <CopyButton text={picked.hsl} />
                </span>
              }
            />
          </ResultBox>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: "1.2rem" }}>
            <p style={{ fontSize: ".85rem", fontWeight: 600, marginBottom: ".5rem" }}>
              Recent picks
            </p>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              {history.map((h, i) => (
                <button
                  key={`${h.hex}-${i}`}
                  type="button"
                  title={h.hex}
                  onClick={() => setPicked(h)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: h.hex,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <p style={{ color: "#b91c1c", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
