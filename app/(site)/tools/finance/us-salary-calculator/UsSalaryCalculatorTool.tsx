"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 2024 Federal tax brackets (single filer)
const FEDERAL_BRACKETS_SINGLE = [
  { rate: 0.10, min: 0,       max: 11600 },
  { rate: 0.12, min: 11600,   max: 47150 },
  { rate: 0.22, min: 47150,   max: 100525 },
  { rate: 0.24, min: 100525,  max: 191950 },
  { rate: 0.32, min: 191950,  max: 243725 },
  { rate: 0.35, min: 243725,  max: 609350 },
  { rate: 0.37, min: 609350,  max: Infinity },
];

// 2024 Federal tax brackets (married filing jointly)
const FEDERAL_BRACKETS_MFJ = [
  { rate: 0.10, min: 0,       max: 23200 },
  { rate: 0.12, min: 23200,   max: 94300 },
  { rate: 0.22, min: 94300,   max: 201050 },
  { rate: 0.24, min: 201050,  max: 383900 },
  { rate: 0.32, min: 383900,  max: 487450 },
  { rate: 0.35, min: 487450,  max: 731200 },
  { rate: 0.37, min: 731200,  max: Infinity },
];

// Standard deductions 2024
const STD_DEDUCTION: Record<string, number> = { single: 14600, married: 29200, head: 21900 };

// State income tax rates (approximate flat/effective rates for simplicity)
const STATE_TAX: Record<string, number> = {
  "No State Tax": 0,
  Alaska: 0, Florida: 0, Nevada: 0, "New Hampshire": 0,
  "South Dakota": 0, Tennessee: 0, Texas: 0, Wyoming: 0,
  Washington: 0, California: 0.0725, "New York": 0.0685,
  "New Jersey": 0.0637, Illinois: 0.0495, Pennsylvania: 0.0307,
  Ohio: 0.0399, Michigan: 0.0425, Georgia: 0.055,
  "North Carolina": 0.0499, Virginia: 0.0575, Massachusetts: 0.05,
  Maryland: 0.0475, Minnesota: 0.0685, Wisconsin: 0.0530,
  Colorado: 0.044, Arizona: 0.025, Utah: 0.0465,
  Oregon: 0.0875, "South Carolina": 0.0600, "West Virginia": 0.065,
  "Other (estimate)": 0.05,
};

function calcFederalTax(taxable: number, filing: string): number {
  const brackets = filing === "married" ? FEDERAL_BRACKETS_MFJ : FEDERAL_BRACKETS_SINGLE;
  let tax = 0;
  for (const b of brackets) {
    if (taxable <= b.min) break;
    tax += (Math.min(taxable, b.max) - b.min) * b.rate;
  }
  return tax;
}

export default function UsSalaryCalculatorTool() {
  const [salary, setSalary]     = useState("75000");
  const [filing, setFiling]     = useState("single");
  const [state, setState]       = useState("No State Tax");
  const [period, setPeriod]     = useState("annual");

  const FILING_LABELS: Record<string, string> = {
    single: "Single", married: "Married Filing Jointly", head: "Head of Household",
  };

  const result = useMemo(() => {
    let annualGross = Math.max(0, toNum(salary));
    if (period === "monthly")     annualGross *= 12;
    if (period === "biweekly")    annualGross *= 26;
    if (period === "weekly")      annualGross *= 52;
    if (period === "hourly")      annualGross *= 2080;

    const stdDeduction = STD_DEDUCTION[filing] ?? 14600;
    const federalTaxable = Math.max(0, annualGross - stdDeduction);
    const federalTax = calcFederalTax(federalTaxable, filing);

    // FICA 2024
    const ssTaxable = Math.min(annualGross, 168600);
    const socialSecurity = ssTaxable * 0.062;
    const medicare = annualGross > 200000
      ? 200000 * 0.0145 + (annualGross - 200000) * 0.0235
      : annualGross * 0.0145;

    const stateTaxRate = STATE_TAX[state] ?? 0;
    const stateTax = federalTaxable * stateTaxRate;

    const totalTax = federalTax + socialSecurity + medicare + stateTax;
    const takeHome = annualGross - totalTax;
    const effectiveRate = annualGross > 0 ? (totalTax / annualGross) * 100 : 0;

    return {
      grossAnnual: annualGross,
      federalTax,
      socialSecurity,
      medicare,
      stateTax,
      totalTax,
      takeHome,
      effectiveRate,
      takeHomeMonthly: takeHome / 12,
      takeHomeBiweekly: takeHome / 26,
    };
  }, [salary, filing, state, period]);

  return (
    <ToolPageLayout
      title="US Salary Calculator"
      description="Calculate your US take-home pay after federal income tax, Social Security, Medicare and state income tax for 2024–2025."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <Field label="Gross Salary / Wage">
          <TextInput type="number" min={0} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 75000" />
        </Field>

        <Field label="Pay Period">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="annual">Annual</option>
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="weekly">Weekly</option>
            <option value="hourly">Hourly (×2,080 hrs/yr)</option>
          </select>
        </Field>

        <Field label="Filing Status">
          <select value={filing} onChange={(e) => setFiling(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="head">Head of Household</option>
          </select>
        </Field>

        <Field label="State">
          <select value={state} onChange={(e) => setState(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            {Object.keys(STATE_TAX).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <ResultBox>
          <ResultRow label="Annual Gross Salary"     value={fmt(result.grossAnnual)} />
          <ResultRow label="Federal Income Tax"      value={`-${fmt(result.federalTax)}`} />
          <ResultRow label="Social Security (6.2%)"  value={`-${fmt(result.socialSecurity)}`} />
          <ResultRow label="Medicare (1.45%)"        value={`-${fmt(result.medicare)}`} />
          <ResultRow label={`${state} State Tax`}    value={`-${fmt(result.stateTax)}`} />
          <ResultRow label="Annual Take-Home Pay"    value={fmt(result.takeHome)}/>
          <ResultRow label="Monthly Take-Home"       value={fmt(result.takeHomeMonthly)} />
          <ResultRow label="Bi-weekly Take-Home"     value={fmt(result.takeHomeBiweekly)} />
          <ResultRow label="Effective Tax Rate"      value={`${result.effectiveRate.toFixed(1)}%`} />
        </ResultBox>
      </Card>

      <p style={{ marginTop: "1rem", fontSize: ".8rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
        <strong>Disclaimer:</strong> This calculator uses 2024 federal tax brackets and standard deductions.
        State tax rates are simplified approximations. Results are estimates for informational purposes only.
        Consult a qualified tax professional for advice specific to your situation.
      </p>
    </ToolPageLayout>
  );
}
