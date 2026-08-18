"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const FREQ_MAP: Record<string, number> = {
  daily: 365, weekly: 52, monthly: 12, quarterly: 4, "semi-annually": 2, annually: 1,
};

type YearRow = { year: number; balance: number; interest: number; contributions: number };

export default function CompoundInterestCalculatorTool() {
  const [principal, setPrincipal]         = useState("10000");
  const [rate, setRate]                   = useState("8");
  const [years, setYears]                 = useState("10");
  const [frequency, setFrequency]         = useState("monthly");
  const [contribution, setContribution]   = useState("0");
  const [contribFreq, setContribFreq]     = useState("monthly");

  const result = useMemo(() => {
    const P     = Math.max(0, toNum(principal));
    const r     = Math.max(0, toNum(rate)) / 100;
    const t     = Math.max(0, Math.trunc(toNum(years)));
    const n     = FREQ_MAP[frequency] ?? 12;
    const pmt   = Math.max(0, toNum(contribution));
    const pmtN  = FREQ_MAP[contribFreq] ?? 12;

    if (t === 0) return { futureValue: P, totalInterest: 0, totalContributions: 0, rows: [] as YearRow[] };

    const rows: YearRow[] = [];
    let balance = P;
    let totalContrib = 0;

    for (let yr = 1; yr <= t; yr++) {
      const startBalance = balance;
      // Apply compound interest for each sub-period
      for (let period = 1; period <= n; period++) {
        balance *= (1 + r / n);
        // Add contributions proportionally
        const periodsPerYear = n;
        const contribPerPeriod = pmt * (pmtN / periodsPerYear);
        balance += contribPerPeriod;
        totalContrib += contribPerPeriod;
      }
      rows.push({
        year: yr,
        balance,
        interest: balance - startBalance - pmt * pmtN,
        contributions: pmt * pmtN,
      });
    }

    return {
      futureValue: balance,
      totalInterest: balance - P - totalContrib,
      totalContributions: totalContrib,
      rows,
    };
  }, [principal, rate, years, frequency, contribution, contribFreq]);

  return (
    <ToolPageLayout
      title="Compound Interest Calculator"
      description="See how your money grows with the power of compounding. Choose daily, monthly or annual compounding and add regular contributions."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <Field label="Principal Amount">
          <TextInput type="number" min={0} value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 10000" />
        </Field>

        <Field label="Annual Interest Rate (%)">
          <TextInput type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 8" />
        </Field>

        <Field label="Time Period (years)">
          <TextInput type="number" min={1} max={100} value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 10" />
        </Field>

        <Field label="Compounding Frequency">
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semi-annually">Semi-Annually</option>
            <option value="annually">Annually</option>
          </select>
        </Field>

        <Field label="Regular Contribution (optional)">
          <TextInput type="number" min={0} value={contribution} onChange={(e) => setContribution(e.target.value)} placeholder="e.g. 500" />
        </Field>

        <Field label="Contribution Frequency">
          <select value={contribFreq} onChange={(e) => setContribFreq(e.target.value)}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </Field>

        <ResultBox>
          <ResultRow label="Future Value"            value={fmt(result.futureValue)}/>
          <ResultRow label="Total Interest Earned"   value={fmt(result.totalInterest)} />
          <ResultRow label="Total Contributions"     value={fmt(result.totalContributions)} />
        </ResultBox>
      </Card>

      {result.rows.length > 0 && (
        <div style={{ marginTop: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: ".8rem" }}>Year-by-Year Growth</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
              <thead>
                <tr>
                  {["Year", "Balance", "Interest Earned", "Contributions"].map((h) => (
                    <th key={h} style={{ padding: ".5rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: h === "Year" ? "left" : "right", fontWeight: 700, background: "var(--indigo-light)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.year}>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)" }}>{row.year}</td>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: "right" }}>{fmt(row.balance)}</td>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: "right" }}>{fmt(row.interest)}</td>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: "right" }}>{fmt(row.contributions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
