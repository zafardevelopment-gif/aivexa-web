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

type Design = "elegant" | "festive" | "minimal";

// Card: 5x7in portrait
const CARD_W_MM = 127;
const CARD_H_MM = 178;

const DEFAULT_HEADING: Record<string, string> = {
  wedding: "Together with their families",
  birthday: "You're invited to a Birthday Party!",
  event: "You're cordially invited",
};

export default function InvitationCardTool() {
  const [eventType, setEventType] = useState("wedding");
  const [heading, setHeading] = useState("");
  const [hosts, setHosts] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [message, setMessage] = useState("");
  const [design, setDesign] = useState<Design>("elegant");
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const canExport = hosts.trim() !== "" && (date.trim() !== "" || venue.trim() !== "");

  const dateStr = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const timeStr = time
    ? new Date(`2000-01-01T${time}`).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  async function renderCanvas(): Promise<HTMLCanvasElement> {
    const el = cardRef.current;
    if (!el) throw new Error("no preview");
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(el, { scale: 1500 / el.offsetWidth, backgroundColor: "#ffffff" });
  }

  async function exportPdf() {
    if (!canExport || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: [CARD_W_MM, CARD_H_MM] });
      doc.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, CARD_W_MM, CARD_H_MM);
      doc.save("invitation-card.pdf");
    } finally {
      setBusy(false);
    }
  }

  async function exportPng() {
    if (!canExport || busy) return;
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      downloadBlob(await canvasToBlob(canvas, "image/png"), "invitation-card.png");
    } finally {
      setBusy(false);
    }
  }

  const designs: Record<Design, { wrap: React.CSSProperties; accent: string; heading: React.CSSProperties }> = {
    elegant: {
      wrap: {
        background: "#fffdf5",
        border: "2px solid #b08d2f",
        outline: "1px solid #b08d2f",
        outlineOffset: "-8px",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#4a3f28",
      },
      accent: "#b08d2f",
      heading: { fontStyle: "italic" },
    },
    festive: {
      wrap: {
        background: "linear-gradient(160deg, #fff1f2 0%, #fff7ed 55%, #fef9c3 100%)",
        border: "3px dashed #e11d48",
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        color: "#7f1d1d",
      },
      accent: "#e11d48",
      heading: { fontWeight: 800 },
    },
    minimal: {
      wrap: {
        background: "#ffffff",
        border: "1px solid #d1d5db",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#1f2937",
      },
      accent: "#111827",
      heading: { letterSpacing: ".12em", textTransform: "uppercase", fontSize: ".8em" },
    },
  };
  const ds = designs[design];

  return (
    <ToolPageLayout
      title="Invitation Card Maker"
      description="Create a beautiful invitation for a wedding, birthday or any event — pick a design, preview live, and download as PDF or PNG. Free and private."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1rem" }}>
          <Field label="Event Type">
            <SelectInput
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="event">Generic Event</option>
            </SelectInput>
          </Field>
          <Field label="Heading (optional)">
            <TextInput value={heading} placeholder={DEFAULT_HEADING[eventType]} onChange={(e) => setHeading(e.target.value)} />
          </Field>
          <Field label={eventType === "wedding" ? "Couple Names *" : eventType === "birthday" ? "Birthday Person *" : "Host Names *"}>
            <TextInput value={hosts} placeholder={eventType === "wedding" ? "e.g. Riya & Aarav" : "e.g. Little Aanya turns 5"} onChange={(e) => setHosts(e.target.value)} />
          </Field>
          <Field label="Event Date">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Event Time">
            <TextInput type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
          <Field label="Venue">
            <TextInput value={venue} placeholder="e.g. The Grand Ballroom, Taj Lands End" onChange={(e) => setVenue(e.target.value)} />
          </Field>
          <Field label="Message Line (optional)">
            <TextInput value={message} placeholder="e.g. Your presence is the best gift" onChange={(e) => setMessage(e.target.value)} />
          </Field>
        </div>

        <Field label="Design">
          <TabGroup
            options={[
              { value: "elegant", label: "Elegant" },
              { value: "festive", label: "Festive" },
              { value: "minimal", label: "Minimal" },
            ]}
            value={design}
            onChange={(v) => setDesign(v as Design)}
          />
        </Field>

        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
          <button type="button" className="btn-primary" disabled={!canExport || busy} style={{ opacity: !canExport || busy ? 0.5 : 1 }} onClick={exportPdf}>
            {busy ? "Exporting…" : "Download PDF (5×7in)"}
          </button>
          <button type="button" className="btn-secondary" disabled={!canExport || busy} style={{ opacity: !canExport || busy ? 0.5 : 1 }} onClick={exportPng}>
            Download PNG
          </button>
        </div>
        {!canExport && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Enter the host/couple names and a date or venue to enable export.
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
                width: "min(100%, 360px)",
                aspectRatio: `${CARD_W_MM} / ${CARD_H_MM}`,
                boxSizing: "border-box",
                padding: "9% 8%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "0.6em",
                boxShadow: "0 4px 18px rgba(0,0,0,.12)",
                ...ds.wrap,
              }}
            >
              <div style={{ fontSize: "0.95em", opacity: 0.85, ...ds.heading }}>
                {heading.trim() || DEFAULT_HEADING[eventType]}
              </div>
              <div style={{ width: 60, height: 2, background: ds.accent, margin: ".4em 0" }} />
              <div style={{ fontSize: "1.75em", fontWeight: 700, lineHeight: 1.25, color: ds.accent }}>
                {hosts.trim() || "Host Names"}
              </div>
              {eventType === "wedding" && (
                <div style={{ fontSize: ".9em", opacity: 0.8 }}>request the pleasure of your company</div>
              )}
              <div style={{ margin: ".6em 0", fontSize: "1em", fontWeight: 600 }}>
                {dateStr && <div>{dateStr}</div>}
                {timeStr && <div style={{ fontSize: ".9em", opacity: 0.85 }}>at {timeStr}</div>}
              </div>
              {venue.trim() && (
                <div style={{ fontSize: ".92em", opacity: 0.9 }}>
                  <span style={{ display: "block", fontSize: ".78em", letterSpacing: ".15em", opacity: 0.7, marginBottom: ".2em" }}>VENUE</span>
                  {venue}
                </div>
              )}
              {message.trim() && (
                <div style={{ fontSize: ".85em", fontStyle: "italic", opacity: 0.8, marginTop: ".6em" }}>
                  {message}
                </div>
              )}
              <div style={{ width: 60, height: 2, background: ds.accent, margin: ".5em 0 0" }} />
            </div>
          </div>
        </Card>
      </div>
    </ToolPageLayout>
  );
}
