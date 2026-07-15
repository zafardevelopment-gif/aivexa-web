"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, Field, SelectInput } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  openPdfWithPdfJs,
  pdfErrorMessage,
  renderPageToCanvas,
} from "@/lib/pdf-utils";

type PageImage = { page: number; dataUrl: string };

export default function PdfToImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState("2");
  const [format, setFormat] = useState("png");
  const [images, setImages] = useState<PageImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const ext = format === "jpg" ? "jpg" : "png";
  const mime = format === "jpg" ? "image/jpeg" : "image/png";

  async function convert() {
    if (!file) return;
    setError("");
    setImages([]);
    setBusy(true);
    try {
      const pdf = await openPdfWithPdfJs(await file.arrayBuffer());
      const out: PageImage[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Rendering page ${i} of ${pdf.numPages}…`);
        const page = await pdf.getPage(i);
        const canvas = await renderPageToCanvas(page, parseFloat(scale));
        out.push({
          page: i,
          dataUrl: format === "jpg" ? canvas.toDataURL(mime, 0.92) : canvas.toDataURL(mime),
        });
        canvas.width = 0;
        canvas.height = 0;
      }
      await pdf.cleanup();
      setImages(out);
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  function downloadOne(img: PageImage) {
    const byteString = atob(img.dataUrl.split(",")[1]);
    const arr = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) arr[i] = byteString.charCodeAt(i);
    downloadBlob(new Blob([arr], { type: mime }), `${baseName(file?.name ?? "page")}-page-${img.page}.${ext}`);
  }

  async function downloadAll() {
    if (!file || images.length === 0) return;
    setBusy(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const img of images) {
        zip.file(`${baseName(file.name)}-page-${img.page}.${ext}`, img.dataUrl.split(",")[1], {
          base64: true,
        });
      }
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `${baseName(file.name)}-images.zip`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="PDF to Image"
      description="Render every page of a PDF as a JPG or PNG image at the resolution you choose — entirely in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="application/pdf"
          onFiles={(f) => {
            setFile(f[0]);
            setImages([]);
            setError("");
          }}
          label="Drag & drop a PDF here, or click to browse"
        />

        {file && (
          <>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <Field label="Resolution">
                  <SelectInput value={scale} onChange={(e) => setScale(e.target.value)}>
                    <option value="1">1x (72 DPI)</option>
                    <option value="2">2x (144 DPI)</option>
                    <option value="3">3x (216 DPI)</option>
                  </SelectInput>
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="Format">
                  <SelectInput value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                  </SelectInput>
                </Field>
              </div>
            </div>

            <button type="button" className="btn-primary" onClick={convert} disabled={busy}>
              {busy ? progress || "Converting…" : "Convert to Images"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {images.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <button type="button" className="btn-primary" onClick={downloadAll} disabled={busy} style={{ marginBottom: "1.1rem" }}>
              Download all as ZIP ({images.length} images)
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: ".9rem",
              }}
            >
              {images.map((img) => (
                <div
                  key={img.page}
                  style={{
                    border: "1px solid var(--border-2)",
                    borderRadius: "10px",
                    padding: ".5rem",
                    textAlign: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.dataUrl}
                    alt={`Page ${img.page}`}
                    style={{ width: "100%", height: "auto", borderRadius: "6px", marginBottom: ".4rem" }}
                  />
                  <button type="button" className="btn-secondary sm" onClick={() => downloadOne(img)}>
                    Page {img.page} .{ext}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </ToolPageLayout>
  );
}
