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

type Unit = "metric" | "imperial";

function toNumber(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export default function BmiCalculatorTool() {
  const [unit, setUnit] = useState<Unit>("metric");

  const [cm, setCm] = useState("");
  const [kg, setKg] = useState("");

  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [lbs, setLbs] = useState("");

  const bmi = useMemo(() => {
    if (unit === "metric") {
      const heightCm = toNumber(cm);
      const weightKg = toNumber(kg);
      if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;
      const heightM = heightCm / 100;
      return weightKg / (heightM * heightM);
    } else {
      const ft = toNumber(feet) ?? 0;
      const inch = toNumber(inches) ?? 0;
      const weightLbs = toNumber(lbs);
      const totalInches = ft * 12 + inch;
      if (!weightLbs || weightLbs <= 0 || totalInches <= 0) return null;
      const heightM = totalInches * 0.0254;
      const weightKg = weightLbs * 0.453592;
      return weightKg / (heightM * heightM);
    }
  }, [unit, cm, kg, feet, inches, lbs]);

  return (
    <ToolPageLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index in metric or imperial units, free and instantly."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <TabGroup
          options={[
            { value: "metric", label: "Metric (cm, kg)" },
            { value: "imperial", label: "Imperial (ft/in, lbs)" },
          ]}
          value={unit}
          onChange={(v) => setUnit(v as Unit)}
        />

        {unit === "metric" ? (
          <>
            <Field label="Height (cm)">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 175"
                value={cm}
                onChange={(e) => setCm(e.target.value)}
              />
            </Field>
            <Field label="Weight (kg)">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 70"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
              />
            </Field>
          </>
        ) : (
          <>
            <Field label="Height — Feet">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 5"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
              />
            </Field>
            <Field label="Height — Inches">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 9"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
              />
            </Field>
            <Field label="Weight (lbs)">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 154"
                value={lbs}
                onChange={(e) => setLbs(e.target.value)}
              />
            </Field>
          </>
        )}

        <ResultBox>
          <ResultRow label="BMI" value={bmi !== null ? bmi.toFixed(2) : "0.00"} />
          <ResultRow label="Category" value={bmi !== null ? bmiCategory(bmi) : "—"} />
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
