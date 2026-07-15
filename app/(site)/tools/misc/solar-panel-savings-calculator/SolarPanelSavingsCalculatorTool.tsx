"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  Field,
  TextInput,
  SelectInput,
  ResultBox,
  ResultRow,
  TabGroup,
} from "@/components/tools/ToolUI";
import { SOLAR_CITIES } from "./solar-data";

const SYSTEM_EFFICIENCY = 0.775;
const COST_PER_KW_LOW = 50000;
const COST_PER_KW_HIGH = 70000;
const RESIDUAL_GRID_FRACTION = 0.1;
const DAYS_PER_MONTH = 30;

function parsePositive(v: string): number | null {
  const n = Number(v);
  if (v.trim() === "" || Number.isNaN(n) || n <= 0) return null;
  return n;
}

export default function SolarPanelSavingsCalculatorTool() {
  const [inputMode, setInputMode] = useState<"bill" | "units">("bill");
  const [bill, setBill] = useState("");
  const [units, setUnits] = useState("");
  const [rate, setRate] = useState("8");
  const [city, setCity] = useState("");

  const rateNum = parsePositive(rate);
  const billNum = parsePositive(bill);
  const unitsNum = parsePositive(units);

  const monthlyUnits =
    inputMode === "units"
      ? unitsNum
      : billNum !== null && rateNum !== null
        ? billNum / rateNum
        : null;

  const monthlyBill =
    inputMode === "bill"
      ? billNum
      : unitsNum !== null && rateNum !== null
        ? unitsNum * rateNum
        : null;

  const selectedCity = SOLAR_CITIES.find((c) => c.name === city);
  const sunHours = selectedCity?.peakSunHours ?? null;

  const requiredKw =
    monthlyUnits !== null && sunHours !== null
      ? monthlyUnits / (DAYS_PER_MONTH * sunHours * SYSTEM_EFFICIENCY)
      : null;

  const costLow = requiredKw !== null ? requiredKw * COST_PER_KW_LOW : null;
  const costHigh = requiredKw !== null ? requiredKw * COST_PER_KW_HIGH : null;

  const estimatedMonthlySavings =
    monthlyBill !== null ? monthlyBill * (1 - RESIDUAL_GRID_FRACTION) : null;
  const annualSavings =
    estimatedMonthlySavings !== null ? estimatedMonthlySavings * 12 : null;

  const paybackYearsLow =
    costLow !== null && annualSavings !== null && annualSavings > 0
      ? costLow / annualSavings
      : null;
  const paybackYearsHigh =
    costHigh !== null && annualSavings !== null && annualSavings > 0
      ? costHigh / annualSavings
      : null;

  const canCalculate = requiredKw !== null && costLow !== null && costHigh !== null;

  return (
    <ToolPageLayout
      title="Solar Panel Savings Calculator"
      description="Estimate rooftop solar panel size, installation cost and payback period."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "10px",
            padding: ".9rem 1.1rem",
            fontSize: ".85rem",
            color: "#9a3412",
            marginBottom: "1.4rem",
            fontWeight: 500,
          }}
        >
          These are rough estimates only. Actual solar sizing, cost, and
          savings depend on site survey, roof orientation/shading, local
          subsidies, and net-metering policy. Consult a certified solar
          installer for an accurate quote.
        </div>

        <TabGroup
          options={[
            { value: "bill", label: "I know my monthly bill (₹)" },
            { value: "units", label: "I know my monthly units (kWh)" },
          ]}
          value={inputMode}
          onChange={(v) => setInputMode(v as "bill" | "units")}
        />

        {inputMode === "bill" ? (
          <Field label="Monthly Electricity Bill (₹)">
            <TextInput
              type="number"
              min={0}
              placeholder="e.g. 3000"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
            />
          </Field>
        ) : (
          <Field label="Monthly Units Consumed (kWh)">
            <TextInput
              type="number"
              min={0}
              placeholder="e.g. 350"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            />
          </Field>
        )}

        <Field label="Electricity Rate (₹ per unit / kWh)">
          <TextInput
            type="number"
            min={0}
            placeholder="e.g. 8"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>

        <Field label="City (for average peak sunlight hours)">
          <SelectInput value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select a city</option>
            {SOLAR_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </SelectInput>
        </Field>

        {canCalculate ? (
          <ResultBox>
            <ResultRow label="Estimated Required Panel Capacity" value={`${requiredKw!.toFixed(2)} kW`} />
            <ResultRow
              label="Approximate Installation Cost"
              value={`₹${Math.round(costLow!).toLocaleString("en-IN")} – ₹${Math.round(costHigh!).toLocaleString("en-IN")}`}
            />
            {estimatedMonthlySavings !== null && (
              <ResultRow
                label="Estimated Monthly Savings"
                value={`₹${Math.round(estimatedMonthlySavings).toLocaleString("en-IN")}`}
              />
            )}
            {paybackYearsLow !== null && paybackYearsHigh !== null && (
              <ResultRow
                label="Simple Payback Period"
                value={`${paybackYearsLow.toFixed(1)} – ${paybackYearsHigh.toFixed(1)} years`}
              />
            )}
            <p style={{ fontSize: ".82rem", color: "var(--muted)", margin: ".8rem 0 0" }}>
              Assumes a system efficiency factor of ~77.5% and ₹50,000–₹70,000
              per kW installation cost. Sunlight hours for {selectedCity?.name}
              {" "}are an approximate average ({sunHours} hrs/day).
            </p>
          </ResultBox>
        ) : (
          <p style={{ fontSize: ".88rem", color: "var(--muted-2)" }}>
            Fill in your consumption, rate and city to see an estimate.
          </p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
