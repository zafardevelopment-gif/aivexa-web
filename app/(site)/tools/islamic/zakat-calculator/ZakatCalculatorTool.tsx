"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, ResultBox, ResultRow, TextInput } from "@/components/tools/ToolUI";

const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;
const ZAKAT_RATE = 0.025;

function n(v: string): number {
  const num = parseFloat(v);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

export default function ZakatCalculatorTool() {
  const [cash, setCash] = useState("");
  const [goldGrams, setGoldGrams] = useState("");
  const [goldRate, setGoldRate] = useState("");
  const [goldValueDirect, setGoldValueDirect] = useState("");
  const [silverGrams, setSilverGrams] = useState("");
  const [silverRate, setSilverRate] = useState("");
  const [silverValueDirect, setSilverValueDirect] = useState("");
  const [otherSavings, setOtherSavings] = useState("");
  const [businessAssets, setBusinessAssets] = useState("");
  const [receivables, setReceivables] = useState("");
  const [debts, setDebts] = useState("");
  const [nisabChoice, setNisabChoice] = useState<"lower" | "gold" | "silver">("lower");

  const goldValue = useMemo(() => {
    const direct = n(goldValueDirect);
    if (direct > 0) return direct;
    return n(goldGrams) * n(goldRate);
  }, [goldGrams, goldRate, goldValueDirect]);

  const silverValue = useMemo(() => {
    const direct = n(silverValueDirect);
    if (direct > 0) return direct;
    return n(silverGrams) * n(silverRate);
  }, [silverGrams, silverRate, silverValueDirect]);

  const goldNisabValue = useMemo(() => {
    const rate = n(goldRate);
    return rate > 0 ? GOLD_NISAB_GRAMS * rate : 0;
  }, [goldRate]);

  const silverNisabValue = useMemo(() => {
    const rate = n(silverRate);
    return rate > 0 ? SILVER_NISAB_GRAMS * rate : 0;
  }, [silverRate]);

  const totalZakatable =
    n(cash) + goldValue + silverValue + n(otherSavings) + n(businessAssets) + n(receivables) - n(debts);

  const netWealth = Math.max(0, totalZakatable);

  const nisabThreshold = useMemo(() => {
    if (nisabChoice === "gold") return goldNisabValue;
    if (nisabChoice === "silver") return silverNisabValue;
    const values = [goldNisabValue, silverNisabValue].filter((v) => v > 0);
    if (values.length === 0) return 0;
    return Math.min(...values);
  }, [nisabChoice, goldNisabValue, silverNisabValue]);

  const meetsNisab = nisabThreshold > 0 && netWealth >= nisabThreshold;
  const zakatPayable = meetsNisab ? netWealth * ZAKAT_RATE : 0;

  return (
    <ToolPageLayout
      title="Zakat Calculator"
      description="Work out your Zakat payable on cash, gold, silver, savings, business assets and receivables, minus debts."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <Card>
        <Field label="Cash & bank balance (₹)">
          <TextInput type="number" min={0} placeholder="0" value={cash} onChange={(e) => setCash(e.target.value)} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
          <Field label="Gold (grams)">
            <TextInput type="number" min={0} placeholder="0" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} />
          </Field>
          <Field label="Current gold rate (₹/gram)">
            <TextInput type="number" min={0} placeholder="0" value={goldRate} onChange={(e) => setGoldRate(e.target.value)} />
          </Field>
        </div>
        <Field label="OR: direct gold value (₹) — leave blank to use grams × rate above">
          <TextInput type="number" min={0} placeholder="0" value={goldValueDirect} onChange={(e) => setGoldValueDirect(e.target.value)} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
          <Field label="Silver (grams)">
            <TextInput type="number" min={0} placeholder="0" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value)} />
          </Field>
          <Field label="Current silver rate (₹/gram)">
            <TextInput type="number" min={0} placeholder="0" value={silverRate} onChange={(e) => setSilverRate(e.target.value)} />
          </Field>
        </div>
        <Field label="OR: direct silver value (₹) — leave blank to use grams × rate above">
          <TextInput type="number" min={0} placeholder="0" value={silverValueDirect} onChange={(e) => setSilverValueDirect(e.target.value)} />
        </Field>

        <Field label="Other savings / investments (₹)">
          <TextInput type="number" min={0} placeholder="0" value={otherSavings} onChange={(e) => setOtherSavings(e.target.value)} />
        </Field>
        <Field label="Business assets / inventory value (₹)">
          <TextInput type="number" min={0} placeholder="0" value={businessAssets} onChange={(e) => setBusinessAssets(e.target.value)} />
        </Field>
        <Field label="Money owed to you (receivables) (₹)">
          <TextInput type="number" min={0} placeholder="0" value={receivables} onChange={(e) => setReceivables(e.target.value)} />
        </Field>
        <Field label="Debts / liabilities you owe (₹)">
          <TextInput type="number" min={0} placeholder="0" value={debts} onChange={(e) => setDebts(e.target.value)} />
        </Field>

        <Field label="Nisab threshold to use">
          <select
            value={nisabChoice}
            onChange={(e) => setNisabChoice(e.target.value as "lower" | "gold" | "silver")}
            style={{
              width: "100%",
              padding: ".7rem .9rem",
              borderRadius: "10px",
              border: "1px solid var(--border-2)",
              fontSize: ".95rem",
              fontFamily: "inherit",
              background: "#fff",
            }}
          >
            <option value="lower">Lower of gold/silver Nisab (recommended, more conservative)</option>
            <option value="gold">Gold-based Nisab (87.48g gold)</option>
            <option value="silver">Silver-based Nisab (612.36g silver)</option>
          </select>
        </Field>

        <ResultBox>
          <ResultRow label="Gold-based Nisab (87.48g)" value={goldNisabValue > 0 ? `₹${goldNisabValue.toFixed(2)}` : "Enter gold rate"} />
          <ResultRow label="Silver-based Nisab (612.36g)" value={silverNisabValue > 0 ? `₹${silverNisabValue.toFixed(2)}` : "Enter silver rate"} />
          <ResultRow label="Nisab threshold used" value={nisabThreshold > 0 ? `₹${nisabThreshold.toFixed(2)}` : "—"} />
          <ResultRow label="Total zakatable wealth" value={`₹${netWealth.toFixed(2)}`} />
          <ResultRow label="Meets/exceeds Nisab?" value={nisabThreshold > 0 ? (meetsNisab ? "Yes" : "No") : "Enter a rate to check"} />
          <ResultRow
            label="Zakat payable (2.5%)"
            value={meetsNisab ? `₹${zakatPayable.toFixed(2)}` : "₹0.00"}
          />
        </ResultBox>

        <p style={{ marginTop: "1.2rem", fontSize: ".82rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
          The lower of the gold and silver Nisab is commonly recommended as the more conservative
          threshold, since it means more people qualify to pay (and benefit) from Zakat. This is a
          general calculation for educational purposes. Zakat rules can vary by asset type and school
          of thought — please confirm specifics with a qualified scholar.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
