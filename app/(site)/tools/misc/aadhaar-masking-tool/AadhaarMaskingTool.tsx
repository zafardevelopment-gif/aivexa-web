"use client";

import { useRef, useState, useCallback } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { loadImageFromFile, canvasToBlob, downloadBlob } from "@/components/tools/imageUtils";

type Box = { x: number; y: number; w: number; h: number };

export default function AadhaarMaskingTool() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawing, setDrawing] = useState<Box | null>(null);
  const [busy, setBusy] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const startRef = useRef({ x: 0, y: 0 });

  const [dims, setDims] = useState({ w: 0, h: 0 });

  async function onFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    const image = await loadImageFromFile(f);
    setImg(image);
    setImgSrc(URL.createObjectURL(f));
    setBoxes([]);
    const maxW = 640;
    const scale = Math.min(1, maxW / image.width);
    setDims({ w: image.width * scale, h: image.height * scale });
  }

  function getPos(e: React.PointerEvent) {
    const rect = wrapRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e: React.PointerEvent) {
    const p = getPos(e);
    startRef.current = p;
    setDrawing({ x: p.x, y: p.y, w: 0, h: 0 });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drawing) return;
    const p = getPos(e);
    const x = Math.min(startRef.current.x, p.x);
    const y = Math.min(startRef.current.y, p.y);
    const w = Math.abs(p.x - startRef.current.x);
    const h = Math.abs(p.y - startRef.current.y);
    setDrawing({ x, y, w, h });
  }
  function onPointerUp() {
    if (drawing && drawing.w > 6 && drawing.h > 6) {
      setBoxes((b) => [...b, drawing]);
    }
    setDrawing(null);
  }

  function undoLast() {
    setBoxes((b) => b.slice(0, -1));
  }
  function clearAll() {
    setBoxes([]);
  }

  const renderMasked = useCallback((): HTMLCanvasElement => {
    if (!img) throw new Error("no image");
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const scaleX = img.width / dims.w;
    const scaleY = img.height / dims.h;
    ctx.fillStyle = "#000";
    for (const b of boxes) {
      ctx.fillRect(b.x * scaleX, b.y * scaleY, b.w * scaleX, b.h * scaleY);
    }
    return canvas;
  }, [img, boxes, dims]);

  async function download() {
    if (!img || boxes.length === 0 || busy) return;
    setBusy(true);
    try {
      const canvas = renderMasked();
      downloadBlob(await canvasToBlob(canvas, "image/jpeg", 0.95), "aadhaar-masked.jpg");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Aadhaar Masking Tool"
      description="Draw a box over the Aadhaar number to mask it before sharing for KYC. Your image never leaves your browser."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <p
          style={{
            fontSize: ".85rem",
            background: "var(--indigo-light)",
            border: "1px solid #e0e7ff",
            borderRadius: 10,
            padding: ".8rem 1rem",
            marginBottom: "1.2rem",
          }}
        >
          Your Aadhaar image never leaves your device — masking happens entirely in your browser.
          This tool does not use OCR or auto-detection; draw a box over the first 8 digits of the
          Aadhaar number yourself. Masked Aadhaar (showing only the last 4 digits) is accepted for
          most KYC purposes per UIDAI guidance — please confirm with the requesting party.
        </p>

        {!img && (
          <FileDropzone accept="image/*" onFiles={onFiles} label="Upload your Aadhaar card image (front side)" />
        )}

        {img && (
          <>
            <div
              ref={wrapRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              style={{
                position: "relative",
                width: dims.w,
                height: dims.h,
                maxWidth: "100%",
                margin: "0 auto",
                touchAction: "none",
                cursor: "crosshair",
                border: "1px solid var(--border)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt="Uploaded Aadhaar"
                draggable={false}
                style={{ width: dims.w, height: dims.h, display: "block", userSelect: "none" }}
              />
              {boxes.map((b, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: b.x,
                    top: b.y,
                    width: b.w,
                    height: b.h,
                    background: "#000",
                  }}
                />
              ))}
              {drawing && (
                <div
                  style={{
                    position: "absolute",
                    left: drawing.x,
                    top: drawing.y,
                    width: drawing.w,
                    height: drawing.h,
                    background: "rgba(0,0,0,.5)",
                    border: "1px dashed #fff",
                  }}
                />
              )}
            </div>
            <p style={{ fontSize: ".82rem", color: "var(--muted)", textAlign: "center", marginTop: ".6rem" }}>
              Click and drag over the image to draw a black mask box.
            </p>

            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: "1rem", justifyContent: "center" }}>
              <button type="button" className="btn-secondary sm" onClick={undoLast} disabled={boxes.length === 0}>
                Undo last box
              </button>
              <button type="button" className="btn-secondary sm" onClick={clearAll} disabled={boxes.length === 0}>
                Clear all
              </button>
              <button type="button" className="btn-secondary sm" onClick={() => setImg(null)}>
                Upload different image
              </button>
              <button type="button" className="btn-primary" disabled={boxes.length === 0 || busy} onClick={download}>
                {busy ? "Preparing…" : "Download Masked Image"}
              </button>
            </div>
          </>
        )}
      </Card>
    </ToolPageLayout>
  );
}
