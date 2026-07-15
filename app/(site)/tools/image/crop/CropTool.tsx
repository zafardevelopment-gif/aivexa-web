"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, TabGroup } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
  baseName,
} from "@/components/tools/imageUtils";

type Rect = { x: number; y: number; w: number; h: number };

const RATIOS: Record<string, number | null> = {
  free: null,
  "1:1": 1,
  "16:9": 16 / 9,
  "4:3": 4 / 3,
};

export default function CropTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [displayUrl, setDisplayUrl] = useState("");
  const [ratio, setRatio] = useState("free");
  const [rect, setRect] = useState<Rect | null>(null); // in display coords
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{
    mode: "draw" | "move";
    startX: number;
    startY: number;
    orig: Rect | null;
  } | null>(null);

  async function onFiles(files: File[]) {
    setError("");
    setRect(null);
    try {
      const image = await loadImageFromFile(files[0]);
      setFile(files[0]);
      setImg(image);
      if (displayUrl) URL.revokeObjectURL(displayUrl);
      setDisplayUrl(URL.createObjectURL(files[0]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load image.");
    }
  }

  function localPoint(e: ReactPointerEvent): { x: number; y: number } {
    const el = imgRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return {
      x: Math.min(Math.max(e.clientX - r.left, 0), r.width),
      y: Math.min(Math.max(e.clientY - r.top, 0), r.height),
    };
  }

  function constrain(r: Rect): Rect {
    const el = imgRef.current;
    if (!el) return r;
    const maxW = el.getBoundingClientRect().width;
    const maxH = el.getBoundingClientRect().height;
    const ar = RATIOS[ratio];
    let { x, y, w, h } = r;
    if (ar) h = w / ar;
    w = Math.min(w, maxW - x);
    h = Math.min(h, maxH - y);
    if (ar) {
      // keep ratio after clamping
      if (w / h > ar) w = h * ar;
      else h = w / ar;
    }
    return { x, y, w: Math.max(w, 0), h: Math.max(h, 0) };
  }

  function onPointerDown(e: ReactPointerEvent) {
    if (!imgRef.current) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const p = localPoint(e);
    const inside =
      rect &&
      p.x >= rect.x &&
      p.x <= rect.x + rect.w &&
      p.y >= rect.y &&
      p.y <= rect.y + rect.h;
    dragRef.current = {
      mode: inside ? "move" : "draw",
      startX: p.x,
      startY: p.y,
      orig: rect,
    };
    if (!inside) setRect({ x: p.x, y: p.y, w: 0, h: 0 });
  }

  function onPointerMove(e: ReactPointerEvent) {
    const drag = dragRef.current;
    const el = imgRef.current;
    if (!drag || !el) return;
    const p = localPoint(e);
    if (drag.mode === "draw") {
      const x = Math.min(drag.startX, p.x);
      const y = Math.min(drag.startY, p.y);
      const w = Math.abs(p.x - drag.startX);
      const h = Math.abs(p.y - drag.startY);
      setRect(constrain({ x, y, w, h }));
    } else if (drag.orig) {
      const box = el.getBoundingClientRect();
      const nx = Math.min(
        Math.max(drag.orig.x + (p.x - drag.startX), 0),
        box.width - drag.orig.w
      );
      const ny = Math.min(
        Math.max(drag.orig.y + (p.y - drag.startY), 0),
        box.height - drag.orig.h
      );
      setRect({ ...drag.orig, x: nx, y: ny });
    }
  }

  function onPointerUp() {
    dragRef.current = null;
    setRect((r) => (r && (r.w < 5 || r.h < 5) ? null : r));
  }

  async function doCrop() {
    if (!img || !file || !rect || !imgRef.current) return;
    setBusy(true);
    setError("");
    try {
      const disp = imgRef.current.getBoundingClientRect();
      const scaleX = img.naturalWidth / disp.width;
      const scaleY = img.naturalHeight / disp.height;
      const sx = Math.round(rect.x * scaleX);
      const sy = Math.round(rect.y * scaleY);
      const sw = Math.max(1, Math.round(rect.w * scaleX));
      const sh = Math.max(1, Math.round(rect.h * scaleY));
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, `${baseName(file.name)}-cropped.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Crop failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Image Cropper"
      description="Draw a crop box over your image with aspect ratio presets — all in your browser."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone accept="image/*" onFiles={onFiles} />

        {displayUrl && img && (
          <>
            <TabGroup
              options={[
                { value: "free", label: "Free" },
                { value: "1:1", label: "1:1" },
                { value: "16:9", label: "16:9" },
                { value: "4:3", label: "4:3" },
              ]}
              value={ratio}
              onChange={(v) => {
                setRatio(v);
                setRect(null);
              }}
            />
            <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".8rem" }}>
              Drag on the image to draw a crop box. Drag inside the box to move it.
            </p>
            <div
              ref={containerRef}
              style={{
                position: "relative",
                display: "inline-block",
                maxWidth: "100%",
                touchAction: "none",
                userSelect: "none",
                lineHeight: 0,
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={displayUrl}
                alt="Crop preview"
                draggable={false}
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  display: "block",
                }}
              />
              {rect && (
                <div
                  style={{
                    position: "absolute",
                    left: rect.x,
                    top: rect.y,
                    width: rect.w,
                    height: rect.h,
                    border: "2px solid var(--indigo, #4f46e5)",
                    background: "rgba(79,70,229,.15)",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,.35)",
                    cursor: "move",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            <div style={{ marginTop: "1.1rem", display: "flex", gap: ".6rem" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={doCrop}
                disabled={!rect || busy}
              >
                {busy ? "Cropping…" : "Crop & Download PNG"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setRect(null)}
                disabled={!rect}
              >
                Reset Selection
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
