"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  SelectInput,
  TabGroup,
} from "@/components/tools/ToolUI";
import { formatINR, rupeesInWords } from "@/lib/number-to-words-indian";

function monthLabel(ym: string): string {
  // ym = "2026-07"
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function monthRange(from: string, to: string): string[] {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  if (!fy || !fm || !ty || !tm) return [];
  const out: string[] = [];
  let y = fy;
  let m = fm;
  let guard = 0;
  while ((y < ty || (y === ty && m <= tm)) && guard < 60) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
    guard++;
  }
  return out;
}

export default function RentReceiptTool() {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [landlord, setLandlord] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [landlordPan, setLandlordPan] = useState("");
  const [tenant, setTenant] = useState("");
  const [amount, setAmount] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [mode, setMode] = useState("single");
  const [singleMonth, setSingleMonth] = useState(thisMonth);
  const [fromMonth, setFromMonth] = useState(thisMonth);
  const [toMonth, setToMonth] = useState(thisMonth);
  const [payMode, setPayMode] = useState("Bank Transfer");
  const [busy, setBusy] = useState(false);

  const rent = Number(amount);
  const validRent = Number.isFinite(rent) && rent > 0;
  const months =
    mode === "single"
      ? singleMonth
        ? [singleMonth]
        : []
      : monthRange(fromMonth, toMonth);
  const canDownload =
    landlord.trim() !== "" &&
    tenant.trim() !== "" &&
    propertyAddress.trim() !== "" &&
    validRent &&
    months.length > 0;

  const annualRent = validRent ? rent * 12 : 0;

  async function downloadPdf() {
    if (!canDownload || busy) return;
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const W = 210;
      const M = 20;

      months.forEach((ym, idx) => {
        if (idx > 0) doc.addPage();
        let y = 26;

        // Border
        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(0.7);
        doc.rect(12, 12, W - 24, 150);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text("RENT RECEIPT", W / 2, y, { align: "center" });
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`For the month of ${monthLabel(ym)}`, W / 2, y, { align: "center" });
        y += 4;
        doc.setDrawColor(180, 180, 200);
        doc.setLineWidth(0.3);
        doc.line(M, y, W - M, y);
        y += 10;

        doc.setFontSize(10.5);
        doc.setTextColor(25, 25, 25);
        const body =
          `Received with thanks a sum of Rs. ${formatINR(rent)} (${rupeesInWords(rent)}) ` +
          `from ${tenant.trim()} towards rent for the month of ${monthLabel(ym)} ` +
          `for the property located at ${propertyAddress.trim().replace(/\n+/g, ", ")}.`;
        const lines = doc.splitTextToSize(body, W - M * 2) as string[];
        for (const line of lines) {
          doc.text(line, M, y);
          y += 5.6;
        }
        y += 4;
        doc.text(`Payment mode: ${payMode}`, M, y);
        y += 10;

        // Landlord details
        doc.setFont("helvetica", "bold");
        doc.text("Landlord: ", M, y);
        doc.setFont("helvetica", "normal");
        doc.text(landlord.trim(), M + 22, y);
        y += 6;
        if (landlordAddress.trim()) {
          doc.setFont("helvetica", "bold");
          doc.text("Address: ", M, y);
          doc.setFont("helvetica", "normal");
          const addr = doc.splitTextToSize(landlordAddress.trim().replace(/\n+/g, ", "), W - M * 2 - 22) as string[];
          for (const line of addr) {
            doc.text(line, M + 22, y);
            y += 5.2;
          }
          y += 0.8;
        }
        if (landlordPan.trim()) {
          doc.setFont("helvetica", "bold");
          doc.text("PAN: ", M, y);
          doc.setFont("helvetica", "normal");
          doc.text(landlordPan.trim().toUpperCase(), M + 22, y);
          y += 6;
        }
        y += 8;

        // Revenue stamp + signature row
        const stampY = 118;
        doc.setDrawColor(140, 140, 160);
        doc.setLineWidth(0.3);
        doc.rect(M, stampY, 30, 26);
        doc.setFontSize(7.5);
        doc.setTextColor(120, 120, 120);
        doc.text("Affix Revenue", M + 15, stampY + 11, { align: "center" });
        doc.text("Stamp (Re. 1)", M + 15, stampY + 15, { align: "center" });
        doc.text("if paid in cash", M + 15, stampY + 19, { align: "center" });

        doc.setDrawColor(60, 60, 60);
        doc.line(W - M - 60, stampY + 20, W - M, stampY + 20);
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(`Signature of Landlord (${landlord.trim()})`, W - M - 30, stampY + 25, { align: "center" });

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(`Date: ____________________`, M, stampY + 36);
      });

      doc.save(`rent-receipt${months.length > 1 ? "s" : ""}-${months[0]}${months.length > 1 ? "-to-" + months[months.length - 1] : ""}.pdf`);
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
      title="Rent Receipt Generator"
      description="Generate rent receipts for HRA proof — one month or a full range with one receipt per month, amount in words and revenue stamp box. Private and free."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <div style={grid}>
          <Field label="Landlord Name *">
            <TextInput value={landlord} onChange={(e) => setLandlord(e.target.value)} />
          </Field>
          <Field label="Landlord PAN (optional)">
            <TextInput value={landlordPan} placeholder="e.g. ABCDE1234F" onChange={(e) => setLandlordPan(e.target.value)} />
          </Field>
          <Field label="Tenant Name *">
            <TextInput value={tenant} onChange={(e) => setTenant(e.target.value)} />
          </Field>
          <Field label="Monthly Rent (₹) *">
            <TextInput type="number" min={0} value={amount} placeholder="e.g. 18000" onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label="Payment Mode">
            <SelectInput value={payMode} onChange={(e) => setPayMode(e.target.value)}>
              <option>Bank Transfer</option>
              <option>UPI</option>
              <option>Cash</option>
              <option>Cheque</option>
            </SelectInput>
          </Field>
        </div>
        <Field label="Landlord Address (optional)">
          <TextArea value={landlordAddress} style={{ minHeight: 55 }} onChange={(e) => setLandlordAddress(e.target.value)} />
        </Field>
        <Field label="Rented Property Address *">
          <TextArea value={propertyAddress} style={{ minHeight: 55 }} onChange={(e) => setPropertyAddress(e.target.value)} />
        </Field>

        <TabGroup
          options={[
            { value: "single", label: "Single month" },
            { value: "range", label: "Month range" },
          ]}
          value={mode}
          onChange={setMode}
        />
        {mode === "single" ? (
          <Field label="Month">
            <TextInput type="month" value={singleMonth} onChange={(e) => setSingleMonth(e.target.value)} />
          </Field>
        ) : (
          <div style={grid}>
            <Field label="From month">
              <TextInput type="month" value={fromMonth} onChange={(e) => setFromMonth(e.target.value)} />
            </Field>
            <Field label="To month">
              <TextInput type="month" value={toMonth} onChange={(e) => setToMonth(e.target.value)} />
            </Field>
          </div>
        )}
        {mode === "range" && months.length === 0 && (
          <p style={{ fontSize: ".85rem", color: "#b91c1c", marginBottom: "1rem" }}>
            The &quot;to&quot; month must be the same as or after the &quot;from&quot; month.
          </p>
        )}
        {months.length > 1 && (
          <p style={{ fontSize: ".88rem", color: "var(--muted)", marginBottom: "1rem" }}>
            {months.length} receipts will be generated — one per month, each on its own page.
          </p>
        )}

        {validRent && annualRent > 100000 && !landlordPan.trim() && (
          <p
            style={{
              fontSize: ".85rem",
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              borderRadius: 8,
              padding: ".6rem .8rem",
              marginBottom: "1rem",
            }}
          >
            Note: your annual rent (₹{formatINR(annualRent, 0)}) exceeds ₹1,00,000 — the
            landlord&apos;s PAN is required for HRA exemption claims above that limit.
          </p>
        )}

        <button
          type="button"
          className="btn-primary"
          disabled={!canDownload || busy}
          style={{ opacity: !canDownload || busy ? 0.5 : 1 }}
          onClick={downloadPdf}
        >
          {busy ? "Generating…" : `Download Receipt${months.length > 1 ? "s" : ""} PDF`}
        </button>
        {!canDownload && (
          <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
            Fill landlord, tenant, property address, a valid rent amount and month(s).
          </p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
