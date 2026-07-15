"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  ResultBox,
  ResultRow,
  TabGroup,
} from "@/components/tools/ToolUI";

type Mode = "xPercentOfY" | "xIsWhatPercentOfY" | "percentChange";

function toNumber(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function PercentageCalculatorTool() {
  const [mode, setMode] = useState<Mode>("xPercentOfY");

  const [xOfY_x, setXOfY_x] = useState("");
  const [xOfY_y, setXOfY_y] = useState("");

  const [isWhat_x, setIsWhat_x] = useState("");
  const [isWhat_y, setIsWhat_y] = useState("");

  const [change_from, setChangeFrom] = useState("");
  const [change_to, setChangeTo] = useState("");

  const xOfYResult = useMemo(() => {
    const x = toNumber(xOfY_x);
    const y = toNumber(xOfY_y);
    if (x === null || y === null) return null;
    return (x / 100) * y;
  }, [xOfY_x, xOfY_y]);

  const isWhatResult = useMemo(() => {
    const x = toNumber(isWhat_x);
    const y = toNumber(isWhat_y);
    if (x === null || y === null || y === 0) return null;
    return (x / y) * 100;
  }, [isWhat_x, isWhat_y]);

  const changeResult = useMemo(() => {
    const from = toNumber(change_from);
    const to = toNumber(change_to);
    if (from === null || to === null || from === 0) return null;
    const diff = to - from;
    const pct = (diff / Math.abs(from)) * 100;
    return { pct, isIncrease: diff >= 0 };
  }, [change_from, change_to]);

  return (
    <ToolPageLayout
      title="Percentage Calculator"
      description="Quickly calculate percentages, percentage of a value, and percentage change, free and instant."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <TabGroup
          options={[
            { value: "xPercentOfY", label: "X% of Y" },
            { value: "xIsWhatPercentOfY", label: "X is what % of Y" },
            { value: "percentChange", label: "% Increase/Decrease" },
          ]}
          value={mode}
          onChange={(v) => setMode(v as Mode)}
        />

        {mode === "xPercentOfY" && (
          <>
            <Field label="Percentage (X)">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 20"
                value={xOfY_x}
                onChange={(e) => setXOfY_x(e.target.value)}
              />
            </Field>
            <Field label="Of Value (Y)">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 150"
                value={xOfY_y}
                onChange={(e) => setXOfY_y(e.target.value)}
              />
            </Field>
            <ResultBox>
              <ResultRow
                label={`${xOfY_x || 0}% of ${xOfY_y || 0}`}
                value={xOfYResult !== null ? xOfYResult.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0"}
              />
            </ResultBox>
          </>
        )}

        {mode === "xIsWhatPercentOfY" && (
          <>
            <Field label="Value (X)">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 30"
                value={isWhat_x}
                onChange={(e) => setIsWhat_x(e.target.value)}
              />
            </Field>
            <Field label="Of Value (Y)">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 150"
                value={isWhat_y}
                onChange={(e) => setIsWhat_y(e.target.value)}
              />
            </Field>
            <ResultBox>
              <ResultRow
                label={`${isWhat_x || 0} is what % of ${isWhat_y || 0}`}
                value={isWhatResult !== null ? `${isWhatResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}%` : "0%"}
              />
            </ResultBox>
          </>
        )}

        {mode === "percentChange" && (
          <>
            <Field label="From Value">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 100"
                value={change_from}
                onChange={(e) => setChangeFrom(e.target.value)}
              />
            </Field>
            <Field label="To Value">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 125"
                value={change_to}
                onChange={(e) => setChangeTo(e.target.value)}
              />
            </Field>
            <ResultBox>
              <ResultRow
                label="Change"
                value={
                  changeResult
                    ? `${changeResult.isIncrease ? "+" : ""}${changeResult.pct.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`
                    : "0%"
                }
              />
              <ResultRow
                label="Direction"
                value={changeResult ? (changeResult.isIncrease ? "Increase" : "Decrease") : "—"}
              />
            </ResultBox>
          </>
        )}
      </Card>
    </ToolPageLayout>
  );
}
