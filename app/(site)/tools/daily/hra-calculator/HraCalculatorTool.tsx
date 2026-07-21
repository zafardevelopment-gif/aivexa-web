"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TabGroup, ResultBox, ResultRow } from "@/components/tools/ToolUI";

const inr = (n: number) =>
  "₹" + Math.max(0, Math.round(n)).toLocaleString("en-IN");

export default function HraCalculatorTool() {
  const [basic, setBasic] = useState("");
  const [da, setDa] = useState("");
  const [hra, setHra] = useState("");
  const [rent, setRent] = useState("");
  const [metro, setMetro] = useState("metro");
  const [period, setPeriod] = useState("monthly");

  const r = useMemo(() => {
    const mult = period === "monthly" ? 12 : 1;
    const basicDa = ((+basic || 0) + (+da || 0)) * mult;
    const hraRecv = (+hra || 0) * mult;
    const rentPaid = (+rent || 0) * mult;
    if (!basicDa || !hraRecv) return null;
    const a = hraRecv;
    const b = rentPaid - 0.1 * basicDa;
    const c = (metro === "metro" ? 0.5 : 0.4) * basicDa;
    const exempt = Math.max(0, Math.min(a, b, c));
    return { a, b, c, exempt, taxable: hraRecv - exempt };
  }, [basic, da, hra, rent, metro, period]);

  return (
    <ToolPageLayout
      title="HRA Calculator"
      description="Calculate your HRA exemption under Section 10(13A) — enter basic salary, HRA received and rent paid to see exempt vs taxable HRA."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <TabGroup
          value={period}
          onChange={setPeriod}
          options={[
            { value: "monthly", label: "Monthly figures" },
            { value: "yearly", label: "Yearly figures" },
          ]}
        />
        <Field label={`Basic salary (${period})`}>
          <TextInput type="number" min={0} value={basic} onChange={(e) => setBasic(e.target.value)} placeholder="e.g. 40000" />
        </Field>
        <Field label={`Dearness allowance / DA (${period}, optional)`}>
          <TextInput type="number" min={0} value={da} onChange={(e) => setDa(e.target.value)} placeholder="0" />
        </Field>
        <Field label={`HRA received (${period})`}>
          <TextInput type="number" min={0} value={hra} onChange={(e) => setHra(e.target.value)} placeholder="e.g. 20000" />
        </Field>
        <Field label={`Rent paid (${period})`}>
          <TextInput type="number" min={0} value={rent} onChange={(e) => setRent(e.target.value)} placeholder="e.g. 15000" />
        </Field>
        <TabGroup
          value={metro}
          onChange={setMetro}
          options={[
            { value: "metro", label: "Metro city (50%)" },
            { value: "nonmetro", label: "Non-metro (40%)" },
          ]}
        />

        {r && (
          <ResultBox>
            <ResultRow label="Actual HRA received (yearly)" value={inr(r.a)} />
            <ResultRow label="Rent paid − 10% of Basic+DA" value={inr(r.b)} />
            <ResultRow label={`${metro === "metro" ? "50%" : "40%"} of Basic+DA`} value={inr(r.c)} />
            <ResultRow label="HRA exempt (least of above)" value={<span style={{ color: "var(--indigo)" }}>{inr(r.exempt)}</span>} />
            <ResultRow label="Taxable HRA (yearly)" value={inr(r.taxable)} />
          </ResultBox>
        )}

        <p style={{ marginTop: "1.2rem", fontSize: ".85rem", color: "var(--muted)" }}>
          Note: HRA exemption is available only under the old tax regime. Paying rent above
          ₹1 lakh/year requires the landlord&apos;s PAN. Need rent receipts as HRA proof? Use our{" "}
          <Link href="/tools/generators/rent-receipt-generator" style={{ color: "var(--indigo)", fontWeight: 600 }}>
            Rent Receipt Generator
          </Link>.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
