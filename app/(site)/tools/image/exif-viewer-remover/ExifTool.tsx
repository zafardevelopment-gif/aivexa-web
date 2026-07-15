"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, ResultBox } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
  baseName,
  formatBytes,
} from "@/components/tools/imageUtils";

type Row = { label: string; value: string; sensitive?: boolean };

function fmt(v: unknown): string {
  if (v == null) return "";
  if (v instanceof Date) return v.toLocaleString();
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(4);
  return String(v);
}

export default function ExifTool() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [hasGps, setHasGps] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  async function onFiles(files: File[]) {
    const f = files[0];
    setError("");
    setRows(null);
    setHasGps(false);
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (JPG works best for EXIF data).");
      return;
    }
    setFile(f);
    setBusy(true);
    try {
      const exifr = (await import("exifr")).default;
      const data = (await exifr.parse(f, {
        gps: true,
        tiff: true,
        exif: true,
      })) as Record<string, unknown> | undefined;

      const out: Row[] = [];
      const add = (label: string, key: string) => {
        if (data && data[key] != null) out.push({ label, value: fmt(data[key]) });
      };
      add("Camera make", "Make");
      add("Camera model", "Model");
      add("Lens", "LensModel");
      add("Date taken", "DateTimeOriginal");
      add("Exposure time", "ExposureTime");
      add("F-number", "FNumber");
      add("ISO", "ISO");
      add("Focal length", "FocalLength");
      add("Software", "Software");
      add("Orientation", "Orientation");
      add("Image width", "ExifImageWidth");
      add("Image height", "ExifImageHeight");

      const lat = data?.latitude as number | undefined;
      const lon = data?.longitude as number | undefined;
      if (typeof lat === "number" && typeof lon === "number") {
        out.push({
          label: "GPS location",
          value: `${lat.toFixed(6)}, ${lon.toFixed(6)} (privacy-sensitive!)`,
          sensitive: true,
        });
        setHasGps(true);
      }

      setRows(out);
    } catch {
      setRows([]);
    } finally {
      setBusy(false);
    }
  }

  async function downloadCleaned() {
    if (!file) return;
    setCleaning(true);
    setError("");
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      const isJpeg = file.type === "image/jpeg";
      if (isJpeg) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(
        canvas,
        isJpeg ? "image/jpeg" : "image/png",
        isJpeg ? 0.95 : undefined
      );
      downloadBlob(blob, `${baseName(file.name)}-clean.${isJpeg ? "jpg" : "png"}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create a cleaned copy.");
    } finally {
      setCleaning(false);
    }
  }

  return (
    <ToolPageLayout
      title="EXIF Viewer & Remover"
      description="See what hidden metadata your photos carry — and download a copy with it all removed."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone
          accept="image/jpeg,image/tiff,image/png,image/heic"
          onFiles={onFiles}
          label="Drop a JPG photo here, or click to browse"
        />

        {busy && <p style={{ fontSize: ".9rem", color: "var(--muted)" }}>Reading metadata…</p>}

        {rows !== null && file && !busy && (
          <>
            {rows.length === 0 ? (
              <p style={{ fontSize: ".92rem", marginTop: ".5rem" }}>
                No EXIF metadata found in <strong>{file.name}</strong> — either it was
                already stripped, or the format does not carry EXIF.
              </p>
            ) : (
              <>
                {hasGps && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                      borderRadius: 10,
                      padding: ".8rem 1rem",
                      fontSize: ".88rem",
                      fontWeight: 600,
                      marginBottom: "1rem",
                    }}
                  >
                    This photo contains GPS coordinates — anyone you share it with can see
                    exactly where it was taken. Consider downloading the cleaned copy below.
                  </div>
                )}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.label} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: ".5rem .4rem", color: "var(--muted)", width: "40%" }}>
                            {r.label}
                          </td>
                          <td
                            style={{
                              padding: ".5rem .4rem",
                              fontWeight: 600,
                              color: r.sensitive ? "#b91c1c" : "inherit",
                            }}
                          >
                            {r.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <ResultBox>
              <p style={{ fontSize: ".9rem", marginBottom: ".8rem" }}>
                <strong>Download a cleaned copy</strong> ({formatBytes(file.size)} original).
                The image is re-encoded through a canvas, which strips ALL metadata (EXIF,
                GPS, thumbnails). Note: re-encoding slightly re-compresses the image.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={downloadCleaned}
                disabled={cleaning}
              >
                {cleaning ? "Cleaning…" : "Download Cleaned Copy"}
              </button>
            </ResultBox>
          </>
        )}

        {error && (
          <p style={{ color: "#b91c1c", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
