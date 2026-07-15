"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNumber(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const QUICK_TIPS = [10, 15, 18, 20];

export default function TipCalculatorTool() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");

  const result = useMemo(() => {
    const billAmount = toNumber(bill);
    const tipPct = toNumber(tipPercent);
    const peopleCount = Math.max(1, Math.floor(toNumber(people) ?? 1));

    if (billAmount === null || billAmount < 0 || tipPct === null || tipPct < 0) {
      return null;
    }

    const tipAmount = billAmount * (tipPct / 100);
    const total = billAmount + tipAmount;
    const perPersonTotal = total / peopleCount;
    const perPersonTip = tipAmount / peopleCount;

    return { tipAmount, total, perPersonTotal, perPersonTip };
  }, [bill, tipPercent, people]);

  return (
    <ToolPageLayout
      title="Tip Calculator"
      description="Calculate tip amount, total bill, and per-person split, free and instantly."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Bill Amount">
          <TextInput
            type="number"
            inputMode="decimal"
            placeholder="e.g. 100"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
          />
        </Field>

        <Field label="Tip Percentage">
          <TextInput
            type="number"
            inputMode="decimal"
            placeholder="e.g. 15"
            value={tipPercent}
            onChange={(e) => setTipPercent(e.target.value)}
          />
        </Field>

        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "1.1rem" }}>
          {QUICK_TIPS.map((pct) => (
            <button
              key={pct}
              type="button"
              className={tipPercent === String(pct) ? "btn-primary sm" : "btn-secondary sm"}
              onClick={() => setTipPercent(String(pct))}
            >
              {pct}%
            </button>
          ))}
        </div>

        <Field label="Number of People">
          <TextInput
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="e.g. 2"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </Field>

        <ResultBox>
          <ResultRow label="Tip Amount" value={result ? result.tipAmount.toFixed(2) : "0.00"} />
          <ResultRow label="Total with Tip" value={result ? result.total.toFixed(2) : "0.00"} />
          <ResultRow
            label="Per Person (Total)"
            value={result ? result.perPersonTotal.toFixed(2) : "0.00"}
          />
          <ResultRow
            label="Per Person (Tip)"
            value={result ? result.perPersonTip.toFixed(2) : "0.00"}
          />
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
