"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number, currency = "$") {
  return currency + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type AmortRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

const CURRENCIES: Record<string, string> = {
  USD: "$", GBP: "£", CAD: "CA$", AUD: "A$", INR: "₹",
};

export default function MortgageCalculatorTool() {
  const [loanAmount, setLoanAmount]   = useState("300000");
  const [interestRate, setInterestRate] = useState("7.0");
  const [termYears, setTermYears]     = useState("30");
  const [currency, setCurrency]       = useState("USD");
  const [showFull, setShowFull]       = useState(false);

  const sym = CURRENCIES[currency] ?? "$";

  const { monthlyPayment, totalInterest, totalPayment, schedule } = useMemo(() => {
    const P = Math.max(0, toNum(loanAmount));
    const annualRate = Math.max(0, toNum(interestRate));
    const years = Math.max(0, Math.trunc(toNum(termYears)));
    const n = years * 12;
    const r = annualRate / 100 / 12;

    if (P <= 0 || n <= 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, schedule: [] as AmortRow[] };
    }

    let mp: number;
    if (r === 0) {
      mp = P / n;
    } else {
      const factor = Math.pow(1 + r, n);
      mp = (P * r * factor) / (factor - 1);
    }

    const total = mp * n;
    const interest = total - P;

    const rows: AmortRow[] = [];
    let balance = P;
    for (let m = 1; m <= n; m++) {
      const iPayment = balance * r;
      const pPayment = mp - iPayment;
      balance = Math.max(balance - pPayment, 0);
      rows.push({ month: m, payment: mp, principal: pPayment, interest: iPayment, balance });
    }

    return { monthlyPayment: mp, totalInterest: interest, totalPayment: total, schedule: rows };
  }, [loanAmount, interestRate, termYears]);

  const displayRows = showFull ? schedule : schedule.slice(0, 12);

  return (
    <ToolPageLayout
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payment, total interest cost and full amortization schedule for any home loan."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <Field label="Currency">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              width: "100%", padding: ".6rem .9rem", borderRadius: 8,
              border: "1px solid var(--border)", fontSize: "1rem", background: "#fff",
            }}
          >
            <option value="USD">USD – US Dollar ($)</option>
            <option value="GBP">GBP – British Pound (£)</option>
            <option value="CAD">CAD – Canadian Dollar (CA$)</option>
            <option value="AUD">AUD – Australian Dollar (A$)</option>
            <option value="INR">INR – Indian Rupee (₹)</option>
          </select>
        </Field>

        <Field label="Loan Amount">
          <TextInput
            type="number" min={0} value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="e.g. 300000"
          />
        </Field>

        <Field label="Annual Interest Rate (%)">
          <TextInput
            type="number" min={0} step="0.01" value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="e.g. 7.0"
          />
        </Field>

        <Field label="Loan Term (years)">
          <TextInput
            type="number" min={1} max={50} value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
            placeholder="e.g. 30"
          />
        </Field>

        <ResultBox>
          <ResultRow label="Monthly Payment"       value={fmt(monthlyPayment, sym)} highlight />
          <ResultRow label="Total Interest Payable" value={fmt(totalInterest, sym)} />
          <ResultRow label="Total Amount Payable"   value={fmt(totalPayment, sym)} />
        </ResultBox>
      </Card>

      {schedule.length > 0 && (
        <div style={{ marginTop: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: ".8rem" }}>
            Amortization Schedule
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
              <thead>
                <tr>
                  {["Month", "Payment", "Principal", "Interest", "Balance"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: ".5rem .7rem", borderBottom: "1px solid var(--border-2)",
                        textAlign: h === "Month" ? "left" : "right", fontWeight: 700,
                        background: "var(--indigo-light)", whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row) => (
                  <tr key={row.month}>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: "left" }}>{row.month}</td>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: "right" }}>{fmt(row.payment, sym)}</td>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: "right" }}>{fmt(row.principal, sym)}</td>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: "right" }}>{fmt(row.interest, sym)}</td>
                    <td style={{ padding: ".45rem .7rem", borderBottom: "1px solid var(--border-2)", textAlign: "right" }}>{fmt(row.balance, sym)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {schedule.length > 12 && (
            <button
              onClick={() => setShowFull(!showFull)}
              style={{
                marginTop: ".75rem", background: "none", border: "1px solid var(--indigo)",
                color: "var(--indigo)", borderRadius: 8, padding: ".4rem 1rem",
                cursor: "pointer", fontSize: ".85rem", fontWeight: 600,
              }}
            >
              {showFull ? "Show less" : `Show all ${schedule.length} months`}
            </button>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
}
