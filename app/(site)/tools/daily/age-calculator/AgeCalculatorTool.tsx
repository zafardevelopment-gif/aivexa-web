"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

type AgeResult = {
  years: number;
  months: number;
  days: number;
  daysToNextBirthday: number;
  totalDaysAlive: number;
};

function computeAge(birthDate: Date, today: Date): AgeResult {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday.getTime() < stripTime(today).getTime()) {
    nextBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const daysToNextBirthday = Math.round(
    (nextBirthday.getTime() - stripTime(today).getTime()) / 86400000
  );

  const totalDaysAlive = Math.floor(
    (stripTime(today).getTime() - stripTime(birthDate).getTime()) / 86400000
  );

  return { years, months, days, daysToNextBirthday, totalDaysAlive };
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function AgeCalculatorTool() {
  const [dob, setDob] = useState("");

  const result = useMemo<AgeResult | null>(() => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (Number.isNaN(birthDate.getTime())) return null;
    const today = new Date();
    if (birthDate.getTime() > today.getTime()) return null;
    return computeAge(birthDate, today);
  }, [dob]);

  return (
    <ToolPageLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days, free and instantly."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Date of Birth">
          <TextInput
            type="date"
            value={dob}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDob(e.target.value)}
          />
        </Field>

        <ResultBox>
          {result ? (
            <>
              <ResultRow
                label="Your Age"
                value={`${result.years} years, ${result.months} months, ${result.days} days`}
              />
              <ResultRow label="Days Until Next Birthday" value={`${result.daysToNextBirthday} days`} />
              <ResultRow label="Total Days Alive" value={result.totalDaysAlive.toLocaleString()} />
            </>
          ) : (
            <ResultRow label="Your Age" value="Enter a valid date of birth" />
          )}
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
