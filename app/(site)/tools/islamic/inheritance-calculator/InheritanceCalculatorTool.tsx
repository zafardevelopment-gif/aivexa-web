"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput } from "@/components/tools/ToolUI";
import HeirSelector from "@/components/tools/HeirSelector";
import { calculateFaraidShares, defaultHeirInput, type HeirInput } from "@/lib/faraid";

export default function InheritanceCalculatorTool() {
  const [heirs, setHeirs] = useState<HeirInput>(defaultHeirInput());
  const [estateValue, setEstateValue] = useState("");

  const result = useMemo(() => calculateFaraidShares(heirs), [heirs]);
  const value = parseFloat(estateValue);
  const hasValue = Number.isFinite(value) && value > 0;

  return (
    <ToolPageLayout
      title="Inheritance (Mirath) Calculator"
      description="Estimate Islamic inheritance (Faraid) shares among heirs, based on standard Sunni Hanafi fixed-share rules."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <div
        style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "12px",
          padding: "1.1rem 1.3rem",
          marginBottom: "1.6rem",
          color: "#991b1b",
          fontSize: ".88rem",
          lineHeight: 1.65,
          fontWeight: 500,
        }}
      >
        This tool provides a standard Sunni Hanafi Faraid-based estimate for educational and planning
        purposes only. Actual inheritance can involve complexities (multiple schools of thought,
        wasiyyah/will, debts, missing heirs) that require a qualified Islamic scholar and legal advisor.
        This is not a legal or religious ruling.
      </div>

      <Card>
        <h3 style={{ fontSize: "1.05rem", marginBottom: "1rem" }}>Heirs present</h3>
        <HeirSelector value={heirs} onChange={setHeirs} />

        <Field label="Total estate value in ₹ (optional)">
          <TextInput
            type="number"
            min={0}
            placeholder="e.g. 5000000"
            value={estateValue}
            onChange={(e) => setEstateValue(e.target.value)}
          />
        </Field>
      </Card>

      <div style={{ marginTop: "1.6rem" }}>
        {result.supported ? (
          <Card>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "1rem" }}>Estimated Shares</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "2px solid var(--border)" }}>
                    <th style={{ padding: ".55rem .4rem" }}>Heir</th>
                    <th style={{ padding: ".55rem .4rem" }}>Count</th>
                    <th style={{ padding: ".55rem .4rem" }}>Share Fraction</th>
                    <th style={{ padding: ".55rem .4rem" }}>% of Estate</th>
                    {hasValue && <th style={{ padding: ".55rem .4rem" }}>Amount (₹)</th>}
                  </tr>
                </thead>
                <tbody>
                  {result.shares.map((s, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: ".55rem .4rem" }}>{s.heir}</td>
                      <td style={{ padding: ".55rem .4rem" }}>{s.count || "—"}</td>
                      <td style={{ padding: ".55rem .4rem" }}>{s.fraction}</td>
                      <td style={{ padding: ".55rem .4rem" }}>{s.percent.toFixed(2)}%</td>
                      {hasValue && (
                        <td style={{ padding: ".55rem .4rem" }}>
                          ₹{((s.percent / 100) * value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result.notes.length > 0 && (
              <div style={{ marginTop: "1.2rem" }}>
                {result.notes.map((note, i) => (
                  <p key={i} style={{ fontSize: ".83rem", color: "var(--muted)", marginBottom: ".6rem", lineHeight: 1.6 }}>
                    Note: {note}
                  </p>
                ))}
              </div>
            )}
          </Card>
        ) : (
          <Card>
            <p style={{ color: "#991b1b", fontWeight: 600 }}>
              This combination is not fully supported — please consult a scholar.
            </p>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", marginTop: ".5rem" }}>{result.reason}</p>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
