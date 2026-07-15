"use client";

import { useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  SelectInput,
  TabGroup,
} from "@/components/tools/ToolUI";
import { canvasToBlob, downloadBlob } from "@/components/tools/imageUtils";

type CertStyle = "elegant" | "modern" | "classic";

const TYPE_LINES: Record<string, { title: string; line: string }> = {
  completion: {
    title: "Certificate of Completion",
    line: "has successfully completed",
  },
  participation: {
    title: "Certificate of Participation",
    line: "has actively participated in",
  },
  achievement: {
    title: "Certificate of Achievement",
    line: "is recognised for outstanding achievement in",
  },
};

export default function CertificateMakerTool() {
  const [certType, setCertType] = useState("completion");
  const [recipient, setRecipient] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [org, setOrg] = useState("");
  const [signName, setSignName] = useState("");
  const [signTitle, setSignTitle] = useState("");
  const [style, setStyle] = useState<CertStyle>("elegant");
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const canExport = recipient.trim() !== "" && course.trim() !== "";
  const t = TYPE_LINES[certType];
  const dateStr = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  async function renderCanvas(): Promise<HTMLCanvasElement> {
    const el = previewRef.current;
    if (!el) throw new Error("no preview");
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(el, { scale: 1123 / el.offsetWidth, backgroundColor: "#ffffff" });
  }

  async function exportPdf() {
    if (!canExport || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
      doc.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 297, 210);
      doc.save("certificate.pdf");
    } finally {
      setBusy(false);
    }
  }

  async function exportPng() {
    if (!canExport || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      downloadBlob(await canvasToBlob(canvas, "image/png"), "certificate.png");
    } finally {
      setBusy(false);
    }
  }

  // ---- style-dependent design tokens ----
  const gold = "#b08d2f";
  const indigo = "#4f46e5";
  const designs: Record<CertStyle, React.CSSProperties> = {
    elegant: {
      background: "#fffdf6",
      border: `3px solid ${gold}`,
      outline: `1px solid ${gold}`,
      outlineOffset: "-10px",
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: "#3b3325",
    },
    modern: {
      background: "linear-gradient(135deg, #ffffff 60%, #eef2ff 100%)",
      borderTop: `10px solid ${indigo}`,
      borderBottom: `10px solid ${indigo}`,
      fontFamily: "Arial, Helvetica, sans-serif",
      color: "#1e293b",
    },
    classic: {
      background: "#ffffff",
      border: "6px double #333",
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: "#222",
    },
  };
  const accent = style === "elegant" ? gold : style === "modern" ? indigo : "#333";

  return (
    <ToolPageLayout
      title="Certificate Maker"
      description="Create a polished certificate with a live preview and download it as a landscape A4 PDF or a PNG image. Free and fully private."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1rem" }}>
          <Field label="Certificate Type">
            <SelectInput value={certType} onChange={(e) => setCertType(e.target.value)}>
              <option value="completion">Completion</option>
              <option value="participation">Participation</option>
              <option value="achievement">Achievement</option>
            </SelectInput>
          </Field>
          <Field label="Recipient Name *">
            <TextInput value={recipient} placeholder="e.g. Aditi Kulkarni" onChange={(e) => setRecipient(e.target.value)} />
          </Field>
          <Field label="Course / Event Name *">
            <TextInput value={course} placeholder="e.g. Full-Stack Web Development Bootcamp" onChange={(e) => setCourse(e.target.value)} />
          </Field>
          <Field label="Date">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Organization Name">
            <TextInput value={org} placeholder="e.g. AIVEXA Academy" onChange={(e) => setOrg(e.target.value)} />
          </Field>
          <Field label="Signatory Name">
            <TextInput value={signName} placeholder="e.g. Dr. R. Menon" onChange={(e) => setSignName(e.target.value)} />
          </Field>
          <Field label="Signatory Title">
            <TextInput value={signTitle} placeholder="e.g. Program Director" onChange={(e) => setSignTitle(e.target.value)} />
          </Field>
        </div>

        <Field label="Design Style">
          <TabGroup
            options={[
              { value: "elegant", label: "Elegant" },
              { value: "modern", label: "Modern" },
              { value: "classic", label: "Classic" },
            ]}
            value={style}
            onChange={(v) => setStyle(v as CertStyle)}
          />
        </Field>

        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
          <button type="button" className="btn-primary" disabled={!canExport || busy} style={{ opacity: !canExport || busy ? 0.5 : 1 }} onClick={exportPdf}>
            {busy ? "Exporting…" : "Download PDF (A4 landscape)"}
          </button>
          <button type="button" className="btn-secondary" disabled={!canExport || busy} style={{ opacity: !canExport || busy ? 0.5 : 1 }} onClick={exportPng}>
            Download PNG
          </button>
        </div>
        {!canExport && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Enter the recipient and course/event name to enable export.
          </p>
        )}
      </Card>

      <div style={{ marginTop: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Live Preview</h3>
          <div style={{ overflowX: "auto" }}>
            <div
              ref={previewRef}
              style={{
                width: "100%",
                minWidth: 560,
                aspectRatio: "297 / 210",
                padding: "5% 6%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "center",
                boxSizing: "border-box",
                ...designs[style],
              }}
            >
              <div style={{ width: "100%" }}>
                {org.trim() && (
                  <div style={{ fontSize: ".95em", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, opacity: 0.75 }}>
                    {org}
                  </div>
                )}
                <div
                  style={{
                    fontSize: "2em",
                    fontWeight: 700,
                    marginTop: ".5em",
                    color: accent,
                    letterSpacing: style === "modern" ? ".02em" : ".06em",
                  }}
                >
                  {t.title}
                </div>
                <div style={{ width: 90, height: 2, background: accent, margin: ".8em auto" }} />
              </div>

              <div style={{ width: "100%" }}>
                <div style={{ fontSize: ".95em", opacity: 0.8 }}>This is to certify that</div>
                <div
                  style={{
                    fontSize: "1.9em",
                    fontWeight: 700,
                    margin: ".35em 0",
                    fontStyle: style === "elegant" ? "italic" : "normal",
                    borderBottom: `1px solid ${accent}`,
                    display: "inline-block",
                    padding: "0 1.2em .15em",
                  }}
                >
                  {recipient.trim() || "Recipient Name"}
                </div>
                <div style={{ fontSize: ".95em", opacity: 0.8 }}>{t.line}</div>
                <div style={{ fontSize: "1.25em", fontWeight: 700, marginTop: ".35em" }}>
                  {course.trim() || "Course / Event Name"}
                </div>
                {dateStr && <div style={{ fontSize: ".9em", marginTop: ".6em", opacity: 0.75 }}>on {dateStr}</div>}
              </div>

              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ fontSize: ".8em", opacity: 0.65, textAlign: "left" }}>
                  {org.trim() || ""}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 160, borderBottom: "1px solid currentColor", marginBottom: ".3em" }} />
                  <div style={{ fontSize: ".85em", fontWeight: 700 }}>{signName.trim() || "Signatory"}</div>
                  {signTitle.trim() && <div style={{ fontSize: ".75em", opacity: 0.7 }}>{signTitle}</div>}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ToolPageLayout>
  );
}
