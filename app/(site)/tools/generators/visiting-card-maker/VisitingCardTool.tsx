"use client";

import { useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TabGroup } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { canvasToBlob, downloadBlob } from "@/components/tools/imageUtils";

// Standard card: 3.5 x 2 in = 88.9 x 50.8 mm
const CARD_W_MM = 88.9;
const CARD_H_MM = 50.8;

export default function VisitingCardTool() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [accent, setAccent] = useState("#4f46e5");
  const [logo, setLogo] = useState<string | null>(null);
  const [template, setTemplate] = useState("bold");
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const canExport = name.trim() !== "" && (phone.trim() !== "" || email.trim() !== "");

  function onLogo(files: File[]) {
    const f = files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setLogo(r.result as string);
    r.readAsDataURL(f);
  }

  async function renderCanvas(): Promise<HTMLCanvasElement> {
    const el = cardRef.current;
    if (!el) throw new Error("no preview");
    const html2canvas = (await import("html2canvas")).default;
    // 3.5in at 300dpi = 1050px
    return html2canvas(el, { scale: 1050 / el.offsetWidth, backgroundColor: "#ffffff" });
  }

  async function exportPng() {
    if (!canExport || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      downloadBlob(await canvasToBlob(canvas, "image/png"), "visiting-card.png");
    } finally {
      setBusy(false);
    }
  }

  async function exportPdfSheet() {
    if (!canExport || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      const img = canvas.toDataURL("image/jpeg", 0.95);
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const cols = 2;
      const rows = 5;
      const gap = 6;
      const gridW = cols * CARD_W_MM + (cols - 1) * gap;
      const gridH = rows * CARD_H_MM + (rows - 1) * gap;
      const startX = (210 - gridW) / 2;
      const startY = (297 - gridH) / 2;
      doc.setDrawColor(190, 190, 190);
      doc.setLineWidth(0.15);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * (CARD_W_MM + gap);
          const y = startY + r * (CARD_H_MM + gap);
          doc.addImage(img, "JPEG", x, y, CARD_W_MM, CARD_H_MM);
          doc.rect(x, y, CARD_W_MM, CARD_H_MM); // cut line
        }
      }
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text("Cut along the borders — standard 3.5in x 2in cards", 105, startY - 4, { align: "center" });
      doc.save("visiting-cards-a4.pdf");
    } finally {
      setBusy(false);
    }
  }

  const contactRow = (icon: string, value: string) =>
    value.trim() ? (
      <div style={{ display: "flex", gap: 6, alignItems: "baseline", fontSize: 9.5, marginBottom: 3 }}>
        <span style={{ color: accent, fontWeight: 700, width: 12, flexShrink: 0 }}>{icon}</span>
        <span>{value}</span>
      </div>
    ) : null;

  const bold = template === "bold";

  return (
    <ToolPageLayout
      title="Visiting Card Maker"
      description="Design a business card, preview it live, and download a single PNG or an A4 print sheet PDF with 10 cards and cut lines. Free and private."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1rem" }}>
          <Field label="Name *">
            <TextInput value={name} placeholder="e.g. Vikram Joshi" onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Title / Role">
            <TextInput value={title} placeholder="e.g. Founder & CEO" onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Company">
            <TextInput value={company} placeholder="e.g. Joshi Interiors" onChange={(e) => setCompany(e.target.value)} />
          </Field>
          <Field label="Phone">
            <TextInput value={phone} placeholder="+91 98765 43210" onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={email} placeholder="you@company.com" onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Website">
            <TextInput value={website} placeholder="www.company.com" onChange={(e) => setWebsite(e.target.value)} />
          </Field>
          <Field label="Address">
            <TextInput value={address} placeholder="e.g. MG Road, Pune" onChange={(e) => setAddress(e.target.value)} />
          </Field>
          <Field label="Accent Color">
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              style={{ width: "100%", height: 42, border: "1px solid var(--border-2)", borderRadius: 10, cursor: "pointer", background: "#fff" }}
            />
          </Field>
        </div>
        <Field label="Logo (optional)">
          <FileDropzone accept="image/*" onFiles={onLogo} label="Upload a logo (PNG/JPG)" />
        </Field>
        {logo && (
          <button type="button" className="btn-secondary sm" style={{ marginBottom: "1rem" }} onClick={() => setLogo(null)}>
            Remove logo
          </button>
        )}

        <Field label="Layout">
          <TabGroup
            options={[
              { value: "bold", label: "Bold sidebar" },
              { value: "minimal", label: "Minimal" },
            ]}
            value={template}
            onChange={setTemplate}
          />
        </Field>

        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
          <button type="button" className="btn-primary" disabled={!canExport || busy} style={{ opacity: !canExport || busy ? 0.5 : 1 }} onClick={exportPdfSheet}>
            {busy ? "Exporting…" : "Download A4 sheet PDF (10 cards)"}
          </button>
          <button type="button" className="btn-secondary" disabled={!canExport || busy} style={{ opacity: !canExport || busy ? 0.5 : 1 }} onClick={exportPng}>
            Download single PNG
          </button>
        </div>
        {!canExport && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Enter a name and at least one contact (phone or email).
          </p>
        )}
      </Card>

      <div style={{ marginTop: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Live Preview (3.5in × 2in)</h3>
          <div style={{ display: "flex", justifyContent: "center", overflowX: "auto" }}>
            <div
              ref={cardRef}
              style={{
                width: 340,
                aspectRatio: `${CARD_W_MM} / ${CARD_H_MM}`,
                background: "#fff",
                boxShadow: "0 4px 18px rgba(0,0,0,.15)",
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
                fontFamily: "Arial, Helvetica, sans-serif",
                color: "#1f2937",
              }}
            >
              {bold ? (
                <>
                  <div
                    style={{
                      width: "34%",
                      background: accent,
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                      textAlign: "center",
                    }}
                  >
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt="Logo" style={{ maxWidth: "80%", maxHeight: 46, objectFit: "contain", marginBottom: 6 }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.25)", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>
                        {(company.trim() || name.trim() || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    {company.trim() && <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.25 }}>{company}</div>}
                  </div>
                  <div style={{ flexGrow: 1, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>{name.trim() || "Your Name"}</div>
                    {title.trim() && <div style={{ fontSize: 10, color: accent, fontWeight: 700, marginBottom: 6 }}>{title}</div>}
                    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 6 }}>
                      {contactRow("T", phone)}
                      {contactRow("E", email)}
                      {contactRow("W", website)}
                      {contactRow("A", address)}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ flexGrow: 1, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#111", letterSpacing: ".01em" }}>{name.trim() || "Your Name"}</div>
                      {title.trim() && <div style={{ fontSize: 10, color: "#6b7280" }}>{title}</div>}
                      {company.trim() && <div style={{ fontSize: 10.5, color: accent, fontWeight: 700, marginTop: 2 }}>{company}</div>}
                    </div>
                    {logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt="Logo" style={{ maxHeight: 34, maxWidth: 70, objectFit: "contain" }} />
                    )}
                  </div>
                  <div>
                    <div style={{ width: 44, height: 3, background: accent, marginBottom: 6 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 10px" }}>
                      {contactRow("T", phone)}
                      {contactRow("E", email)}
                      {contactRow("W", website)}
                      {contactRow("A", address)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </ToolPageLayout>
  );
}
