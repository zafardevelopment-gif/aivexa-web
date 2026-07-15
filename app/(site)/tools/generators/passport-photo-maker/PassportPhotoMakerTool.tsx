"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, SelectInput, ResultRow } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { loadImageFromFile, canvasToBlob, downloadBlob } from "@/components/tools/imageUtils";

type Spec = { label: string; wMm: number; hMm: number };

const specs: Record<string, Spec> = {
  in_35x45: { label: "India Passport (35 x 45 mm)", wMm: 35, hMm: 45 },
  us_visa: { label: "US Visa / Passport (2 x 2 in)", wMm: 50.8, hMm: 50.8 },
  generic_35x45: { label: "Generic 35 x 45 mm", wMm: 35, hMm: 45 },
};

const sheets = {
  a4: { label: "A4 sheet (210 x 297 mm)", wMm: 210, hMm: 297 },
  in_4x6: { label: "4 x 6 in photo sheet", wMm: 101.6, hMm: 152.4 },
};

const MM_TO_PX = 12; // preview scale

export default function PassportPhotoMakerTool() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [specKey, setSpecKey] = useState<keyof typeof specs>("in_35x45");
  const [sheetKey, setSheetKey] = useState<keyof typeof sheets>("a4");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const [busy, setBusy] = useState(false);

  const spec = specs[specKey];
  const aspect = spec.wMm / spec.hMm;
  const boxW = 220;
  const boxH = Math.round(boxW / aspect);

  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  }, [specKey, img]);

  async function onFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    const image = await loadImageFromFile(f);
    setImg(image);
    setImgSrc(URL.createObjectURL(f));
  }

  const imgDrawSize = useMemo(() => {
    if (!img) return { w: 0, h: 0 };
    const coverScale = Math.max(boxW / img.width, boxH / img.height);
    const scale = coverScale * zoom;
    return { w: img.width * scale, h: img.height * scale };
  }, [img, zoom, boxW, boxH]);

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset(clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy));
  }
  function onPointerUp() {
    setDragging(false);
  }

  function clampOffset(x: number, y: number) {
    const maxX = Math.max(0, (imgDrawSize.w - boxW) / 2);
    const maxY = Math.max(0, (imgDrawSize.h - boxH) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
  }

  const renderCropCanvas = useCallback((): HTMLCanvasElement => {
    if (!img) throw new Error("no image");
    const outW = Math.round(spec.wMm * 12);
    const outH = Math.round(spec.hMm * 12);
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d")!;
    const coverScale = Math.max(boxW / img.width, boxH / img.height) * zoom;
    const drawW = img.width * coverScale;
    const drawH = img.height * coverScale;
    const cx = boxW / 2 + offset.x - drawW / 2;
    const cy = boxH / 2 + offset.y - drawH / 2;
    const scaleOut = outW / boxW;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(img, cx * scaleOut, cy * scaleOut, drawW * scaleOut, drawH * scaleOut);
    return canvas;
  }, [img, zoom, offset, boxW, boxH, spec]);

  async function downloadSingle() {
    if (!img || busy) return;
    setBusy(true);
    try {
      const canvas = renderCropCanvas();
      downloadBlob(await canvasToBlob(canvas, "image/jpeg", 0.95), "passport-photo.jpg");
    } finally {
      setBusy(false);
    }
  }

  async function downloadSheet() {
    if (!img || busy) return;
    setBusy(true);
    try {
      const cropped = renderCropCanvas();
      const sheet = sheets[sheetKey];
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: [sheet.wMm, sheet.hMm] });
      const margin = 5;
      const gap = 2;
      const cols = Math.max(1, Math.floor((sheet.wMm - margin * 2 + gap) / (spec.wMm + gap)));
      const rows = Math.max(1, Math.floor((sheet.hMm - margin * 2 + gap) / (spec.hMm + gap)));
      const dataUrl = cropped.toDataURL("image/jpeg", 0.95);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = margin + c * (spec.wMm + gap);
          const y = margin + r * (spec.hMm + gap);
          doc.addImage(dataUrl, "JPEG", x, y, spec.wMm, spec.hMm);
          doc.setDrawColor(180);
          doc.setLineDashPattern([1, 1], 0);
          doc.rect(x, y, spec.wMm, spec.hMm);
        }
      }
      doc.save("passport-photo-sheet.pdf");
    } finally {
      setBusy(false);
    }
  }

  const copiesCount = useMemo(() => {
    const sheet = sheets[sheetKey];
    const margin = 5;
    const gap = 2;
    const cols = Math.max(1, Math.floor((sheet.wMm - margin * 2 + gap) / (spec.wMm + gap)));
    const rows = Math.max(1, Math.floor((sheet.hMm - margin * 2 + gap) / (spec.hMm + gap)));
    return cols * rows;
  }, [sheetKey, spec]);

  return (
    <ToolPageLayout
      title="Passport Photo Maker"
      description="Crop your photo to passport or visa specs and print multiple copies on one sheet. Everything happens locally in your browser."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <Field label="Photo Spec">
          <SelectInput value={specKey} onChange={(e) => setSpecKey(e.target.value as keyof typeof specs)}>
            {Object.entries(specs).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Your Photo">
          <FileDropzone accept="image/*" onFiles={onFiles} label="Upload a clear front-facing photo" />
        </Field>

        {img && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                style={{
                  width: boxW,
                  height: boxH,
                  overflow: "hidden",
                  position: "relative",
                  border: "2px solid var(--indigo)",
                  borderRadius: 6,
                  cursor: dragging ? "grabbing" : "grab",
                  touchAction: "none",
                  background: "#f1f5f9",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute",
                    left: boxW / 2 + offset.x - imgDrawSize.w / 2,
                    top: boxH / 2 + offset.y - imgDrawSize.h / 2,
                    width: imgDrawSize.w,
                    height: imgDrawSize.h,
                    maxWidth: "none",
                    userSelect: "none",
                  }}
                />
              </div>
            </div>

            <Field label={`Zoom (${zoom.toFixed(2)}x)`}>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </Field>
            <p style={{ fontSize: ".82rem", color: "var(--muted)", marginTop: "-.5rem", marginBottom: "1rem" }}>
              Drag the photo inside the box to reposition it.
            </p>

            <Field label="Print Sheet Size">
              <SelectInput value={sheetKey} onChange={(e) => setSheetKey(e.target.value as keyof typeof sheets)}>
                {Object.entries(sheets).map(([k, s]) => (
                  <option key={k} value={k}>
                    {s.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <ResultRow label="Copies per sheet" value={copiesCount} />

            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: "1rem" }}>
              <button type="button" className="btn-primary" disabled={busy} onClick={downloadSheet}>
                {busy ? "Preparing…" : `Download Print Sheet PDF (${copiesCount} copies)`}
              </button>
              <button type="button" className="btn-secondary" disabled={busy} onClick={downloadSingle}>
                Download Single Photo (JPG)
              </button>
            </div>
          </>
        )}

        <p style={{ fontSize: ".8rem", color: "var(--muted-2)", marginTop: "1.2rem" }}>
          This tool only handles size and layout. Please follow your country&apos;s official
          guidelines for background, expression and lighting before submitting your photo.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
