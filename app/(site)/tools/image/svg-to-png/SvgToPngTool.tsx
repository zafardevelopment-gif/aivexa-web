"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TextArea, TabGroup } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { canvasToBlob, downloadBlob, dimsOk } from "@/components/tools/imageUtils";

/** Extract intrinsic aspect ratio / size from SVG markup. */
function svgInfo(markup: string): { w: number; h: number } | null {
  try {
    const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg || doc.querySelector("parsererror")) return null;
    const wAttr = parseFloat(svg.getAttribute("width") ?? "");
    const hAttr = parseFloat(svg.getAttribute("height") ?? "");
    if (Number.isFinite(wAttr) && Number.isFinite(hAttr) && wAttr > 0 && hAttr > 0) {
      return { w: wAttr, h: hAttr };
    }
    const vb = svg.getAttribute("viewBox");
    if (vb) {
      const parts = vb.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        return { w: parts[2], h: parts[3] };
      }
    }
    return { w: 300, h: 150 }; // SVG default intrinsic size
  } catch {
    return null;
  }
}

/** Ensure the SVG has explicit width/height so it rasterizes at full size in all browsers. */
function withExplicitSize(markup: string, w: number, h: number): string {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) return markup;
  if (!svg.getAttribute("viewBox")) {
    const ow = parseFloat(svg.getAttribute("width") ?? "");
    const oh = parseFloat(svg.getAttribute("height") ?? "");
    if (Number.isFinite(ow) && Number.isFinite(oh) && ow > 0 && oh > 0) {
      svg.setAttribute("viewBox", `0 0 ${ow} ${oh}`);
    }
  }
  svg.setAttribute("width", String(w));
  svg.setAttribute("height", String(h));
  return new XMLSerializer().serializeToString(doc);
}

export default function SvgToPngTool() {
  const [source, setSource] = useState("file");
  const [markup, setMarkup] = useState("");
  const [width, setWidth] = useState("1024");
  const [height, setHeight] = useState(""); // empty = auto from aspect ratio
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  function onFiles(files: File[]) {
    setError("");
    const f = files[0];
    if (!f.name.toLowerCase().endsWith(".svg") && f.type !== "image/svg+xml") {
      setError("Please choose an .svg file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setMarkup(String(reader.result));
      setSource("paste"); // show the markup in the textarea for editing
    };
    reader.onerror = () => setError("Could not read the file.");
    reader.readAsText(f);
  }

  async function convert() {
    setError("");
    const info = svgInfo(markup);
    if (!markup.trim() || !info) {
      setError("That does not look like valid SVG markup.");
      return;
    }
    const outW = Math.round(Number(width));
    if (!Number.isFinite(outW) || outW <= 0) {
      setError("Please enter a valid output width.");
      return;
    }
    const outH = height.trim()
      ? Math.round(Number(height))
      : Math.max(1, Math.round((outW * info.h) / info.w));
    if (!dimsOk(outW, outH)) {
      setError("Output dimensions must be between 1 and 16000 px.");
      return;
    }

    setBusy(true);
    let url = "";
    try {
      const sized = withExplicitSize(markup, outW, outH);
      const blob = new Blob([sized], { type: "image/svg+xml;charset=utf-8" });
      url = URL.createObjectURL(blob);
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () =>
          reject(new Error("The browser could not render this SVG (it may reference external resources)."));
        i.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.drawImage(img, 0, 0, outW, outH);
      const png = await canvasToBlob(canvas, "image/png");
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(png));
      downloadBlob(png, `converted-${outW}x${outH}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      if (url) URL.revokeObjectURL(url);
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="SVG to PNG Converter"
      description="Rasterize SVG files or pasted markup to PNG at any size — even viewBox-only SVGs."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <TabGroup
          options={[
            { value: "file", label: "Upload SVG file" },
            { value: "paste", label: "Paste SVG markup" },
          ]}
          value={source}
          onChange={setSource}
        />

        {source === "file" ? (
          <FileDropzone
            accept=".svg,image/svg+xml"
            onFiles={onFiles}
            label="Drop an SVG file here, or click to browse"
          />
        ) : (
          <Field label="SVG markup">
            <TextArea
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              placeholder='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">…</svg>'
              style={{ fontFamily: "monospace", fontSize: ".82rem" }}
            />
          </Field>
        )}

        {markup.trim() && (
          <>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <Field label="Output width (px)">
                  <TextInput
                    type="number"
                    min={1}
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </Field>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <Field label="Height (blank = auto)">
                  <TextInput
                    type="number"
                    min={1}
                    value={height}
                    placeholder="auto"
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </Field>
              </div>
            </div>
            <button type="button" className="btn-primary" onClick={convert} disabled={busy}>
              {busy ? "Converting…" : "Convert & Download PNG"}
            </button>
          </>
        )}

        {error && (
          <p style={{ color: "#b91c1c", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>
        )}

        {resultUrl && (
          <div style={{ marginTop: "1.3rem" }}>
            <p style={{ fontSize: ".85rem", fontWeight: 600, marginBottom: ".4rem" }}>
              PNG preview
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultUrl}
              alt="PNG result"
              style={{
                maxWidth: "100%",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background:
                  "repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 0 0 / 20px 20px",
              }}
            />
          </div>
        )}
      </Card>
    </ToolPageLayout>
  );
}
