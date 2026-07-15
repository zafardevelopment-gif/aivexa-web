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
} from "@/components/tools/ToolUI";

const CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "AED", name: "UAE Dirham" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "ZAR", name: "South African Rand" },
];

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function CurrencyConverterTool() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [rate, setRate] = useState("1");

  const converted = useMemo(() => {
    const amt = Math.max(0, toNumber(amount));
    const r = Math.max(0, toNumber(rate));
    return amt * r;
  }, [amount, rate]);

  return (
    <ToolPageLayout
      title="Currency Converter"
      description="Convert an amount between currencies using an exchange rate you enter yourself, for free, no signup required."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Amount">
          <TextInput
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 100"
          />
        </Field>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <Field label="From currency">
              <SelectInput value={from} onChange={(e) => setFrom(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <Field label="To currency">
              <SelectInput value={to} onChange={(e) => setTo(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>
        </div>

        <Field label={`Exchange rate (1 ${from} = ? ${to})`}>
          <TextInput
            type="number"
            min={0}
            step="0.0001"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 83.25"
          />
        </Field>

        <ResultBox>
          <ResultRow
            label={`${amount || 0} ${from} =`}
            value={`${converted.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${to}`}
          />
          <ResultRow label="Rate used" value={`1 ${from} = ${toNumber(rate)} ${to}`} />
        </ResultBox>

        <p style={{ marginTop: "1rem", fontSize: ".8rem", color: "var(--muted-2)" }}>
          Exchange rates are entered manually and are not fetched live from any external
          service — enter today&apos;s rate yourself for an accurate conversion.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
