"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const pct = (n: number) => n.toFixed(2) + "%";

export default function RentalRoiCalculatorTool() {
  const [price, setPrice] = useState("");
  const [extraCost, setExtraCost] = useState("");
  const [rent, setRent] = useState("");
  const [vacancy, setVacancy] = useState("1");
  const [maintenance, setMaintenance] = useState("");
  const [tax, setTax] = useState("");
  const [appreciation, setAppreciation] = useState("5");

  const r = useMemo(() => {
    const P = (+price || 0) + (+extraCost || 0);
    const monthlyRent = +rent || 0;
    if (!P || !monthlyRent) return null;
    const months = 12 - Math.min(12, Math.max(0, +vacancy || 0));
    const grossAnnual = monthlyRent * months;
    const expenses = ((+maintenance || 0) * 12) + (+tax || 0);
    const netAnnual = grossAnnual - expenses;
    const grossYield = (monthlyRent * 12 / P) * 100;
    const netYield = (netAnnual / P) * 100;
    const appr = +appreciation || 0;
    const totalReturn = netYield + appr;
    const payback = netAnnual > 0 ? P / netAnnual : null;
    return { P, grossAnnual, expenses, netAnnual, grossYield, netYield, totalReturn, payback };
  }, [price, extraCost, rent, vacancy, maintenance, tax, appreciation]);

  return (
    <ToolPageLayout
      title="Rental ROI Calculator"
      description="Check if a rental property is a good investment — gross yield, net yield, total ROI with appreciation, and payback period."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          <Field label="Property purchase price (₹)">
            <TextInput type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 5000000" />
          </Field>
          <Field label="Registration + interiors etc. (₹)">
            <TextInput type="number" min={0} value={extraCost} onChange={(e) => setExtraCost(e.target.value)} placeholder="e.g. 400000" />
          </Field>
          <Field label="Expected monthly rent (₹)">
            <TextInput type="number" min={0} value={rent} onChange={(e) => setRent(e.target.value)} placeholder="e.g. 18000" />
          </Field>
          <Field label="Vacancy (months/year)">
            <TextInput type="number" min={0} max={12} value={vacancy} onChange={(e) => setVacancy(e.target.value)} />
          </Field>
          <Field label="Monthly maintenance (₹)">
            <TextInput type="number" min={0} value={maintenance} onChange={(e) => setMaintenance(e.target.value)} placeholder="e.g. 2500" />
          </Field>
          <Field label="Yearly property tax (₹)">
            <TextInput type="number" min={0} value={tax} onChange={(e) => setTax(e.target.value)} placeholder="e.g. 8000" />
          </Field>
        </div>
        <Field label="Expected annual appreciation (%)">
          <TextInput type="number" min={0} value={appreciation} onChange={(e) => setAppreciation(e.target.value)} />
        </Field>

        {r && (
          <ResultBox>
            <ResultRow label="Total investment" value={inr(r.P)} />
            <ResultRow label="Gross annual rent (after vacancy)" value={inr(r.grossAnnual)} />
            <ResultRow label="Annual expenses" value={inr(r.expenses)} />
            <ResultRow label="Net annual income" value={inr(r.netAnnual)} />
            <ResultRow label="Gross rental yield" value={pct(r.grossYield)} />
            <ResultRow label="Net rental yield" value={<span style={{ color: "var(--indigo)" }}>{pct(r.netYield)}</span>} />
            <ResultRow label="Total ROI (yield + appreciation)" value={pct(r.totalReturn)} />
            <ResultRow
              label="Payback period (rent only)"
              value={r.payback ? `${r.payback.toFixed(1)} years` : "—"}
            />
          </ResultBox>
        )}

        <p style={{ marginTop: "1.2rem", fontSize: ".85rem", color: "var(--muted)" }}>
          Typical residential net yields in India range 2–4%; commercial 6–9%. Estimates only —
          not investment advice.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
