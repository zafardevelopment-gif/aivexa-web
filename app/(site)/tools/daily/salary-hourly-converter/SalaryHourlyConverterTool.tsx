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

type Mode = "salaryToHourly" | "hourlyToSalary";
type PayPeriod = "annual" | "monthly";

function toNumber(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function SalaryHourlyConverterTool() {
  const [mode, setMode] = useState<Mode>("salaryToHourly");
  const [amount, setAmount] = useState("60000");
  const [payPeriod, setPayPeriod] = useState<PayPeriod>("annual");
  const [hourlyRate, setHourlyRate] = useState("25");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");

  const result = useMemo(() => {
    const hpw = toNumber(hoursPerWeek);
    const wpy = toNumber(weeksPerYear);
    if (hpw === null || wpy === null || hpw <= 0 || wpy <= 0) return null;

    if (mode === "salaryToHourly") {
      const amt = toNumber(amount);
      if (amt === null) return null;
      const annual = payPeriod === "annual" ? amt : amt * 12;
      const hourly = annual / (hpw * wpy);
      const weekly = hourly * hpw;
      const monthly = annual / 12;
      return { hourly, weekly, monthly, annual };
    }

    const hourly = toNumber(hourlyRate);
    if (hourly === null) return null;
    const weekly = hourly * hpw;
    const annual = weekly * wpy;
    const monthly = annual / 12;
    return { hourly, weekly, monthly, annual };
  }, [mode, amount, payPeriod, hourlyRate, hoursPerWeek, weeksPerYear]);

  return (
    <ToolPageLayout
      title="Salary to Hourly Converter"
      description="Convert your salary to an hourly rate or your hourly rate to an annual salary, free and instant."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <TabGroup
          options={[
            { value: "salaryToHourly", label: "Salary → Hourly" },
            { value: "hourlyToSalary", label: "Hourly → Salary" },
          ]}
          value={mode}
          onChange={(v) => setMode(v as Mode)}
        />

        {mode === "salaryToHourly" ? (
          <>
            <Field label="Salary Amount">
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="e.g. 60000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
            <Field label="Pay Period">
              <SelectInput
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value as PayPeriod)}
              >
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
              </SelectInput>
            </Field>
          </>
        ) : (
          <Field label="Hourly Rate">
            <TextInput
              type="number"
              inputMode="decimal"
              placeholder="e.g. 25"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </Field>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Hours per Week">
            <TextInput
              type="number"
              inputMode="decimal"
              placeholder="e.g. 40"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
            />
          </Field>
          <Field label="Weeks per Year">
            <TextInput
              type="number"
              inputMode="decimal"
              placeholder="e.g. 52"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(e.target.value)}
            />
          </Field>
        </div>

        <ResultBox>
          <ResultRow
            label="Hourly Rate"
            value={result ? result.hourly.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0"}
          />
          <ResultRow
            label="Weekly"
            value={result ? result.weekly.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0"}
          />
          <ResultRow
            label="Monthly"
            value={result ? result.monthly.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0"}
          />
          <ResultRow
            label="Annual"
            value={result ? result.annual.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0"}
          />
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
