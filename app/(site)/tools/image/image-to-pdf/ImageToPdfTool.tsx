"use client";

import { useEffect, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { loadImageFromFile, formatBytes } from "@/components/tools/imageUtils";

type Item = { id: number; file: File; url: string };

let nextId = 1;

export default function ImageToPdfTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFiles(files: File[]) {
    setError("");
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) {
      setError("Please choose image files (JPG, PNG, WebP…).");
      return;
    }
    setItems((prev) => [
      ...prev,
      ...imgs.map((f) => ({ id: nextId++, file: f, url: URL.createObjectURL(f) })),
    ]);
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }

  function remove(id: number) {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it) URL.revokeObjectURL(it.url);
      return prev.filter((x) => x.id !== id);
    });
  }

  async function generate() {
    if (items.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = 210;
      const pageH = 297;
      const margin = 10;

      for (let i = 0; i < items.length; i++) {
        const img = await loadImageFromFile(items[i].file);
        // normalize via canvas so any browser-supported format works
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is not supported in this browser.");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

        if (i > 0) pdf.addPage();
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2;
        const scale = Math.min(availW / canvas.width, availH / canvas.height);
        const w = canvas.width * scale;
        const h = canvas.height * scale;
        pdf.addImage(dataUrl, "JPEG", (pageW - w) / 2, (pageH - h) / 2, w, h);
      }

      pdf.save("images.pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate the PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Image to PDF"
      description="Combine multiple images into one A4 PDF — reorder pages, fit-to-page, all local."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone
          accept="image/*"
          multiple
          onFiles={onFiles}
          label="Drop images here (multiple allowed), or click to browse"
        />

        {items.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {items.map((it, i) => (
                <div
                  key={it.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".8rem",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: ".5rem .7rem",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.url}
                    alt={it.file.name}
                    style={{
                      width: 52,
                      height: 52,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: ".88rem",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {i + 1}. {it.file.name}
                    </div>
                    <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                      {formatBytes(it.file.size)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary sm"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    className="btn-secondary sm"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label="Move down"
                  >
                    &darr;
                  </button>
                  <button
                    type="button"
                    className="btn-secondary sm"
                    onClick={() => remove(it.id)}
                    aria-label="Remove"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.2rem" }}>
              <button type="button" className="btn-primary" onClick={generate} disabled={busy}>
                {busy ? "Building PDF…" : `Generate PDF (${items.length} page${items.length > 1 ? "s" : ""})`}
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
