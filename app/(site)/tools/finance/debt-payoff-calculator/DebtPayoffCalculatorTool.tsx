"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function fmt(n: number) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

type Debt = { id: number; name: string; balance: string; rate: string; minPayment: string };

function simulate(debts: Debt[], extraPayment: number, method: "avalanche" | "snowball") {
  const items = debts
    .filter((d) => toNum(d.balance) > 0 && toNum(d.minPayment) > 0)
    .map((d) => ({
      name:    d.name || `Debt ${d.id}`,
      balance: toNum(d.balance),
      rate:    toNum(d.rate) / 100 / 12,
      min:     toNum(d.minPayment),
    }));

  if (items.length === 0) return { months: 0, totalInterest: 0, payoffOrder: [] as string[] };

  let totalInterest = 0;
  let months = 0;
  const payoffOrder: string[] = [];
  let extra = extraPayment;

  while (items.some((d) => d.balance > 0) && months < 600) {
    months++;
    // Apply interest
    for (const d of items) {
      if (d.balance <= 0) continue;
      const interest = d.balance * d.rate;
      totalInterest += interest;
      d.balance += interest;
    }

    // Sort target (avalanche = highest rate first; snowball = lowest balance first)
    const active = items.filter((d) => d.balance > 0);
    active.sort((a, b) =>
      method === "avalanche" ? b.rate - a.rate : a.balance - b.balance
    );

    // Pay minimums
    let remaining = extra;
    for (const d of active) {
      const payment = Math.min(d.min, d.balance);
      d.balance -= payment;
      if (d.balance <= 0) {
        remaining += d.min;
        if (!payoffOrder.includes(d.name)) payoffOrder.push(d.name);
      }
    }

    // Apply extra to target
    if (active.length > 0) {
      const target = active[0];
      if (target.balance > 0) {
        const extra2 = Math.min(remaining, target.balance);
        target.balance -= extra2;
        if (target.balance <= 0 && !payoffOrder.includes(target.name))
          payoffOrder.push(target.name);
      }
    }
  }

  return { months, totalInterest, payoffOrder };
}

let nextId = 3;

export default function DebtPayoffCalculatorTool() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "Credit Card",   balance: "5000",  rate: "24", minPayment: "100" },
    { id: 2, name: "Personal Loan", balance: "10000", rate: "12", minPayment: "200" },
  ]);
  const [extra,  setExtra]  = useState("100");
  const [method, setMethod] = useState<"avalanche" | "snowball">("avalanche");

  const result = useMemo(() => simulate(debts, toNum(extra), method), [debts, extra, method]);

  function updateDebt(id: number, field: keyof Debt, value: string) {
    setDebts((prev) => prev.map((d) => d.id === id ? { ...d, [field]: value } : d));
  }
  function addDebt() {
    setDebts((prev) => [...prev, { id: nextId++, name: "", balance: "", rate: "", minPayment: "" }]);
  }
  function removeDebt(id: number) {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }

  const years  = Math.floor(result.months / 12);
  const months = result.months % 12;

  return (
    <ToolPageLayout
      title="Debt Payoff Calculator"
      description="Compare the avalanche and snowball methods to see how fast you can become debt-free and how much interest you will save."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <Field label="Payoff Strategy">
          <select value={method} onChange={(e) => setMethod(e.target.value as "avalanche" | "snowball")}
            style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 8, border: "1px solid var(--border)", fontSize: "1rem", background: "#fff" }}>
            <option value="avalanche">Avalanche (highest interest rate first — saves most interest)</option>
            <option value="snowball">Snowball (lowest balance first — psychological wins)</option>
          </select>
        </Field>

        <Field label="Extra Monthly Payment (above minimums)">
          <TextInput type="number" min={0} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="e.g. 100" />
        </Field>

        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontWeight: 700, marginBottom: ".75rem" }}>Your Debts</p>
          {debts.map((d) => (
            <div key={d.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: ".5rem", marginBottom: ".6rem", alignItems: "end" }}>
              <Field label="Name">
                <TextInput value={d.name} onChange={(e) => updateDebt(d.id, "name", e.target.value)} placeholder="Credit card" />
              </Field>
              <Field label="Balance">
                <TextInput type="number" value={d.balance} onChange={(e) => updateDebt(d.id, "balance", e.target.value)} placeholder="5000" />
              </Field>
              <Field label="APR (%)">
                <TextInput type="number" value={d.rate} onChange={(e) => updateDebt(d.id, "rate", e.target.value)} placeholder="24" />
              </Field>
              <Field label="Min. Payment">
                <TextInput type="number" value={d.minPayment} onChange={(e) => updateDebt(d.id, "minPayment", e.target.value)} placeholder="100" />
              </Field>
              <button onClick={() => removeDebt(d.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.2rem", paddingBottom: ".4rem" }}>✕</button>
            </div>
          ))}
          <button onClick={addDebt} style={{ marginTop: ".5rem", padding: ".45rem 1rem", border: "1px dashed var(--indigo)", color: "var(--indigo)", borderRadius: 8, background: "none", cursor: "pointer", fontSize: ".88rem", fontWeight: 600 }}>
            + Add Debt
          </button>
        </div>

        <ResultBox>
          <ResultRow label="Debt-Free In"       value={result.months > 0 ? `${years > 0 ? `${years}y ` : ""}${months}m` : "—"}/>
          <ResultRow label="Total Interest Paid" value={fmt(result.totalInterest)} />
          {result.payoffOrder.length > 0 &&
            <ResultRow label="Payoff Order" value={result.payoffOrder.join(" → ")} />}
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
