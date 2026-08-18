"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function fmt(n: number) { return "CA$" + n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// 2024 Federal brackets
const FEDERAL_BRACKETS = [
  { rate: 0.15,   min: 0,       max: 55867 },
  { rate: 0.205,  min: 55867,   max: 111733 },
  { rate: 0.26,   min: 111733,  max: 154906 },
  { rate: 0.29,   min: 154906,  max: 220000 },
  { rate: 0.33,   min: 220000,  max: Infinity },
];
const BASIC_PERSONAL_AMOUNT = 15705; // 2024

// Provincial rates (simplified top marginal brackets for common provinces)
const PROVINCIAL_RATES: Record<string, { brackets: { rate: number; min: number; max: number }[]; bpa: number }> = {
  Ontario: {
    bpa: 11865,
    brackets: [
      { rate: 0.0505, min: 0,       max: 51446 },
      { rate: 0.0915, min: 51446,   max: 102894 },
      { rate: 0.1116, min: 102894,  max: 150000 },
      { rate: 0.1216, min: 150000,  max: 220000 },
      { rate: 0.1316, min: 220000,  max: Infinity },
    ],
  },
  "British Columbia": {
    bpa: 11981,
    brackets: [
      { rate: 0.0506, min: 0,       max: 45654 },
      { rate: 0.077,  min: 45654,   max: 91310 },
      { rate: 0.105,  min: 91310,   max: 104835 },
      { rate: 0.1229, min: 104835,  max: 127299 },
      { rate: 0.147,  min: 127299,  max: 172602 },
      { rate: 0.168,  min: 172602,  max: 240716 },
      { rate: 0.205,  min: 240716,  max: Infinity },
    ],
  },
  Alberta: {
    bpa: 21003,
    brackets: [
      { rate: 0.10,   min: 0,       max: 148269 },
      { rate: 0.12,   min: 148269,  max: 177922 },
      { rate: 0.13,   min: 177922,  max: 237230 },
      { rate: 0.14,   min: 237230,  max: 355845 },
      { rate: 0.15,   min: 355845,  max: Infinity },
    ],
  },
  Quebec: {
    bpa: 17183,
    brackets: [
      { rate: 0.14,   min: 0,       max: 51780 },
      { rate: 0.19,   min: 51780,   max: 103545 },
      { rate: 0.24,   min: 103545,  max: 126000 },
      { rate: 0.2575, min: 126000,  max: Infinity },
    ],
  },
  Manitoba: {
    bpa: 15780,
    brackets: [
      { rate: 0.108,  min: 0,       max: 47000 },
      { rate: 0.1275, min: 47000,   max: 100000 },
      { rate: 0.174,  min: 100000,  max: Infinity },
    ],
  },
  Saskatchewan: {
    bpa: 17661,
    brackets: [
      { rate: 0.105,  min: 0,       max: 49720 },
      { rate: 0.125,  min: 49720,   max: 142058 },
      { rate: 0.145,  min: 142058,  max: Infinity },
    ],
  },
  "Nova Scotia": {
    bpa: 8481,
    brackets: [
      { rate: 0.0879, min: 0,       max: 29590 },
      { rate: 0.1495, min: 29590,   max: 59180 },
      { rate: 0.1667, min: 59180,   max: 93000 },
      { rate: 0.175,  min: 93000,   max: 150000 },
      { rate: 0.21,   min: 150000,  max: Infinity },
    ],
  },
};

function calcTax(
  gross: number,
  brackets: { rate: number; min: number; max: number }[],
  bpa: number
) {
  const taxable = Math.max(0, gross - bpa);
  let tax = 0;
  for (const b of brackets) {
    if (taxable <= b.min) break;
    tax += (Math.min(taxable, b.max) - b.min) * b.rate;
  }
  return tax;
}

export default function CanadaSalaryCalculatorTool() {
  const [salary, setSalary]     = useState("70000");
  const [period, setPeriod]     = useState("annual");
  const [province, setProvince] = useState("Ontario");

  const result = useMemo(() => {
    let annual = Math.max(0, toNum(salary));
    if (period === "monthly")   annual *= 12;
    if (period === "biweekly")  annual *= 26;
    if (period === "hourly")    annual *= 2080;

    const fedTax  = calcTax(annual, FEDERAL_BRACKETS, BASIC_PERSONAL_AMOUNT);
    const provData = PROVINCIAL_RATES[province];
    const provTax  = provData ? calcTax(annual, provData.brackets, provData.bpa) : 0;

    // CPP 2024: 5.95% on earnings between $3,500 and $68,500
    const cppRate    = 0.0595;
    const cppExempt  = 3500;
    const cppMax     = 68500;
    const cpp = Math.max(0, Math.min(annual, cppMax) - cppExempt) * cppRate;

    // EI 2024: 1.66% up to $63,200
    const eiRate = 0.0166;
    const eiMax  = 63200;
    const ei     = Math.min(annual, eiMax) * eiRate;

    const totalDeductions = fedTax + provTax + cpp + ei;
    const takeHome        = annual - totalDeductions;
    const effectiveRate   = annual > 0 ? (totalDeductions / annual) * 100 : 0;

    return {
      grossAnnual: annual,
      fedTax,
      provTax,
      cpp,
      ei,
      totalDeductions,
      takeHome,
      takeHomeMonthly:  takeHome / 12,
      takeHomeBiweekly: takeHome / 26,
      effectiveRate,
    };
  }, [salary, period, province]);

  return (
    <ToolPageLayout
      title="Canada Salary Calculator"
      description="Calculate your Canadian take-home pay after federal and provincial income tax, CPP and EI deductions for 2024."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <Field label="Gross Salary / Wage">
          <TextInput type="number" min={0} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 70000" />
        </Field>

        <Field label="Pay Period">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="annual">Annual</option>
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="hourly">Hourly (×2,080 hrs/yr)</option>
          </select>
        </Field>

        <Field label="Province / Territory">
          <select value={province} onChange={(e) => setProvince(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            {Object.keys(PROVINCIAL_RATES).map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>

        <ResultBox>
          <ResultRow label="Annual Gross Salary"        value={fmt(result.grossAnnual)} />
          <ResultRow label="Federal Income Tax"         value={`-${fmt(result.fedTax)}`} />
          <ResultRow label={`${province} Provincial Tax`} value={`-${fmt(result.provTax)}`} />
          <ResultRow label="CPP Contributions"          value={`-${fmt(result.cpp)}`} />
          <ResultRow label="EI Premiums"                value={`-${fmt(result.ei)}`} />
          <ResultRow label="Annual Take-Home Pay"       value={fmt(result.takeHome)}/>
          <ResultRow label="Monthly Take-Home"          value={fmt(result.takeHomeMonthly)} />
          <ResultRow label="Bi-weekly Take-Home"        value={fmt(result.takeHomeBiweekly)} />
          <ResultRow label="Effective Tax Rate"         value={`${result.effectiveRate.toFixed(1)}%`} />
        </ResultBox>
      </Card>

      <p style={{ marginTop: "1rem", fontSize: ".8rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
        <strong>Disclaimer:</strong> Based on 2024 CRA rates. Assumes standard basic personal amounts and no other credits or deductions.
        Results are estimates. Use CRA's official tools or consult a tax professional for precise figures.
      </p>
    </ToolPageLayout>
  );
}
