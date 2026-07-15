"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  SelectInput,
  ResultBox,
  ResultRow,
  TabGroup,
} from "@/components/tools/ToolUI";

type Mode = "simple" | "compound";

const COMPOUNDING_OPTIONS = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semi-Annually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
];

function toNumber(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function SimpleCompoundInterestTool() {
  const [mode, setMode] = useState<Mode>("simple");
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState("1");

  const result = useMemo(() => {
    const p = toNumber(principal);
    const r = toNumber(rate);
    const t = toNumber(years);
    if (p === null || r === null || t === null) return null;

    if (mode === "simple") {
      const amount = p * (1 + (r / 100) * t);
      return { amount, interest: amount - p };
    }

    const n = Number(frequency) || 1;
    const amount = p * Math.pow(1 + r / 100 / n, n * t);
    return { amount, interest: amount - p };
  }, [mode, principal, rate, years, frequency]);

  return (
    <ToolPageLayout
      title="Simple & Compound Interest Calculator"
      description="Calculate simple or compound interest on savings, investments, or loans, free and instant."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <TabGroup
          options={[
            { value: "simple", label: "Simple Interest" },
            { value: "compound", label: "Compound Interest" },
          ]}
          value={mode}
          onChange={(v) => setMode(v as Mode)}
        />

        <Field label="Principal Amount">
          <TextInput
            type="number"
            inputMode="decimal"
            placeholder="e.g. 1000"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </Field>

        <Field label="Annual Interest Rate (%)">
          <TextInput
            type="number"
            inputMode="decimal"
            placeholder="e.g. 5"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>

        <Field label="Time (Years)">
          <TextInput
            type="number"
            inputMode="decimal"
            placeholder="e.g. 5"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>

        {mode === "compound" && (
          <Field label="Compounding Frequency">
            <SelectInput value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              {COMPOUNDING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectInput>
          </Field>
        )}

        <ResultBox>
          <ResultRow
            label="Final Amount"
            value={
              result
                ? result.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : "0"
            }
          />
          <ResultRow
            label="Interest Earned"
            value={
              result
                ? result.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : "0"
            }
          />
        </ResultBox>

        <p style={{ marginTop: "1rem", fontSize: ".85rem", color: "var(--muted)" }}>
          Formula used: {mode === "simple" ? "A = P(1 + rt)" : "A = P(1 + r/n)^(nt)"}
        </p>
      </Card>
    </ToolPageLayout>
  );
}
