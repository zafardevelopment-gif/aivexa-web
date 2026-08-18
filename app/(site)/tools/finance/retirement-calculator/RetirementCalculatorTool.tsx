"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

type YearRow = { year: number; age: number; balance: number };

export default function RetirementCalculatorTool() {
  const [currentAge,     setCurrentAge]     = useState("30");
  const [retirementAge,  setRetirementAge]  = useState("60");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [monthlyContrib, setMonthlyContrib] = useState("1000");
  const [annualReturn,   setAnnualReturn]   = useState("8");
  const [inflationRate,  setInflationRate]  = useState("3");
  const [withdrawalYears,setWithdrawalYears]= useState("25");
  const [currency, setCurrency]             = useState("$");

  const result = useMemo(() => {
    const currAge  = Math.max(0, toNum(currentAge));
    const retAge   = Math.max(currAge + 1, toNum(retirementAge));
    const P        = Math.max(0, toNum(currentSavings));
    const pmt      = Math.max(0, toNum(monthlyContrib));
    const r        = Math.max(0, toNum(annualReturn)) / 100;
    const inf      = Math.max(0, toNum(inflationRate)) / 100;
    const drawYrs  = Math.max(1, toNum(withdrawalYears));

    const yearsToRetire = retAge - currAge;
    const monthlyRate   = r / 12;

    // Future value: existing savings + monthly contributions compounded
    let balance = P;
    const rows: YearRow[] = [];

    for (let yr = 1; yr <= yearsToRetire; yr++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) + pmt;
      }
      rows.push({ year: yr, age: currAge + yr, balance });
    }

    const corpus = balance;

    // Real return after inflation
    const realReturn = (1 + r) / (1 + inf) - 1;

    // Monthly income using present value of annuity in real terms
    const monthlyRealRate = realReturn / 12;
    const n = drawYrs * 12;
    let monthlyIncome = 0;
    if (monthlyRealRate > 0 && n > 0) {
      monthlyIncome = (corpus * monthlyRealRate) / (1 - Math.pow(1 + monthlyRealRate, -n));
    } else if (n > 0) {
      monthlyIncome = corpus / n;
    }

    return { corpus, monthlyIncome, rows, yearsToRetire };
  }, [currentAge, retirementAge, currentSavings, monthlyContrib, annualReturn, inflationRate, withdrawalYears]);

  return (
    <ToolPageLayout
      title="Retirement Calculator"
      description="Estimate how much you'll have at retirement and what monthly income it can support, adjusted for inflation."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          <Field label="Current Age">
            <TextInput type="number" min={0} max={100} value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} placeholder="30" />
          </Field>
          <Field label="Retirement Age">
            <TextInput type="number" min={1} max={100} value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} placeholder="60" />
          </Field>
        </div>

        <Field label="Currency Symbol">
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="$">$ (USD / CAD / AUD)</option>
            <option value="£">£ (GBP)</option>
            <option value="€">€ (EUR)</option>
            <option value="₹">₹ (INR)</option>
            <option value="AED">AED</option>
          </select>
        </Field>

        <Field label="Current Savings / Investment Balance">
          <TextInput type="number" min={0} value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} placeholder="e.g. 50000" />
        </Field>

        <Field label="Monthly Contribution">
          <TextInput type="number" min={0} value={monthlyContrib} onChange={(e) => setMonthlyContrib(e.target.value)} placeholder="e.g. 1000" />
        </Field>

        <Field label="Expected Annual Return (%)">
          <TextInput type="number" min={0} step="0.5" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} placeholder="e.g. 8" />
        </Field>

        <Field label="Inflation Rate (%)">
          <TextInput type="number" min={0} step="0.5" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} placeholder="e.g. 3" />
        </Field>

        <Field label="Withdrawal Period After Retirement (years)">
          <TextInput type="number" min={1} value={withdrawalYears} onChange={(e) => setWithdrawalYears(e.target.value)} placeholder="e.g. 25" />
        </Field>

        <ResultBox>
          <ResultRow label="Years to Retirement"         value={`${result.yearsToRetire} years`} />
          <ResultRow label="Estimated Retirement Corpus" value={`${currency}${fmt(result.corpus)}`} highlight />
          <ResultRow label="Monthly Income (real terms)"  value={`${currency}${fmt(result.monthlyIncome)}`} />
        </ResultBox>
      </Card>

      {result.rows.length > 0 && (
        <div style={{ marginTop: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: ".8rem" }}>Savings Growth</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
              <thead>
                <tr>
                  {["Year", "Age", "Balance"].map((h) => (
                    <th key={h} style={{ padding: ".5rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: h === "Year" || h === "Age" ? "left" : "right", fontWeight: 700, background: "var(--indigo-light)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.filter((_, i) => i % 5 === 4 || i === result.rows.length - 1).map((row) => (
                  <tr key={row.year}>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)" }}>{row.year}</td>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)" }}>{row.age}</td>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: "right" }}>{currency}{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: ".5rem", fontSize: ".8rem", color: "var(--muted-2)" }}>Showing every 5th year for brevity.</p>
        </div>
      )}

      <p style={{ marginTop: "1rem", fontSize: ".8rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
        <strong>Disclaimer:</strong> This is a planning estimate only. Actual returns vary. Consult a qualified financial advisor for personalised retirement planning.
      </p>
    </ToolPageLayout>
  );
}
