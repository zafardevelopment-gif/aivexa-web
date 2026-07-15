"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

type YearRow = {
  year: number;
  invested: number;
  value: number;
};

function futureValue(monthlyAmount: number, monthlyRate: number, months: number): number {
  if (months <= 0 || monthlyAmount <= 0) return 0;
  if (monthlyRate === 0) return monthlyAmount * months;
  // SIP future value formula assuming investment at the start of each month (annuity-due).
  return monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
}

export default function SipCalculatorTool() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("5000");
  const [annualReturn, setAnnualReturn] = useState("12");
  const [years, setYears] = useState("10");

  const { maturity, invested, gains, schedule } = useMemo(() => {
    const p = Math.max(0, toNumber(monthlyInvestment));
    const annualRate = Math.max(0, toNumber(annualReturn));
    const yrs = Math.max(0, Math.trunc(toNumber(years)));
    const i = annualRate / 12 / 100;
    const totalMonths = yrs * 12;

    if (p <= 0 || totalMonths <= 0) {
      return { maturity: 0, invested: 0, gains: 0, schedule: [] as YearRow[] };
    }

    const fv = futureValue(p, i, totalMonths);
    const totalInvested = p * totalMonths;

    const rows: YearRow[] = [];
    for (let y = 1; y <= yrs; y++) {
      const monthsElapsed = y * 12;
      rows.push({
        year: y,
        invested: p * monthsElapsed,
        value: futureValue(p, i, monthsElapsed),
      });
    }

    return { maturity: fv, invested: totalInvested, gains: fv - totalInvested, schedule: rows };
  }, [monthlyInvestment, annualReturn, years]);

  return (
    <ToolPageLayout
      title="SIP Calculator"
      description="Estimate the future value of your monthly SIP investments with a year-by-year growth breakdown."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Monthly Investment Amount">
          <TextInput
            type="number"
            min={0}
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(e.target.value)}
            placeholder="e.g. 5000"
          />
        </Field>
        <Field label="Expected Annual Return (%)">
          <TextInput
            type="number"
            min={0}
            step="0.01"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
            placeholder="e.g. 12"
          />
        </Field>
        <Field label="Tenure (years)">
          <TextInput
            type="number"
            min={0}
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="e.g. 10"
          />
        </Field>

        <ResultBox>
          <ResultRow
            label="Maturity Value"
            value={maturity.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          />
          <ResultRow
            label="Total Invested"
            value={invested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          />
          <ResultRow
            label="Total Returns / Gains"
            value={gains.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          />
        </ResultBox>
      </Card>

      {schedule.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: ".8rem" }}>
            Year-by-Year Growth
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: ".5rem .7rem",
                      borderBottom: "1px solid var(--border-2)",
                      fontSize: ".85rem",
                      textAlign: "left",
                      fontWeight: 700,
                      background: "var(--indigo-light)",
                    }}
                  >
                    Year
                  </th>
                  <th
                    style={{
                      padding: ".5rem .7rem",
                      borderBottom: "1px solid var(--border-2)",
                      fontSize: ".85rem",
                      textAlign: "right",
                      fontWeight: 700,
                      background: "var(--indigo-light)",
                    }}
                  >
                    Invested So Far
                  </th>
                  <th
                    style={{
                      padding: ".5rem .7rem",
                      borderBottom: "1px solid var(--border-2)",
                      fontSize: ".85rem",
                      textAlign: "right",
                      fontWeight: 700,
                      background: "var(--indigo-light)",
                    }}
                  >
                    Estimated Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.year}>
                    <td
                      style={{
                        padding: ".5rem .7rem",
                        borderBottom: "1px solid var(--border-2)",
                        fontSize: ".85rem",
                        textAlign: "left",
                      }}
                    >
                      {row.year}
                    </td>
                    <td
                      style={{
                        padding: ".5rem .7rem",
                        borderBottom: "1px solid var(--border-2)",
                        fontSize: ".85rem",
                        textAlign: "right",
                      }}
                    >
                      {row.invested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td
                      style={{
                        padding: ".5rem .7rem",
                        borderBottom: "1px solid var(--border-2)",
                        fontSize: ".85rem",
                        textAlign: "right",
                      }}
                    >
                      {row.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
