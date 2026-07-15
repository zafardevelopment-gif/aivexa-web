"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
} from "@/components/tools/imageUtils";

const SIZES = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192x192.png" },
  { size: 512, name: "android-chrome-512x512.png" },
];

const README = `Favicon set generated with AIVEXA Free Tools (https://aivexa.com/tools)

Copy the PNG files to your site root, then paste this into your <head>:

<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
`;

export default function FaviconGeneratorTool() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  async function onFiles(files: File[]) {
    setError("");
    setWarning("");
    try {
      const image = await loadImageFromFile(files[0]);
      setImg(image);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(files[0]));
      const ratio = image.naturalWidth / image.naturalHeight;
      if (ratio < 0.8 || ratio > 1.25) {
        setWarning(
          "Tip: your image is not square — it will be center-cropped to a square for the icons."
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load image.");
    }
  }

  async function generate() {
    if (!img) return;
    setBusy(true);
    setError("");
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      // center-crop to square source region
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;

      for (const { size, name } of SIZES) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is not supported in this browser.");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        const blob = await canvasToBlob(canvas, "image/png");
        zip.file(name, blob);
      }
      zip.file("readme.txt", README);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "favicons.zip");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate the favicon set.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Favicon Generator"
      description="Turn any image into a full favicon set (16px–512px) zipped with an HTML snippet."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone
          accept="image/*"
          onFiles={onFiles}
          label="Drop a square-ish logo or image here, or click to browse"
        />

        {warning && (
          <p style={{ color: "#9a3412", fontSize: ".88rem", marginBottom: ".8rem" }}>
            {warning}
          </p>
        )}

        {previewUrl && (
          <>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "flex-end",
                marginBottom: "1.2rem",
                flexWrap: "wrap",
              }}
            >
              {[16, 32, 48, 64].map((s) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={s}
                  src={previewUrl}
                  alt={`${s}px preview`}
                  width={s}
                  height={s}
                  style={{
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
              <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>
                Small-size previews
              </span>
            </div>
            <button type="button" className="btn-primary" onClick={generate} disabled={busy}>
              {busy ? "Generating…" : "Generate & Download ZIP"}
            </button>
            <p style={{ fontSize: ".82rem", color: "var(--muted)", marginTop: ".7rem" }}>
              Includes 16, 32, 48, 180 (apple-touch-icon), 192 and 512 px PNGs plus a
              readme.txt with the HTML snippet.
            </p>
          </>
        )}

        {error && (
          <p style={{ color: "#b91c1c", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
