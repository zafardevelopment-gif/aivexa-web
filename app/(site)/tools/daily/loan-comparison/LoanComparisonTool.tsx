"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TabGroup } from "@/components/tools/ToolUI";

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

type LoanInput = {
  amount: string;
  rate: string;
  tenure: string;
};

type LoanResult = {
  label: string;
  emi: number;
  totalInterest: number;
  totalPayment: number;
};

const LABELS = ["Loan A", "Loan B", "Loan C"];

function calcLoan(amount: string, rate: string, tenure: string): { emi: number; totalInterest: number; totalPayment: number } {
  const p = Math.max(0, toNumber(amount));
  const annualRate = Math.max(0, toNumber(rate));
  const n = Math.max(0, Math.trunc(toNumber(tenure)));
  const r = annualRate / 12 / 100;

  if (p <= 0 || n <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0 };
  }

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1); when r = 0, EMI is simply P/n.
  let emi: number;
  if (r === 0) {
    emi = p / n;
  } else {
    const factor = Math.pow(1 + r, n);
    emi = (p * r * factor) / (factor - 1);
  }

  const totalPayment = emi * n;
  return { emi, totalInterest: totalPayment - p, totalPayment };
}

const cellStyle = (bold = false): React.CSSProperties => ({
  padding: ".5rem .7rem",
  borderBottom: "1px solid var(--border-2)",
  fontSize: ".85rem",
  textAlign: "right",
  fontWeight: bold ? 700 : 400,
});

export default function LoanComparisonTool() {
  const [count, setCount] = useState<"2" | "3">("2");
  const [loans, setLoans] = useState<LoanInput[]>([
    { amount: "500000", rate: "10", tenure: "60" },
    { amount: "500000", rate: "12", tenure: "60" },
    { amount: "500000", rate: "9", tenure: "72" },
  ]);

  const activeCount = count === "2" ? 2 : 3;

  const updateLoan = (index: number, field: keyof LoanInput, value: string) => {
    setLoans((prev) => prev.map((loan, i) => (i === index ? { ...loan, [field]: value } : loan)));
  };

  const results: LoanResult[] = useMemo(() => {
    return loans.slice(0, activeCount).map((loan, i) => ({
      label: LABELS[i],
      ...calcLoan(loan.amount, loan.rate, loan.tenure),
    }));
  }, [loans, activeCount]);

  const cheapestIndex = useMemo(() => {
    const valid = results
      .map((r, i) => ({ i, interest: r.totalInterest }))
      .filter((r) => r.interest > 0);
    if (valid.length === 0) return -1;
    return valid.reduce((min, cur) => (cur.interest < min.interest ? cur : min)).i;
  }, [results]);

  return (
    <ToolPageLayout
      title="Loan Comparison Calculator"
      description="Compare EMI, total interest, and total payment across two or three loans side by side to find the cheapest option."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <TabGroup
        options={[
          { value: "2", label: "Compare 2 Loans" },
          { value: "3", label: "Compare 3 Loans" },
        ]}
        value={count}
        onChange={(v) => setCount(v as "2" | "3")}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: activeCount === 2 ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: "1rem",
        }}
      >
        {loans.slice(0, activeCount).map((loan, i) => (
          <Card key={LABELS[i]}>
            <h3 style={{ fontSize: ".95rem", fontWeight: 700, marginBottom: "1rem" }}>{LABELS[i]}</h3>
            <Field label="Amount">
              <TextInput
                type="number"
                min={0}
                value={loan.amount}
                onChange={(e) => updateLoan(i, "amount", e.target.value)}
              />
            </Field>
            <Field label="Annual Rate (%)">
              <TextInput
                type="number"
                min={0}
                step="0.01"
                value={loan.rate}
                onChange={(e) => updateLoan(i, "rate", e.target.value)}
              />
            </Field>
            <Field label="Tenure (months)">
              <TextInput
                type="number"
                min={0}
                value={loan.tenure}
                onChange={(e) => updateLoan(i, "tenure", e.target.value)}
              />
            </Field>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: ".8rem" }}>Comparison</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: ".5rem .7rem",
                    borderBottom: "1px solid var(--border-2)",
                    fontSize: ".85rem",
                    textAlign: "left",
                    fontWeight: 700,
                    background: "var(--indigo-light)",
                  }}
                >
                  Metric
                </th>
                {results.map((r, i) => (
                  <th
                    key={r.label}
                    style={{
                      padding: ".5rem .7rem",
                      borderBottom: "1px solid var(--border-2)",
                      fontSize: ".85rem",
                      textAlign: "right",
                      fontWeight: 700,
                      background: "var(--indigo-light)",
                    }}
                  >
                    {r.label}
                    {i === cheapestIndex && (
                      <span
                        style={{
                          display: "block",
                          fontSize: ".7rem",
                          fontWeight: 700,
                          color: "var(--indigo)",
                          marginTop: ".15rem",
                        }}
                      >
                        Cheapest option
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: ".5rem .7rem",
                    borderBottom: "1px solid var(--border-2)",
                    fontSize: ".85rem",
                    textAlign: "left",
                  }}
                >
                  EMI
                </td>
                {results.map((r, i) => (
                  <td
                    key={r.label}
                    style={{
                      ...cellStyle(i === cheapestIndex),
                      background: i === cheapestIndex ? "var(--indigo-light)" : undefined,
                    }}
                  >
                    {r.emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                ))}
              </tr>
              <tr>
                <td
                  style={{
                    padding: ".5rem .7rem",
                    borderBottom: "1px solid var(--border-2)",
                    fontSize: ".85rem",
                    textAlign: "left",
                  }}
                >
                  Total Interest
                </td>
                {results.map((r, i) => (
                  <td
                    key={r.label}
                    style={{
                      ...cellStyle(i === cheapestIndex),
                      background: i === cheapestIndex ? "var(--indigo-light)" : undefined,
                    }}
                  >
                    {r.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                ))}
              </tr>
              <tr>
                <td
                  style={{
                    padding: ".5rem .7rem",
                    borderBottom: "1px solid var(--border-2)",
                    fontSize: ".85rem",
                    textAlign: "left",
                  }}
                >
                  Total Payment
                </td>
                {results.map((r, i) => (
                  <td
                    key={r.label}
                    style={{
                      ...cellStyle(i === cheapestIndex),
                      background: i === cheapestIndex ? "var(--indigo-light)" : undefined,
                    }}
                  >
                    {r.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ToolPageLayout>
  );
}
