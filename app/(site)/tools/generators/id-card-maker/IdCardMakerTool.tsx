"use client";

import { useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { canvasToBlob, downloadBlob } from "@/components/tools/imageUtils";

// CR80 portrait: 53.98 x 85.6 mm
const CARD_W_MM = 53.98;
const CARD_H_MM = 85.6;

export default function IdCardMakerTool() {
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [idNo, setIdNo] = useState("");
  const [validity, setValidity] = useState("");
  const [color, setColor] = useState("#4f46e5");
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const canExport = org.trim() !== "" && name.trim() !== "";
  const validityStr = validity
    ? new Date(validity + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  function onPhoto(files: File[]) {
    const f = files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result as string);
    r.readAsDataURL(f);
  }

  async function renderCanvas(): Promise<HTMLCanvasElement> {
    const el = cardRef.current;
    if (!el) throw new Error("no preview");
    const html2canvas = (await import("html2canvas")).default;
    // ~600 DPI equivalent width for crisp print (CR80 ≈ 2.125in → 1275px)
    return html2canvas(el, { scale: 1275 / el.offsetWidth, backgroundColor: null });
  }

  async function exportPdf() {
    if (!canExport || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: [CARD_W_MM, CARD_H_MM] });
      doc.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, CARD_W_MM, CARD_H_MM);
      doc.save("id-card.pdf");
    } finally {
      setBusy(false);
    }
  }

  async function exportPng() {
    if (!canExport || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      downloadBlob(await canvasToBlob(canvas, "image/png"), "id-card.png");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="ID Card Maker"
      description="Create an employee or student ID card with a live preview, then download a print-sized PDF (CR80) or PNG. All processing happens locally."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1rem" }}>
          <Field label="Organization / School Name *">
            <TextInput value={org} placeholder="e.g. Sunrise Public School" onChange={(e) => setOrg(e.target.value)} />
          </Field>
          <Field label="Person Name *">
            <TextInput value={name} placeholder="e.g. Arjun Mehta" onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Designation / Class">
            <TextInput value={designation} placeholder="e.g. Class 9-B / Sales Executive" onChange={(e) => setDesignation(e.target.value)} />
          </Field>
          <Field label="ID Number">
            <TextInput value={idNo} placeholder="e.g. EMP-0042" onChange={(e) => setIdNo(e.target.value)} />
          </Field>
          <Field label="Valid Till">
            <TextInput type="date" value={validity} onChange={(e) => setValidity(e.target.value)} />
          </Field>
          <Field label="Organization Color">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: "100%", height: 42, border: "1px solid var(--border-2)", borderRadius: 10, cursor: "pointer", background: "#fff" }}
            />
          </Field>
        </div>
        <Field label="Photo">
          <FileDropzone accept="image/*" onFiles={onPhoto} label="Upload a photo (JPG/PNG)" />
        </Field>
        {photo && (
          <button type="button" className="btn-secondary sm" style={{ marginBottom: "1rem" }} onClick={() => setPhoto(null)}>
            Remove photo
          </button>
        )}

        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
          <button type="button" className="btn-primary" disabled={!canExport || busy} style={{ opacity: !canExport || busy ? 0.5 : 1 }} onClick={exportPdf}>
            {busy ? "Exporting…" : "Download PDF (print size)"}
          </button>
          <button type="button" className="btn-secondary" disabled={!canExport || busy} style={{ opacity: !canExport || busy ? 0.5 : 1 }} onClick={exportPng}>
            Download PNG
          </button>
        </div>
        {!canExport && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Enter the organization and person name to enable export.
          </p>
        )}
      </Card>

      <div style={{ marginTop: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Live Preview</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              ref={cardRef}
              style={{
                width: 240,
                aspectRatio: `${CARD_W_MM} / ${CARD_H_MM}`,
                background: "#ffffff",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 18px rgba(0,0,0,.18)",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              <div style={{ background: color, color: "#fff", padding: "12px 10px 26px", textAlign: "center", position: "relative" }}>
                <div style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.25, letterSpacing: ".03em", textTransform: "uppercase" }}>
                  {org.trim() || "Organization Name"}
                </div>
                <div style={{ fontSize: 8.5, opacity: 0.85, marginTop: 2, letterSpacing: ".18em" }}>IDENTITY CARD</div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: -20 }}>
                <div
                  style={{
                    width: 76,
                    height: 92,
                    background: "#e5e7eb",
                    border: `3px solid ${color}`,
                    borderRadius: 8,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt="ID" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 9, color: "#9ca3af" }}>PHOTO</span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "8px 10px 0", flexGrow: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#111" }}>{name.trim() || "Person Name"}</div>
                {designation.trim() && <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{designation}</div>}
                <div style={{ margin: "8px auto 0", width: "80%", borderTop: "1px solid #e5e7eb", paddingTop: 7, fontSize: 9.5, color: "#333", textAlign: "left" }}>
                  {idNo.trim() && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ color: "#777" }}>ID No.</span>
                      <strong>{idNo}</strong>
                    </div>
                  )}
                  {validityStr && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#777" }}>Valid till</span>
                      <strong>{validityStr}</strong>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ background: color, height: 12 }} />
            </div>
          </div>
        </Card>
      </div>
    </ToolPageLayout>
  );
}
