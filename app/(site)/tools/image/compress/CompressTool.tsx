"use client";

import { useEffect, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { downloadBlob, formatBytes, baseName } from "@/components/tools/imageUtils";

export default function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const src = result ?? file;
    if (!src) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(src);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, result]);

  async function compress() {
    if (!file) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const { default: imageCompression } = await import("browser-image-compression");
      const out = await imageCompression(file, {
        initialQuality: quality,
        useWebWorker: true,
        maxSizeMB: 50,
      });
      setResult(out);
    } catch {
      setError("Compression failed. Please try a different image file.");
    } finally {
      setBusy(false);
    }
  }

  const reduction =
    file && result ? Math.max(0, (1 - result.size / file.size) * 100) : null;

  return (
    <ToolPageLayout
      title="Image Compressor"
      description="Shrink JPG, PNG and WebP file sizes right in your browser — nothing is uploaded."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone
          accept="image/*"
          onFiles={(files) => {
            const f = files[0];
            if (!f.type.startsWith("image/")) {
              setError("Please choose an image file.");
              return;
            }
            setError("");
            setResult(null);
            setFile(f);
          }}
        />

        {file && (
          <>
            <Field label={`Quality: ${quality.toFixed(2)}`}>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </Field>
            <button
              type="button"
              className="btn-primary"
              onClick={compress}
              disabled={busy}
            >
              {busy ? "Compressing…" : "Compress Image"}
            </button>
          </>
        )}

        {error && (
          <p style={{ color: "#b91c1c", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>
        )}

        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              marginTop: "1.3rem",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          />
        )}

        {file && result && (
          <ResultBox>
            <ResultRow label="Original size" value={formatBytes(file.size)} />
            <ResultRow label="Compressed size" value={formatBytes(result.size)} />
            <ResultRow
              label="Reduction"
              value={reduction !== null ? `${reduction.toFixed(1)}%` : "—"}
            />
            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  downloadBlob(
                    result,
                    `${baseName(file.name)}-compressed.${result.type === "image/png" ? "png" : "jpg"}`
                  )
                }
              >
                Download Compressed Image
              </button>
            </div>
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
