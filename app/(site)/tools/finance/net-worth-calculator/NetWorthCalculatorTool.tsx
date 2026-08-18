"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

const ASSET_FIELDS = [
  { key: "cash",          label: "Cash & Bank Accounts" },
  { key: "investments",   label: "Investments (stocks, bonds, funds)" },
  { key: "retirement",    label: "Retirement Accounts (401k, IRA, pension)" },
  { key: "property",      label: "Real Estate / Property Value" },
  { key: "vehicle",       label: "Vehicles" },
  { key: "business",      label: "Business Ownership Value" },
  { key: "otherAssets",   label: "Other Assets" },
];

const LIABILITY_FIELDS = [
  { key: "mortgage",      label: "Mortgage Balance" },
  { key: "carLoan",       label: "Car Loan Balance" },
  { key: "studentLoan",   label: "Student Loan Balance" },
  { key: "creditCard",    label: "Credit Card Debt" },
  { key: "personalLoan",  label: "Personal Loan Balance" },
  { key: "otherDebt",     label: "Other Debts" },
];

export default function NetWorthCalculatorTool() {
  const [assets, setAssets]       = useState<Record<string, string>>({});
  const [liabilities, setLiabs]   = useState<Record<string, string>>({});

  const totalAssets      = ASSET_FIELDS.reduce((s, f)    => s + toNum(assets[f.key] ?? "0"), 0);
  const totalLiabilities = LIABILITY_FIELDS.reduce((s, f) => s + toNum(liabilities[f.key] ?? "0"), 0);
  const netWorth         = totalAssets - totalLiabilities;

  return (
    <ToolPageLayout
      title="Net Worth Calculator"
      description="Add up your assets and subtract your liabilities to see your personal net worth. All data stays in your browser."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <h3 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--indigo)" }}>Assets</h3>
        {ASSET_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <TextInput
              type="number" min={0}
              value={assets[f.key] ?? ""}
              onChange={(e) => setAssets((prev) => ({ ...prev, [f.key]: e.target.value }))}
              placeholder="0"
            />
          </Field>
        ))}

        <h3 style={{ fontWeight: 700, margin: "1.5rem 0 1rem", color: "var(--indigo)" }}>Liabilities</h3>
        {LIABILITY_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <TextInput
              type="number" min={0}
              value={liabilities[f.key] ?? ""}
              onChange={(e) => setLiabs((prev) => ({ ...prev, [f.key]: e.target.value }))}
              placeholder="0"
            />
          </Field>
        ))}

        <ResultBox>
          <ResultRow label="Total Assets"      value={fmt(totalAssets)} />
          <ResultRow label="Total Liabilities" value={fmt(totalLiabilities)} />
          <ResultRow
            label="Net Worth"
            value={(netWorth >= 0 ? "" : "-") + fmt(Math.abs(netWorth))}
            highlight
          />
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
