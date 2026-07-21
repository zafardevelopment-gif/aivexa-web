"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TabGroup, ResultBox, ResultRow } from "@/components/tools/ToolUI";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

// New regime slabs FY 2025-26 (AY 2026-27)
function taxNewRegime(income: number) {
  const ti = Math.max(0, income - 75000); // standard deduction
  if (ti <= 1200000) return 0; // 87A rebate
  const slabs: [number, number][] = [
    [400000, 0], [400000, 0.05], [400000, 0.1], [400000, 0.15],
    [400000, 0.2], [400000, 0.25], [Infinity, 0.3],
  ];
  let tax = 0, rem = ti;
  for (const [width, rate] of slabs) {
    if (rem <= 0) break;
    const amt = Math.min(rem, width);
    tax += amt * rate;
    rem -= amt;
  }
  return tax * 1.04; // cess
}

// Old regime slabs
function taxOldRegime(income: number, deductions: number) {
  const ti = Math.max(0, income - 50000 - deductions);
  let tax = 0;
  if (ti > 1000000) tax = 112500 + (ti - 1000000) * 0.3;
  else if (ti > 500000) tax = 12500 + (ti - 500000) * 0.2;
  else if (ti > 250000) tax = (ti - 250000) * 0.05;
  if (ti <= 500000) tax = 0; // 87A rebate
  return tax * 1.04;
}

export default function SalaryStructureOptimizerTool() {
  const [ctc, setCtc] = useState("");
  const [basicPct, setBasicPct] = useState("40");
  const [metro, setMetro] = useState("metro");
  const [deductions, setDeductions] = useState("150000");

  const r = useMemo(() => {
    const C = +ctc || 0;
    if (C < 100000) return null;
    const basic = C * (Math.min(60, Math.max(30, +basicPct || 40)) / 100);
    const hra = basic * (metro === "metro" ? 0.5 : 0.4);
    const employerPf = Math.min(basic, 1800000) * 0.12;
    const gratuity = basic * 0.0481;
    const special = Math.max(0, C - basic - hra - employerPf - gratuity);
    const gross = basic + hra + special; // employee-side gross
    const employeePf = employerPf;

    const oldTax = taxOldRegime(gross, +deductions || 0);
    const newTax = taxNewRegime(gross);
    const better = newTax <= oldTax ? "New regime" : "Old regime";
    const monthlyInHand = (gross - Math.min(oldTax, newTax) - employeePf) / 12;
    return { basic, hra, employerPf, gratuity, special, gross, oldTax, newTax, better, monthlyInHand };
  }, [ctc, basicPct, metro, deductions]);

  return (
    <ToolPageLayout
      title="Salary Structure Optimizer"
      description="Enter your CTC to get a full salary breakup — Basic, HRA, PF, gratuity, special allowance — plus old vs new tax regime comparison and estimated in-hand salary."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Annual CTC (₹)">
          <TextInput type="number" min={0} value={ctc} onChange={(e) => setCtc(e.target.value)} placeholder="e.g. 1200000" />
        </Field>
        <Field label="Basic salary as % of CTC (30–60)">
          <TextInput type="number" min={30} max={60} value={basicPct} onChange={(e) => setBasicPct(e.target.value)} />
        </Field>
        <TabGroup
          value={metro}
          onChange={setMetro}
          options={[
            { value: "metro", label: "Metro (HRA 50%)" },
            { value: "nonmetro", label: "Non-metro (HRA 40%)" },
          ]}
        />
        <Field label="Old-regime deductions — 80C, 80D etc. (₹, max 1.5L for 80C)">
          <TextInput type="number" min={0} value={deductions} onChange={(e) => setDeductions(e.target.value)} />
        </Field>

        {r && (
          <>
            <ResultBox>
              <ResultRow label="Basic salary (yearly)" value={inr(r.basic)} />
              <ResultRow label="HRA" value={inr(r.hra)} />
              <ResultRow label="Special allowance" value={inr(r.special)} />
              <ResultRow label="Employer PF (12% of basic)" value={inr(r.employerPf)} />
              <ResultRow label="Gratuity provision (4.81%)" value={inr(r.gratuity)} />
              <ResultRow label="Gross salary (employee side)" value={inr(r.gross)} />
            </ResultBox>
            <ResultBox>
              <ResultRow label="Tax — Old regime (est.)" value={inr(r.oldTax)} />
              <ResultRow label="Tax — New regime (est.)" value={inr(r.newTax)} />
              <ResultRow label="Better option" value={<span style={{ color: "var(--indigo)" }}>{r.better}</span>} />
              <ResultRow label="Approx. monthly in-hand" value={inr(r.monthlyInHand)} />
            </ResultBox>
          </>
        )}

        <p style={{ marginTop: "1.2rem", fontSize: ".85rem", color: "var(--muted)" }}>
          Estimates for FY 2025-26 with standard deduction and Section 87A rebate applied.
          Actual tax depends on your full income, exemptions and employer policy — this is
          not tax advice; please verify with a CA before filing.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
