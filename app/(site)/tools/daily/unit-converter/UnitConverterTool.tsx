"use client";

import { useMemo, useState } from "react";
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

type CategoryKey = "length" | "weight" | "temperature" | "volume";

type UnitDef = {
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
};

const LENGTH_UNITS: Record<string, UnitDef> = {
  mm: { label: "Millimeters (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  cm: { label: "Centimeters (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
  m: { label: "Meters (m)", toBase: (v) => v, fromBase: (v) => v },
  km: { label: "Kilometers (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  in: { label: "Inches (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ft: { label: "Feet (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
  yd: { label: "Yards (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
  mi: { label: "Miles (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
};

const WEIGHT_UNITS: Record<string, UnitDef> = {
  mg: { label: "Milligrams (mg)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  g: { label: "Grams (g)", toBase: (v) => v, fromBase: (v) => v },
  kg: { label: "Kilograms (kg)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  tonne: { label: "Tonnes (t)", toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
  oz: { label: "Ounces (oz)", toBase: (v) => v * 28.349523125, fromBase: (v) => v / 28.349523125 },
  lb: { label: "Pounds (lb)", toBase: (v) => v * 453.59237, fromBase: (v) => v / 453.59237 },
};

const VOLUME_UNITS: Record<string, UnitDef> = {
  ml: { label: "Milliliters (ml)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  l: { label: "Liters (l)", toBase: (v) => v, fromBase: (v) => v },
  gallon: { label: "Gallon (US)", toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 },
  quart: { label: "Quart (US)", toBase: (v) => v * 0.946352946, fromBase: (v) => v / 0.946352946 },
  cup: { label: "Cup (US)", toBase: (v) => v * 0.2365882365, fromBase: (v) => v / 0.2365882365 },
  flOz: { label: "Fl. Ounce (US)", toBase: (v) => v * 0.0295735296, fromBase: (v) => v / 0.0295735296 },
};

const TEMPERATURE_UNITS: Record<string, UnitDef> = {
  celsius: {
    label: "Celsius (°C)",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  fahrenheit: {
    label: "Fahrenheit (°F)",
    toBase: (v) => ((v - 32) * 5) / 9,
    fromBase: (v) => (v * 9) / 5 + 32,
  },
  kelvin: {
    label: "Kelvin (K)",
    toBase: (v) => v - 273.15,
    fromBase: (v) => v + 273.15,
  },
};

const CATEGORIES: Record<
  CategoryKey,
  { label: string; units: Record<string, UnitDef>; defaultFrom: string; defaultTo: string }
> = {
  length: { label: "Length", units: LENGTH_UNITS, defaultFrom: "m", defaultTo: "ft" },
  weight: { label: "Weight", units: WEIGHT_UNITS, defaultFrom: "kg", defaultTo: "lb" },
  temperature: { label: "Temperature", units: TEMPERATURE_UNITS, defaultFrom: "celsius", defaultTo: "fahrenheit" },
  volume: { label: "Volume", units: VOLUME_UNITS, defaultFrom: "l", defaultTo: "gallon" },
};

export default function UnitConverterTool() {
  const [category, setCategory] = useState<CategoryKey>("length");
  const [fromUnit, setFromUnit] = useState(CATEGORIES.length.defaultFrom);
  const [toUnit, setToUnit] = useState(CATEGORIES.length.defaultTo);
  const [value, setValue] = useState("1");

  function handleCategoryChange(next: CategoryKey) {
    setCategory(next);
    setFromUnit(CATEGORIES[next].defaultFrom);
    setToUnit(CATEGORIES[next].defaultTo);
  }

  const units = CATEGORIES[category].units;

  const result = useMemo(() => {
    const n = Number(value);
    if (value.trim() === "" || !Number.isFinite(n)) return null;
    const from = units[fromUnit];
    const to = units[toUnit];
    if (!from || !to) return null;
    const base = from.toBase(n);
    return to.fromBase(base);
  }, [value, fromUnit, toUnit, units]);

  return (
    <ToolPageLayout
      title="Unit Converter"
      description="Convert between length, weight, temperature, and volume units instantly, free and accurate."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <TabGroup
          options={Object.entries(CATEGORIES).map(([value, def]) => ({
            value,
            label: def.label,
          }))}
          value={category}
          onChange={(v) => handleCategoryChange(v as CategoryKey)}
        />

        <Field label="Value">
          <TextInput
            type="number"
            inputMode="decimal"
            placeholder="e.g. 1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="From">
            <SelectInput value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
              {Object.entries(units).map(([key, def]) => (
                <option key={key} value={key}>
                  {def.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="To">
            <SelectInput value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {Object.entries(units).map(([key, def]) => (
                <option key={key} value={key}>
                  {def.label}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <ResultBox>
          <ResultRow
            label={`${value || 0} ${units[fromUnit]?.label ?? ""} =`}
            value={
              result !== null
                ? `${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${units[toUnit]?.label ?? ""}`
                : "0"
            }
          />
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
