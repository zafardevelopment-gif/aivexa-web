"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, SelectInput, TextInput } from "@/components/tools/ToolUI";
import HeirSelector from "@/components/tools/HeirSelector";
import { calculateFaraidShares, defaultHeirInput, type HeirInput } from "@/lib/faraid";
import { LAND_UNIT_LABELS, fromSqFt, toSqFt, type LandUnit } from "@/lib/land-units";

export default function PropertyLandDistributionTool() {
  const [heirs, setHeirs] = useState<HeirInput>(defaultHeirInput());
  const [propertyValue, setPropertyValue] = useState("");
  const [landArea, setLandArea] = useState("");
  const [landUnit, setLandUnit] = useState<LandUnit>("sqft");

  const result = useMemo(() => calculateFaraidShares(heirs), [heirs]);

  const value = parseFloat(propertyValue);
  const hasValue = Number.isFinite(value) && value > 0;

  const area = parseFloat(landArea);
  const hasArea = Number.isFinite(area) && area > 0;
  const areaSqFt = hasArea ? toSqFt(area, landUnit) : 0;

  function handlePrint() {
    window.print();
  }

  return (
    <ToolPageLayout
      title="Property/Land Distribution"
      description="Divide property value and/or land area among heirs per Islamic Faraid rules, in your chosen land unit."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <style>{`
        @media print {
          nav, footer, .no-print { display: none !important; }
          .page-hero { padding-top: 1rem !important; }
        }
      `}</style>

      <div
        className="no-print"
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
        This is not a legal or religious ruling. Actual legal property transfer in India requires
        registered documentation (sale deed / gift deed / mutation) — disputes, missing heirs or
        wasiyyah (will) considerations should also go to a property lawyer in addition to a scholar.
      </div>

      <Card>
        <h3 style={{ fontSize: "1.05rem", marginBottom: "1rem" }}>Heirs present</h3>
        <HeirSelector value={heirs} onChange={setHeirs} />

        <Field label="Property value in ₹ (optional)">
          <TextInput
            type="number"
            min={0}
            placeholder="e.g. 8000000"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
          />
        </Field>

        <div className="tool-cols" style={{ gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
          <Field label="Land area (optional)">
            <TextInput
              type="number"
              min={0}
              placeholder="e.g. 5"
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
            />
          </Field>
          <Field label="Unit">
            <SelectInput value={landUnit} onChange={(e) => setLandUnit(e.target.value as LandUnit)}>
              {Object.entries(LAND_UNIT_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <p style={{ fontSize: ".82rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
          Katha/Bigha conversion used here follows the common Bihar standard (1 Bigha = 20 Katha =
          27,220 sq ft approx); regional variation exists.
        </p>
      </Card>

      <div style={{ marginTop: "1.6rem" }}>
        {result.supported ? (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.05rem" }}>Distribution Summary</h3>
              <button type="button" className="btn-secondary sm no-print" onClick={handlePrint}>
                Print this page
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".88rem" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "2px solid var(--border)" }}>
                    <th style={{ padding: ".55rem .4rem" }}>Heir</th>
                    <th style={{ padding: ".55rem .4rem" }}>Share Fraction</th>
                    <th style={{ padding: ".55rem .4rem" }}>%</th>
                    {hasValue && <th style={{ padding: ".55rem .4rem" }}>Value (₹)</th>}
                    {hasArea && (
                      <>
                        <th style={{ padding: ".55rem .4rem" }}>Area ({LAND_UNIT_LABELS[landUnit]})</th>
                        <th style={{ padding: ".55rem .4rem" }}>Area (sq ft)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {result.shares.map((s, i) => {
                    const shareSqFt = hasArea ? (s.percent / 100) * areaSqFt : 0;
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: ".55rem .4rem" }}>
                          {s.heir}
                          {s.count > 0 ? ` (${s.count})` : ""}
                        </td>
                        <td style={{ padding: ".55rem .4rem" }}>{s.fraction}</td>
                        <td style={{ padding: ".55rem .4rem" }}>{s.percent.toFixed(2)}%</td>
                        {hasValue && (
                          <td style={{ padding: ".55rem .4rem" }}>
                            ₹{((s.percent / 100) * value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </td>
                        )}
                        {hasArea && (
                          <>
                            <td style={{ padding: ".55rem .4rem" }}>
                              {fromSqFt(shareSqFt, landUnit).toFixed(3)}
                            </td>
                            <td style={{ padding: ".55rem .4rem" }}>{shareSqFt.toFixed(1)}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
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

            <div
              className="no-print"
              style={{
                marginTop: "1.4rem",
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "1rem 1.2rem",
                fontSize: ".85rem",
                color: "var(--muted)",
                lineHeight: 1.65,
              }}
            >
              <strong style={{ color: "var(--text)" }}>Can this be physically divided?</strong> Whether a
              plot of land can be fairly split into physical shares depends on its size, shape and local
              regulations. Some scholars advise that when a share resulting from a plot would be too
              small or impractical to use on its own, it is better to sell the property and divide the
              proceeds instead of a physical partition. This is general Islamic guidance, not a ruling by
              this tool — please discuss your specific situation with a scholar.
            </div>
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
