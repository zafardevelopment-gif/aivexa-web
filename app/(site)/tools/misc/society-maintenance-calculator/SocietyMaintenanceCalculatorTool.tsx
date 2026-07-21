"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TabGroup, ResultBox, ResultRow, CopyButton } from "@/components/tools/ToolUI";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

type FlatType = { label: string; sqft: string; count: string };

export default function SocietyMaintenanceCalculatorTool() {
  const [total, setTotal] = useState("");
  const [mode, setMode] = useState("sqft");
  const [flats, setFlats] = useState("");
  const [types, setTypes] = useState<FlatType[]>([
    { label: "1 BHK", sqft: "600", count: "" },
    { label: "2 BHK", sqft: "950", count: "" },
    { label: "3 BHK", sqft: "1350", count: "" },
  ]);

  function setType(i: number, key: keyof FlatType, val: string) {
    setTypes((prev) => prev.map((t, j) => (j === i ? { ...t, [key]: val } : t)));
  }

  const r = useMemo(() => {
    const T = +total || 0;
    if (!T) return null;
    if (mode === "equal") {
      const n = +flats || 0;
      if (!n) return null;
      return { equal: T / n, rows: null as null | { label: string; perFlat: number; count: number }[], rate: 0 };
    }
    const active = types.filter((t) => (+t.count || 0) > 0 && (+t.sqft || 0) > 0);
    const totalArea = active.reduce((s, t) => s + (+t.sqft) * (+t.count), 0);
    if (!totalArea) return null;
    const rate = T / totalArea;
    const rows = active.map((t) => ({ label: `${t.label} (${t.sqft} sq.ft)`, perFlat: rate * +t.sqft, count: +t.count }));
    return { equal: null, rows, rate };
  }, [total, mode, flats, types]);

  const summary = r?.rows
    ? r.rows.map((row) => `${row.label}: ${inr(row.perFlat)}/month x ${row.count} flats`).join("\n")
    : "";

  return (
    <ToolPageLayout
      title="Society Maintenance Split Calculator"
      description="Divide your housing society's monthly expenses across flats — equally or by carpet area (per sq.ft), the two methods most societies use."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <Field label="Total monthly society expense (₹)">
          <TextInput type="number" min={0} value={total} onChange={(e) => setTotal(e.target.value)} placeholder="e.g. 180000" />
        </Field>
        <TabGroup
          value={mode}
          onChange={setMode}
          options={[
            { value: "sqft", label: "Split by area (per sq.ft)" },
            { value: "equal", label: "Split equally" },
          ]}
        />

        {mode === "equal" ? (
          <Field label="Total number of flats">
            <TextInput type="number" min={1} value={flats} onChange={(e) => setFlats(e.target.value)} placeholder="e.g. 60" />
          </Field>
        ) : (
          <div>
            {types.map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: ".6rem", marginBottom: ".6rem" }}>
                <TextInput value={t.label} onChange={(e) => setType(i, "label", e.target.value)} placeholder="Flat type" />
                <TextInput type="number" min={0} value={t.sqft} onChange={(e) => setType(i, "sqft", e.target.value)} placeholder="Area sq.ft" />
                <TextInput type="number" min={0} value={t.count} onChange={(e) => setType(i, "count", e.target.value)} placeholder="No. of flats" />
              </div>
            ))}
            <button
              className="btn-secondary sm"
              onClick={() => setTypes((p) => [...p, { label: `Type ${p.length + 1}`, sqft: "", count: "" }])}
              style={{ marginTop: ".2rem" }}
            >
              + Add flat type
            </button>
          </div>
        )}

        {r && (
          <ResultBox>
            {r.equal !== null && r.equal !== undefined ? (
              <ResultRow label="Maintenance per flat / month" value={<span style={{ color: "var(--indigo)" }}>{inr(r.equal)}</span>} />
            ) : (
              <>
                <ResultRow label="Rate per sq.ft" value={`₹${r.rate.toFixed(2)}/sq.ft`} />
                {r.rows!.map((row) => (
                  <ResultRow key={row.label} label={`${row.label} × ${row.count}`} value={inr(row.perFlat) + "/month"} />
                ))}
              </>
            )}
          </ResultBox>
        )}

        {summary && (
          <div style={{ marginTop: "1rem" }}>
            <CopyButton text={summary} label="Copy summary" />
          </div>
        )}
      </Card>
    </ToolPageLayout>
  );
}
