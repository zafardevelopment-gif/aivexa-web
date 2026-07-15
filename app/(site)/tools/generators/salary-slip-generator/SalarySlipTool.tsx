"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  SelectInput,
  ResultBox,
  ResultRow,
} from "@/components/tools/ToolUI";
import { formatINR, rupeesInWords } from "@/lib/number-to-words-indian";

type Row = { label: string; amount: string };

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function num(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "1.4rem 0 .8rem", paddingBottom: ".35rem", borderBottom: "2px solid var(--indigo-light, #eef2ff)" }}>
      {children}
    </h3>
  );
}

function RowsEditor({
  rows,
  onChange,
}: {
  rows: Row[];
  onChange: (rows: Row[]) => void;
}) {
  return (
    <div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(140px, 2fr) minmax(100px, 1fr) auto",
            gap: ".5rem",
            marginBottom: ".55rem",
          }}
        >
          <TextInput
            placeholder="Component name"
            value={r.label}
            onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
          />
          <TextInput
            type="number"
            min={0}
            placeholder="Amount ₹"
            value={r.amount}
            onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)))}
          />
          <button
            type="button"
            className="btn-secondary sm"
            disabled={rows.length === 1}
            style={{ opacity: rows.length === 1 ? 0.4 : 1 }}
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            aria-label="Remove row"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn-secondary sm" onClick={() => onChange([...rows, { label: "", amount: "" }])}>
        + Add row
      </button>
    </div>
  );
}

export default function SalarySlipTool() {
  const now = new Date();
  const [company, setCompany] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [empName, setEmpName] = useState("");
  const [empId, setEmpId] = useState("");
  const [designation, setDesignation] = useState("");
  const [month, setMonth] = useState(MONTHS[now.getMonth()]);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [earnings, setEarnings] = useState<Row[]>([
    { label: "Basic Salary", amount: "" },
    { label: "HRA", amount: "" },
    { label: "Special Allowance", amount: "" },
  ]);
  const [deductions, setDeductions] = useState<Row[]>([
    { label: "Provident Fund (PF)", amount: "" },
    { label: "Professional Tax", amount: "" },
    { label: "TDS", amount: "" },
  ]);
  const [busy, setBusy] = useState(false);

  const totalEarnings = earnings.reduce((s, r) => s + num(r.amount), 0);
  const totalDeductions = deductions.reduce((s, r) => s + num(r.amount), 0);
  const netPay = totalEarnings - totalDeductions;
  const canDownload = company.trim() !== "" && empName.trim() !== "" && totalEarnings > 0;

  async function downloadPdf() {
    if (!canDownload || busy) return;
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const W = 210;
      const M = 16;
      const INDIGO: [number, number, number] = [79, 70, 229];
      let y = 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(20, 20, 20);
      doc.text(company.trim(), W / 2, y, { align: "center" });
      y += 5.5;
      if (companyAddress.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(90, 90, 90);
        doc.text(companyAddress.trim(), W / 2, y, { align: "center" });
        y += 5.5;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      doc.setTextColor(...INDIGO);
      doc.text(`SALARY SLIP — ${month.toUpperCase()} ${year}`, W / 2, y + 2, { align: "center" });
      y += 8;
      doc.setDrawColor(...INDIGO);
      doc.setLineWidth(0.5);
      doc.line(M, y, W - M, y);
      y += 8;

      // Employee block
      doc.setFontSize(9.5);
      const empRows: [string, string][] = [
        ["Employee Name", empName.trim()],
        ["Employee ID", empId.trim() || "-"],
        ["Designation", designation.trim() || "-"],
        ["Pay Period", `${month} ${year}`],
      ];
      for (let i = 0; i < empRows.length; i++) {
        const col = i % 2;
        const x = M + col * ((W - M * 2) / 2);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 70, 70);
        doc.text(empRows[i][0] + ":", x, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(20, 20, 20);
        doc.text(empRows[i][1], x + 32, y);
        if (col === 1) y += 6;
      }
      if (empRows.length % 2 === 1) y += 6;
      y += 4;

      // Two-column earnings/deductions table
      const colW = (W - M * 2) / 2;
      const startY = y;
      doc.setFillColor(...INDIGO);
      doc.rect(M, y, colW, 7.5, "F");
      doc.rect(M + colW, y, colW, 7.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text("EARNINGS", M + 3, y + 5.2);
      doc.text("AMOUNT (Rs.)", M + colW - 3, y + 5.2, { align: "right" });
      doc.text("DEDUCTIONS", M + colW + 3, y + 5.2);
      doc.text("AMOUNT (Rs.)", W - M - 3, y + 5.2, { align: "right" });
      y += 7.5;

      const eRows = earnings.filter((r) => r.label.trim() && num(r.amount) > 0);
      const dRows = deductions.filter((r) => r.label.trim() && num(r.amount) > 0);
      const maxRows = Math.max(eRows.length, dRows.length, 1);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      for (let i = 0; i < maxRows; i++) {
        const rowY = y + 5.4;
        if (i % 2 === 1) {
          doc.setFillColor(243, 244, 255);
          doc.rect(M, y, colW * 2, 7, "F");
        }
        if (eRows[i]) {
          doc.text(eRows[i].label.trim(), M + 3, rowY);
          doc.text(formatINR(num(eRows[i].amount)), M + colW - 3, rowY, { align: "right" });
        }
        if (dRows[i]) {
          doc.text(dRows[i].label.trim(), M + colW + 3, rowY);
          doc.text(formatINR(num(dRows[i].amount)), W - M - 3, rowY, { align: "right" });
        }
        y += 7;
      }

      // Totals row
      doc.setFillColor(228, 231, 255);
      doc.rect(M, y, colW * 2, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.text("Total Earnings", M + 3, y + 5.5);
      doc.text(formatINR(totalEarnings), M + colW - 3, y + 5.5, { align: "right" });
      doc.text("Total Deductions", M + colW + 3, y + 5.5);
      doc.text(formatINR(totalDeductions), W - M - 3, y + 5.5, { align: "right" });
      y += 8;

      // Table borders
      doc.setDrawColor(150, 150, 170);
      doc.setLineWidth(0.25);
      doc.rect(M, startY, colW * 2, y - startY);
      doc.line(M + colW, startY, M + colW, y);
      y += 10;

      // Net pay
      doc.setFillColor(...INDIGO);
      doc.rect(M, y, W - M * 2, 11, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      doc.setTextColor(255, 255, 255);
      doc.text("NET PAY", M + 4, y + 7.3);
      doc.text("Rs. " + formatINR(netPay), W - M - 4, y + 7.3, { align: "right" });
      y += 17;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      const words = doc.splitTextToSize(
        "Net pay in words: " + rupeesInWords(Math.max(netPay, 0)),
        W - M * 2,
      ) as string[];
      for (const line of words) {
        doc.text(line, M, y);
        y += 4.5;
      }
      y += 14;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(120, 120, 120);
      doc.text("This is a computer-generated salary slip and does not require a signature.", W / 2, y, { align: "center" });

      doc.save(`salary-slip-${month.toLowerCase()}-${year}.pdf`);
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
      title="Salary Slip Generator"
      description="Build a payslip with earnings and deductions, automatic net pay, and amount in words — then download it as a clean PDF. Nothing leaves your browser."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <SectionHeading>Company & Employee</SectionHeading>
        <div style={grid}>
          <Field label="Company Name *">
            <TextInput value={company} onChange={(e) => setCompany(e.target.value)} />
          </Field>
          <Field label="Company Address (optional)">
            <TextInput value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
          </Field>
          <Field label="Employee Name *">
            <TextInput value={empName} onChange={(e) => setEmpName(e.target.value)} />
          </Field>
          <Field label="Employee ID">
            <TextInput value={empId} onChange={(e) => setEmpId(e.target.value)} />
          </Field>
          <Field label="Designation">
            <TextInput value={designation} onChange={(e) => setDesignation(e.target.value)} />
          </Field>
          <Field label="Month & Year">
            <div style={{ display: "flex", gap: ".5rem" }}>
              <SelectInput value={month} onChange={(e) => setMonth(e.target.value)}>
                {MONTHS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </SelectInput>
              <TextInput type="number" style={{ maxWidth: 110 }} value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </Field>
        </div>

        <SectionHeading>Earnings</SectionHeading>
        <RowsEditor rows={earnings} onChange={setEarnings} />

        <SectionHeading>Deductions</SectionHeading>
        <RowsEditor rows={deductions} onChange={setDeductions} />

        <ResultBox>
          <ResultRow label="Total Earnings" value={`₹${formatINR(totalEarnings)}`} />
          <ResultRow label="Total Deductions" value={`₹${formatINR(totalDeductions)}`} />
          <ResultRow label="Net Pay" value={`₹${formatINR(netPay)}`} />
          {totalEarnings > 0 && (
            <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: ".6rem" }}>
              {rupeesInWords(Math.max(netPay, 0))}
            </p>
          )}
        </ResultBox>

        <div style={{ marginTop: "1.2rem" }}>
          <button
            type="button"
            className="btn-primary"
            disabled={!canDownload || busy}
            style={{ opacity: !canDownload || busy ? 0.5 : 1 }}
            onClick={downloadPdf}
          >
            {busy ? "Generating…" : "Download Salary Slip PDF"}
          </button>
          {!canDownload && (
            <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginTop: ".7rem" }}>
              Enter company name, employee name and at least one earning amount.
            </p>
          )}
        </div>
      </Card>
    </ToolPageLayout>
  );
}
