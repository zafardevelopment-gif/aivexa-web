"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function fmtPct(n: number) { return n.toFixed(2) + "%"; }
function fmtNum(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function RoiCalculatorTool() {
  const [cost, setCost]         = useState("10000");
  const [revenue, setRevenue]   = useState("15000");
  const [years, setYears]       = useState("3");

  const result = useMemo(() => {
    const c = Math.max(0, toNum(cost));
    const r = Math.max(0, toNum(revenue));
    const t = Math.max(0, toNum(years));

    if (c === 0) return { netProfit: 0, roi: 0, annualisedRoi: 0, paybackYears: 0 };

    const netProfit     = r - c;
    const roi           = (netProfit / c) * 100;
    const annualisedRoi = t > 0 ? (Math.pow(r / c, 1 / t) - 1) * 100 : 0;
    const paybackYears  = r > 0 ? c / (r / (t || 1)) : Infinity;

    return { netProfit, roi, annualisedRoi, paybackYears };
  }, [cost, revenue, years]);

  return (
    <ToolPageLayout
      title="ROI Calculator"
      description="Calculate your return on investment — net profit, ROI percentage, annualised ROI and payback period."
      categoryHref="/tools/finance"
      categoryName="Finance & Money Tools"
    >
      <Card>
        <Field label="Initial Investment / Cost">
          <TextInput type="number" min={0} value={cost} onChange={(e) => setCost(e.target.value)} placeholder="e.g. 10000" />
        </Field>
        <Field label="Total Return / Revenue">
          <TextInput type="number" min={0} value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="e.g. 15000" />
        </Field>
        <Field label="Investment Period (years)">
          <TextInput type="number" min={0} step="0.5" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 3" />
        </Field>

        <ResultBox>
          <ResultRow label="Net Profit / Loss"   value={fmtNum(result.netProfit)} highlight />
          <ResultRow label="ROI"                 value={fmtPct(result.roi)} />
          <ResultRow label="Annualised ROI"      value={fmtPct(result.annualisedRoi)} />
          <ResultRow label="Payback Period"
            value={isFinite(result.paybackYears) ? `${result.paybackYears.toFixed(2)} years` : "N/A"} />
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
