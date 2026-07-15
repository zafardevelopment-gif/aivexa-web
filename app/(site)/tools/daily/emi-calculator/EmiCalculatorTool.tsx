"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

type AmortRow = {
  month: number;
  opening: number;
  emi: number;
  principal: number;
  interest: number;
  closing: number;
};

export default function EmiCalculatorTool() {
  const [principal, setPrincipal] = useState("500000");
  const [rate, setRate] = useState("10");
  const [tenure, setTenure] = useState("60");

  const { emi, totalInterest, totalPayment, schedule } = useMemo(() => {
    const p = Math.max(0, toNumber(principal));
    const annualRate = Math.max(0, toNumber(rate));
    const n = Math.max(0, Math.trunc(toNumber(tenure)));
    const r = annualRate / 12 / 100;

    if (p <= 0 || n <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [] as AmortRow[] };
    }

    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1); when r = 0, EMI is simply P/n.
    let monthlyEmi: number;
    if (r === 0) {
      monthlyEmi = p / n;
    } else {
      const factor = Math.pow(1 + r, n);
      monthlyEmi = (p * r * factor) / (factor - 1);
    }

    const total = monthlyEmi * n;
    const interest = total - p;

    const rows: AmortRow[] = [];
    let balance = p;
    const rowsToShow = Math.min(n, 12);
    for (let m = 1; m <= rowsToShow; m++) {
      const interestPaid = balance * r;
      const principalPaid = monthlyEmi - interestPaid;
      const opening = balance;
      balance = balance - principalPaid;
      rows.push({
        month: m,
        opening,
        emi: monthlyEmi,
        principal: principalPaid,
        interest: interestPaid,
        closing: Math.max(balance, 0),
      });
    }

    return {
      emi: monthlyEmi,
      totalInterest: interest,
      totalPayment: total,
      schedule: rows,
    };
  }, [principal, rate, tenure]);

  const tenureNum = Math.max(0, Math.trunc(toNumber(tenure)));

  return (
    <ToolPageLayout
      title="EMI Calculator"
      description="Calculate your monthly loan EMI, total interest payable, and view a month-by-month amortization schedule instantly."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Loan Amount (Principal)">
          <TextInput
            type="number"
            min={0}
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="e.g. 500000"
          />
        </Field>
        <Field label="Annual Interest Rate (%)">
          <TextInput
            type="number"
            min={0}
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 10"
          />
        </Field>
        <Field label="Loan Tenure (months)">
          <TextInput
            type="number"
            min={0}
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="e.g. 60"
          />
        </Field>

        <ResultBox>
          <ResultRow
            label="Monthly EMI"
            value={emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          />
          <ResultRow
            label="Total Interest Payable"
            value={totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          />
          <ResultRow
            label="Total Payment"
            value={totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          />
        </ResultBox>
      </Card>

      {schedule.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: ".8rem" }}>
            Amortization Schedule
          </h2>
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
                    Month
                  </th>
                  <th
                    style={{
                      padding: ".5rem .7rem",
                      borderBottom: "1px solid var(--border-2)",
                      fontSize: ".85rem",
                      textAlign: "right",
                      fontWeight: 700,
                      background: "var(--indigo-light)",
                    }}
                  >
                    Opening Balance
                  </th>
                  <th
                    style={{
                      padding: ".5rem .7rem",
                      borderBottom: "1px solid var(--border-2)",
                      fontSize: ".85rem",
                      textAlign: "right",
                      fontWeight: 700,
                      background: "var(--indigo-light)",
                    }}
                  >
                    EMI
                  </th>
                  <th
                    style={{
                      padding: ".5rem .7rem",
                      borderBottom: "1px solid var(--border-2)",
                      fontSize: ".85rem",
                      textAlign: "right",
                      fontWeight: 700,
                      background: "var(--indigo-light)",
                    }}
                  >
                    Principal Paid
                  </th>
                  <th
                    style={{
                      padding: ".5rem .7rem",
                      borderBottom: "1px solid var(--border-2)",
                      fontSize: ".85rem",
                      textAlign: "right",
                      fontWeight: 700,
                      background: "var(--indigo-light)",
                    }}
                  >
                    Interest Paid
                  </th>
                  <th
                    style={{
                      padding: ".5rem .7rem",
                      borderBottom: "1px solid var(--border-2)",
                      fontSize: ".85rem",
                      textAlign: "right",
                      fontWeight: 700,
                      background: "var(--indigo-light)",
                    }}
                  >
                    Closing Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month}>
                    <td
                      style={{
                        padding: ".5rem .7rem",
                        borderBottom: "1px solid var(--border-2)",
                        fontSize: ".85rem",
                        textAlign: "left",
                      }}
                    >
                      {row.month}
                    </td>
                    <td
                      style={{
                        padding: ".5rem .7rem",
                        borderBottom: "1px solid var(--border-2)",
                        fontSize: ".85rem",
                        textAlign: "right",
                      }}
                    >
                      {row.opening.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td
                      style={{
                        padding: ".5rem .7rem",
                        borderBottom: "1px solid var(--border-2)",
                        fontSize: ".85rem",
                        textAlign: "right",
                      }}
                    >
                      {row.emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td
                      style={{
                        padding: ".5rem .7rem",
                        borderBottom: "1px solid var(--border-2)",
                        fontSize: ".85rem",
                        textAlign: "right",
                      }}
                    >
                      {row.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td
                      style={{
                        padding: ".5rem .7rem",
                        borderBottom: "1px solid var(--border-2)",
                        fontSize: ".85rem",
                        textAlign: "right",
                      }}
                    >
                      {row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td
                      style={{
                        padding: ".5rem .7rem",
                        borderBottom: "1px solid var(--border-2)",
                        fontSize: ".85rem",
                        textAlign: "right",
                      }}
                    >
                      {row.closing.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tenureNum > 12 && (
            <p style={{ marginTop: ".7rem", fontSize: ".82rem", color: "var(--muted-2)" }}>
              Showing first 12 months of {tenureNum} total.
            </p>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
}
