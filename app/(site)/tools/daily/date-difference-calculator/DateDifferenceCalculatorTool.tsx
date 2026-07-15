"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function calendarBreakdown(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export default function DateDifferenceCalculatorTool() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

    const s = stripTime(start);
    const e = stripTime(end);

    if (e.getTime() < s.getTime()) {
      return { beforeStart: true, totalDays: 0, weeks: 0, remDays: 0, years: 0, months: 0, days: 0 };
    }

    const totalDays = Math.round((e.getTime() - s.getTime()) / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    const { years, months, days } = calendarBreakdown(s, e);

    return { beforeStart: false, totalDays, weeks, remDays, years, months, days };
  }, [startDate, endDate]);

  return (
    <ToolPageLayout
      title="Date Difference Calculator"
      description="Calculate the exact number of days, weeks, months, and years between two dates, free and instantly."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Start Date">
          <TextInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Field>
        <Field label="End Date">
          <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>

        <ResultBox>
          {result === null ? (
            <ResultRow label="Difference" value="Enter both dates" />
          ) : result.beforeStart ? (
            <ResultRow label="Difference" value="End date is before start date" />
          ) : (
            <>
              <ResultRow label="Total Days" value={result.totalDays.toLocaleString()} />
              <ResultRow label="Weeks + Days" value={`${result.weeks} weeks, ${result.remDays} days`} />
              <ResultRow
                label="Years, Months, Days"
                value={`${result.years} years, ${result.months} months, ${result.days} days`}
              />
            </>
          )}
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
