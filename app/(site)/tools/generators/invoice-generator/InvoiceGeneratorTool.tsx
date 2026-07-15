"use client";

import { useEffect, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  SelectInput,
  ResultBox,
  ResultRow,
} from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { formatINR, rupeesInWords } from "@/lib/number-to-words-indian";

type LineItem = { description: string; qty: string; rate: string };

type InvoiceData = {
  businessName: string;
  businessAddress: string;
  businessGstin: string;
  clientName: string;
  clientAddress: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  items: LineItem[];
  gstRate: string;
  notes: string;
};

const EMPTY: InvoiceData = {
  businessName: "",
  businessAddress: "",
  businessGstin: "",
  clientName: "",
  clientAddress: "",
  invoiceNo: "INV-001",
  invoiceDate: "",
  dueDate: "",
  items: [{ description: "", qty: "1", rate: "" }],
  gstRate: "18",
  notes: "",
};

const LS_KEY = "aivexa-invoice-generator-v1";

function amt(it: LineItem): number {
  const q = Number(it.qty);
  const r = Number(it.rate);
  if (!Number.isFinite(q) || !Number.isFinite(r) || q <= 0 || r < 0) return 0;
  return q * r;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "1.4rem 0 .8rem", paddingBottom: ".35rem", borderBottom: "2px solid var(--indigo-light, #eef2ff)" }}>
      {children}
    </h3>
  );
}

export default function InvoiceGeneratorTool() {
  const [d, setD] = useState<InvoiceData>(EMPTY);
  const [logo, setLogo] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setD({ ...EMPTY, ...(JSON.parse(raw) as Partial<InvoiceData>) });
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(d));
    } catch { /* ignore */ }
  }, [d, loaded]);

  function set<K extends keyof InvoiceData>(k: K, v: InvoiceData[K]) {
    setD((p) => ({ ...p, [k]: v }));
  }
  function setItem(i: number, patch: Partial<LineItem>) {
    setD((p) => ({ ...p, items: p.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) }));
  }

  const subtotal = d.items.reduce((s, it) => s + amt(it), 0);
  const gstRate = Number(d.gstRate) || 0;
  const gstAmount = (subtotal * gstRate) / 100;
  const grandTotal = subtotal + gstAmount;
  const canDownload =
    d.businessName.trim() !== "" &&
    d.clientName.trim() !== "" &&
    d.items.some((it) => it.description.trim() && amt(it) > 0);

  function onLogo(files: File[]) {
    const f = files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setLogo(r.result as string);
    r.readAsDataURL(f);
  }

  async function downloadPdf() {
    if (!canDownload || busy) return;
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const W = 210;
      const M = 16;
      let y = 18;
      const INDIGO: [number, number, number] = [79, 70, 229];

      if (logo) {
        try {
          const fmt = logo.startsWith("data:image/png") ? "PNG" : "JPEG";
          doc.addImage(logo, fmt, M, y - 4, 24, 24);
        } catch { /* skip bad logo */ }
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...INDIGO);
      doc.text("INVOICE", W - M, y + 2, { align: "right" });
      doc.setFontSize(13);
      doc.setTextColor(20, 20, 20);
      const bx = logo ? M + 28 : M;
      doc.text(d.businessName.trim(), bx, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      let by = y + 5;
      for (const line of d.businessAddress.split("\n").filter((l) => l.trim())) {
        doc.text(line.trim(), bx, by);
        by += 4.2;
      }
      if (d.businessGstin.trim()) {
        doc.text("GSTIN: " + d.businessGstin.trim(), bx, by);
        by += 4.2;
      }
      y = Math.max(by, y + 22) + 4;

      doc.setDrawColor(...INDIGO);
      doc.setLineWidth(0.5);
      doc.line(M, y, W - M, y);
      y += 8;

      // Bill to + meta
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...INDIGO);
      doc.text("BILL TO", M, y);
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(10.5);
      doc.text(d.clientName.trim(), M, y + 5.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      let cy = y + 10.5;
      for (const line of d.clientAddress.split("\n").filter((l) => l.trim())) {
        doc.text(line.trim(), M, cy);
        cy += 4.2;
      }
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      const metaX = W - M - 55;
      const rows: [string, string][] = [
        ["Invoice #", d.invoiceNo.trim() || "-"],
        ["Invoice Date", d.invoiceDate.trim() || "-"],
        ["Due Date", d.dueDate.trim() || "-"],
      ];
      let my = y;
      for (const [k, v] of rows) {
        doc.setFont("helvetica", "bold");
        doc.text(k, metaX, my);
        doc.setFont("helvetica", "normal");
        doc.text(v, W - M, my, { align: "right" });
        my += 5.5;
      }
      y = Math.max(cy, my) + 6;

      // Table header
      const colDesc = M;
      const colQty = W - M - 70;
      const colRate = W - M - 45;
      const colAmt = W - M;
      doc.setFillColor(...INDIGO);
      doc.rect(M, y, W - M * 2, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("DESCRIPTION", colDesc + 2, y + 5.4);
      doc.text("QTY", colQty, y + 5.4, { align: "right" });
      doc.text("RATE (Rs.)", colRate + 8, y + 5.4, { align: "right" });
      doc.text("AMOUNT (Rs.)", colAmt - 2, y + 5.4, { align: "right" });
      y += 8;

      doc.setTextColor(30, 30, 30);
      const items = d.items.filter((it) => it.description.trim() && amt(it) > 0);
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const descLines = doc.splitTextToSize(it.description.trim(), colQty - colDesc - 12) as string[];
        const rowH = Math.max(descLines.length * 4.4, 5) + 3.5;
        if (y + rowH > 250) {
          doc.addPage();
          y = 20;
        }
        if (i % 2 === 1) {
          doc.setFillColor(243, 244, 255);
          doc.rect(M, y, W - M * 2, rowH, "F");
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        let dy = y + 5;
        for (const line of descLines) {
          doc.text(line, colDesc + 2, dy);
          dy += 4.4;
        }
        doc.text(String(Number(it.qty) || 0), colQty, y + 5, { align: "right" });
        doc.text(formatINR(Number(it.rate) || 0), colRate + 8, y + 5, { align: "right" });
        doc.text(formatINR(amt(it)), colAmt - 2, y + 5, { align: "right" });
        y += rowH;
      }
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(M, y, W - M, y);
      y += 7;

      // Totals block
      const tx = W - M - 70;
      function totalRow(label: string, value: string, bold = false) {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(bold ? 11 : 9.5);
        doc.setTextColor(bold ? 79 : 60, bold ? 70 : 60, bold ? 229 : 60);
        doc.text(label, tx, y);
        doc.text(value, W - M, y, { align: "right" });
        y += bold ? 7 : 5.5;
      }
      totalRow("Subtotal", "Rs. " + formatINR(subtotal));
      if (gstRate > 0) {
        totalRow(`CGST @ ${gstRate / 2}%`, "Rs. " + formatINR(gstAmount / 2));
        totalRow(`SGST @ ${gstRate / 2}%`, "Rs. " + formatINR(gstAmount / 2));
      }
      doc.setDrawColor(...INDIGO);
      doc.line(tx, y - 2, W - M, y - 2);
      y += 3;
      totalRow("GRAND TOTAL", "Rs. " + formatINR(grandTotal), true);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.8);
      doc.setTextColor(80, 80, 80);
      const words = doc.splitTextToSize("Amount in words: " + rupeesInWords(grandTotal), W - M * 2) as string[];
      for (const line of words) {
        doc.text(line, M, y);
        y += 4.4;
      }
      y += 6;

      if (d.notes.trim()) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...INDIGO);
        doc.text("NOTES / TERMS", M, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        for (const line of doc.splitTextToSize(d.notes.trim(), W - M * 2) as string[]) {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, M, y);
          y += 4.4;
        }
      }

      doc.save((d.invoiceNo.trim() || "invoice") + ".pdf");
    } finally {
      setBusy(false);
    }
  }

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0 1rem",
  };

  return (
    <ToolPageLayout
      title="Invoice Generator"
      description="Create a clean GST invoice with automatic totals and CGST/SGST split, then download it as a PDF. Free, private and works entirely in your browser."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <SectionHeading>Your Business</SectionHeading>
        <div style={grid}>
          <Field label="Business Name *">
            <TextInput value={d.businessName} placeholder="e.g. Sharma Traders" onChange={(e) => set("businessName", e.target.value)} />
          </Field>
          <Field label="GSTIN (optional)">
            <TextInput value={d.businessGstin} placeholder="e.g. 27AAAAA0000A1Z5" onChange={(e) => set("businessGstin", e.target.value)} />
          </Field>
        </div>
        <Field label="Business Address">
          <TextArea value={d.businessAddress} style={{ minHeight: 60 }} onChange={(e) => set("businessAddress", e.target.value)} />
        </Field>
        <Field label="Logo (optional)">
          <FileDropzone accept="image/*" onFiles={onLogo} label="Upload your logo (PNG/JPG)" />
        </Field>
        {logo && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="Logo preview" style={{ height: 48, borderRadius: 6, border: "1px solid var(--border-2)" }} />
            <button type="button" className="btn-secondary sm" onClick={() => setLogo(null)}>Remove logo</button>
          </div>
        )}

        <SectionHeading>Client</SectionHeading>
        <Field label="Client Name *">
          <TextInput value={d.clientName} onChange={(e) => set("clientName", e.target.value)} />
        </Field>
        <Field label="Client Address">
          <TextArea value={d.clientAddress} style={{ minHeight: 60 }} onChange={(e) => set("clientAddress", e.target.value)} />
        </Field>

        <SectionHeading>Invoice Details</SectionHeading>
        <div style={grid}>
          <Field label="Invoice Number">
            <TextInput value={d.invoiceNo} onChange={(e) => set("invoiceNo", e.target.value)} />
          </Field>
          <Field label="Invoice Date">
            <TextInput type="date" value={d.invoiceDate} onChange={(e) => set("invoiceDate", e.target.value)} />
          </Field>
          <Field label="Due Date">
            <TextInput type="date" value={d.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
          </Field>
          <Field label="GST Rate">
            <SelectInput value={d.gstRate} onChange={(e) => set("gstRate", e.target.value)}>
              <option value="0">0% (No GST)</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </SelectInput>
          </Field>
        </div>

        <SectionHeading>Line Items</SectionHeading>
        <div style={{ overflowX: "auto" }}>
          {d.items.map((it, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(140px, 3fr) minmax(60px, 1fr) minmax(80px, 1.4fr) minmax(80px, 1.4fr) auto",
                gap: ".5rem",
                alignItems: "center",
                marginBottom: ".55rem",
                minWidth: 480,
              }}
            >
              <TextInput placeholder="Description" value={it.description} onChange={(e) => setItem(i, { description: e.target.value })} />
              <TextInput type="number" min={0} placeholder="Qty" value={it.qty} onChange={(e) => setItem(i, { qty: e.target.value })} />
              <TextInput type="number" min={0} placeholder="Rate ₹" value={it.rate} onChange={(e) => setItem(i, { rate: e.target.value })} />
              <div style={{ fontSize: ".9rem", fontWeight: 600, textAlign: "right" }}>₹{formatINR(amt(it))}</div>
              <button
                type="button"
                className="btn-secondary sm"
                disabled={d.items.length === 1}
                style={{ opacity: d.items.length === 1 ? 0.4 : 1 }}
                onClick={() => setD((p) => ({ ...p, items: p.items.filter((_, j) => j !== i) }))}
                aria-label="Remove row"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn-secondary sm"
          onClick={() => setD((p) => ({ ...p, items: [...p.items, { description: "", qty: "1", rate: "" }] }))}
        >
          + Add row
        </button>

        <Field label="Notes / Terms (optional)">
          <TextArea value={d.notes} style={{ minHeight: 60, marginTop: "1rem" }} placeholder="e.g. Payment due within 15 days." onChange={(e) => set("notes", e.target.value)} />
        </Field>

        <ResultBox>
          <ResultRow label="Subtotal" value={`₹${formatINR(subtotal)}`} />
          {gstRate > 0 && (
            <>
              <ResultRow label={`CGST @ ${gstRate / 2}%`} value={`₹${formatINR(gstAmount / 2)}`} />
              <ResultRow label={`SGST @ ${gstRate / 2}%`} value={`₹${formatINR(gstAmount / 2)}`} />
            </>
          )}
          <ResultRow label="Grand Total" value={`₹${formatINR(grandTotal)}`} />
          <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: ".6rem" }}>
            {grandTotal > 0 ? rupeesInWords(grandTotal) : ""}
          </p>
        </ResultBox>

        <div style={{ marginTop: "1.2rem" }}>
          <button
            type="button"
            className="btn-primary"
            disabled={!canDownload || busy}
            style={{ opacity: !canDownload || busy ? 0.5 : 1 }}
            onClick={downloadPdf}
          >
            {busy ? "Generating…" : "Download Invoice PDF"}
          </button>
          {!canDownload && (
            <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
              Enter business name, client name and at least one line item with an amount.
            </p>
          )}
        </div>
      </Card>
    </ToolPageLayout>
  );
}
