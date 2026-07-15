"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, SelectInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Jakarta",
  "Australia/Sydney",
  "Australia/Perth",
  "Pacific/Auckland",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "America/Toronto",
  "America/Mexico_City",
  "America/Vancouver",
  "Pacific/Honolulu",
];

function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

function formatInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function TimeZoneConverterTool() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const defaultLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [dateTimeLocal, setDateTimeLocal] = useState(defaultLocal);
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState("Asia/Karachi");

  const result = useMemo(() => {
    if (!dateTimeLocal) return null;
    const naiveUtc = new Date(`${dateTimeLocal}:00Z`);
    if (Number.isNaN(naiveUtc.getTime())) return null;

    const offsetMinutes = getTimeZoneOffsetMinutes(naiveUtc, fromTz);
    const trueInstant = new Date(naiveUtc.getTime() - offsetMinutes * 60000);

    return {
      sourceFormatted: formatInTimeZone(trueInstant, fromTz),
      targetFormatted: formatInTimeZone(trueInstant, toTz),
    };
  }, [dateTimeLocal, fromTz, toTz]);

  return (
    <ToolPageLayout
      title="Time Zone Converter"
      description="Convert date and time between any two time zones instantly, free and accurate."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Date & Time">
          <input
            type="datetime-local"
            value={dateTimeLocal}
            onChange={(e) => setDateTimeLocal(e.target.value)}
            style={{
              width: "100%",
              padding: ".7rem .9rem",
              borderRadius: "10px",
              border: "1px solid var(--border-2)",
              fontSize: ".95rem",
              fontFamily: "inherit",
            }}
          />
        </Field>

        <div className="tool-cols" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="From Time Zone">
            <SelectInput value={fromTz} onChange={(e) => setFromTz(e.target.value)}>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="To Time Zone">
            <SelectInput value={toTz} onChange={(e) => setToTz(e.target.value)}>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <ResultBox>
          <ResultRow label={`Source Time (${fromTz})`} value={result ? result.sourceFormatted : "—"} />
          <ResultRow label={`Converted Time (${toTz})`} value={result ? result.targetFormatted : "—"} />
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
