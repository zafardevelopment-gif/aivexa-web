"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function fmt(n: number) { return "A$" + n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// 2024–25 ATO tax brackets (Stage 3 cuts in effect)
const AUS_BRACKETS = [
  { rate: 0,     min: 0,       max: 18200 },
  { rate: 0.16,  min: 18200,   max: 45000 },
  { rate: 0.30,  min: 45000,   max: 135000 },
  { rate: 0.37,  min: 135000,  max: 190000 },
  { rate: 0.45,  min: 190000,  max: Infinity },
];

const LITO_MAX         = 700;
const LITO_SHADE_START = 37500;
const LITO_SHADE_END   = 45000;
const LITO_SHADE2_END  = 66667;

function calcLITO(income: number): number {
  if (income <= LITO_SHADE_START)  return LITO_MAX;
  if (income <= LITO_SHADE_END)    return LITO_MAX - (income - LITO_SHADE_START) * (325 / 7500);
  if (income <= LITO_SHADE2_END)   return 325 - (income - LITO_SHADE_END) * (325 / 21667);
  return 0;
}

function calcIncomeTax(gross: number): number {
  let tax = 0;
  for (const b of AUS_BRACKETS) {
    if (gross <= b.min) break;
    tax += (Math.min(gross, b.max) - b.min) * b.rate;
  }
  return tax;
}

function calcMedicare(gross: number, exemption: boolean): number {
  if (exemption) return 0;
  const threshold = 26000; // approximate 2024–25
  const shadeEnd  = 32500;
  if (gross <= threshold)  return 0;
  if (gross <= shadeEnd)   return (gross - threshold) * 0.10;
  return gross * 0.02;
}

export default function AustraliaSalaryCalculatorTool() {
  const [salary, setSalary]           = useState("80000");
  const [period, setPeriod]           = useState("annual");
  const [medicareExempt, setMedicareExempt] = useState(false);

  const result = useMemo(() => {
    let annual = Math.max(0, toNum(salary));
    if (period === "monthly")      annual *= 12;
    if (period === "fortnightly")  annual *= 26;
    if (period === "weekly")       annual *= 52;
    if (period === "hourly")       annual *= 2080;

    const grossTax    = calcIncomeTax(annual);
    const lito        = calcLITO(annual);
    const incomeTax   = Math.max(0, grossTax - lito);
    const medicare    = calcMedicare(annual, medicareExempt);
    const totalTax    = incomeTax + medicare;
    const takeHome    = annual - totalTax;
    const effectiveRate = annual > 0 ? (totalTax / annual) * 100 : 0;

    return {
      grossAnnual: annual,
      incomeTax,
      lito,
      medicare,
      totalTax,
      takeHome,
      takeHomeMonthly:     takeHome / 12,
      takeHomeFortnightly: takeHome / 26,
      takeHomeWeekly:      takeHome / 52,
      effectiveRate,
    };
  }, [salary, period, medicareExempt]);

  return (
    <ToolPageLayout
      title="Australia Salary Calculator"
      description="Calculate your Australian take-home pay after income tax and Medicare levy for 2024–25, including the Stage 3 tax cuts."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <Field label="Gross Salary / Wage">
          <TextInput type="number" min={0} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 80000" />
        </Field>

        <Field label="Pay Period">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="annual">Annual</option>
            <option value="monthly">Monthly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="weekly">Weekly</option>
            <option value="hourly">Hourly (×2,080 hrs/yr)</option>
          </select>
        </Field>

        <label style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1.1rem", cursor: "pointer" }}>
          <input type="checkbox" checked={medicareExempt} onChange={(e) => setMedicareExempt(e.target.checked)} />
          <span style={{ fontSize: ".9rem" }}>Medicare Levy Exemption</span>
        </label>

        <ResultBox>
          <ResultRow label="Annual Gross Salary"    value={fmt(result.grossAnnual)} />
          <ResultRow label="Income Tax"             value={`-${fmt(result.incomeTax)}`} />
          {result.lito > 0 &&
            <ResultRow label="LITO Offset Applied"  value={fmt(result.lito)} />}
          <ResultRow label="Medicare Levy (2%)"     value={`-${fmt(result.medicare)}`} />
          <ResultRow label="Annual Take-Home Pay"   value={fmt(result.takeHome)} highlight />
          <ResultRow label="Monthly Take-Home"      value={fmt(result.takeHomeMonthly)} />
          <ResultRow label="Fortnightly Take-Home"  value={fmt(result.takeHomeFortnightly)} />
          <ResultRow label="Weekly Take-Home"       value={fmt(result.takeHomeWeekly)} />
          <ResultRow label="Effective Tax Rate"     value={`${result.effectiveRate.toFixed(1)}%`} />
        </ResultBox>
      </Card>

      <p style={{ marginTop: "1rem", fontSize: ".8rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
        <strong>Disclaimer:</strong> Based on 2024–25 ATO rates including Stage 3 tax cuts. Includes Low Income Tax Offset (LITO).
        Does not include superannuation, HECS-HELP repayments or state levies. Results are estimates only.
      </p>
    </ToolPageLayout>
  );
}
