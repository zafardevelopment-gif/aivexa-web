"use client";

import { useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TabGroup } from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";

export default function LetterheadTool() {
  const [company, setCompany] = useState("");
  const [tagline, setTagline] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [footerLine, setFooterLine] = useState("");
  const [accent, setAccent] = useState("#4f46e5");
  const [layout, setLayout] = useState("logo-left");
  const [logo, setLogo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const canExport = company.trim() !== "";
  const contactLine = [address, phone, email, website].map((s) => s.trim()).filter(Boolean).join("   |   ");

  function onLogo(files: File[]) {
    const f = files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setLogo(r.result as string);
    r.readAsDataURL(f);
  }

  async function exportPdf() {
    if (!canExport || busy) return;
    setBusy(true);
    try {
      const el = pageRef.current;
      if (!el) return;
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(el, { scale: 1654 / el.offsetWidth, backgroundColor: "#ffffff" });
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      doc.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297);
      doc.save("letterhead.pdf");
    } finally {
      setBusy(false);
    }
  }

  const centered = layout === "centered";

  return (
    <ToolPageLayout
      title="Letterhead Maker"
      description="Design a reusable A4 company letterhead with your logo, colors and contact details — preview it live and download a blank PDF you can print or reuse."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1rem" }}>
          <Field label="Company Name *">
            <TextInput value={company} placeholder="e.g. Nexus Consulting LLP" onChange={(e) => setCompany(e.target.value)} />
          </Field>
          <Field label="Tagline">
            <TextInput value={tagline} placeholder="e.g. Strategy. Delivered." onChange={(e) => setTagline(e.target.value)} />
          </Field>
          <Field label="Address">
            <TextInput value={address} placeholder="e.g. 12, MG Road, Bengaluru 560001" onChange={(e) => setAddress(e.target.value)} />
          </Field>
          <Field label="Phone">
            <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Website">
            <TextInput value={website} onChange={(e) => setWebsite(e.target.value)} />
          </Field>
          <Field label="Footer Line (optional)">
            <TextInput value={footerLine} placeholder="e.g. GSTIN: 29XXXXX1234X1Z5 | CIN: U74999KA2020PTC000000" onChange={(e) => setFooterLine(e.target.value)} />
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
        <Field label="Header Layout">
          <TabGroup
            options={[
              { value: "logo-left", label: "Logo left" },
              { value: "centered", label: "Centered" },
            ]}
            value={layout}
            onChange={setLayout}
          />
        </Field>

        <button type="button" className="btn-primary" disabled={!canExport || busy} style={{ opacity: !canExport || busy ? 0.5 : 1 }} onClick={exportPdf}>
          {busy ? "Exporting…" : "Download Letterhead PDF (A4)"}
        </button>
        {!canExport && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Enter the company name to enable export.
          </p>
        )}
      </Card>

      <div style={{ marginTop: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Live Preview (A4)</h3>
          <div style={{ overflowX: "auto" }}>
            <div
              ref={pageRef}
              style={{
                width: "100%",
                minWidth: 480,
                aspectRatio: "210 / 297",
                background: "#fff",
                border: "1px solid var(--border-2, #e2e8f0)",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Arial, Helvetica, sans-serif",
                boxSizing: "border-box",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "4.5% 6% 2.5%",
                  display: "flex",
                  flexDirection: centered ? "column" : "row",
                  alignItems: "center",
                  gap: centered ? 8 : 16,
                  textAlign: centered ? "center" : "left",
                  justifyContent: centered ? "center" : "flex-start",
                }}
              >
                {logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="Logo" style={{ maxHeight: 54, maxWidth: 120, objectFit: "contain" }} />
                )}
                <div>
                  <div style={{ fontSize: "1.55em", fontWeight: 800, color: accent, letterSpacing: ".01em" }}>
                    {company.trim() || "Company Name"}
                  </div>
                  {tagline.trim() && <div style={{ fontSize: ".82em", color: "#6b7280", marginTop: 2 }}>{tagline}</div>}
                </div>
              </div>
              <div style={{ margin: "0 6%", borderTop: `3px solid ${accent}` }} />
              {contactLine && (
                <div style={{ padding: "1.2% 6% 0", fontSize: ".62em", color: "#6b7280", textAlign: centered ? "center" : "left" }}>
                  {contactLine}
                </div>
              )}

              {/* Empty body */}
              <div style={{ flexGrow: 1 }} />

              {/* Footer */}
              <div style={{ margin: "0 6%", borderTop: `1.5px solid ${accent}` }} />
              <div style={{ padding: "1.4% 6% 3.5%", fontSize: ".6em", color: "#6b7280", textAlign: "center" }}>
                {footerLine.trim() || contactLine || (company.trim() || "Company Name")}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ToolPageLayout>
  );
}
