"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, SelectInput } from "@/components/tools/ToolUI";
import { GEO_CITIES, type GeoCity } from "@/lib/india-cities-geo";
import { gregorianToHijri, hijriToGregorian, type GregorianDate } from "@/lib/hijri";
import {
  METHODS,
  METHOD_KEYS,
  computePrayerTimes,
  formatTime12,
  type AsrFactor,
  type MethodKey,
} from "@/lib/prayer-times";

const RAMADAN = 9;

function toUTC(g: GregorianDate): number {
  return Date.UTC(g.year, g.month - 1, g.day);
}

/** The current (if ongoing) or next Ramadan for today's date. */
function findRamadanYear(): number {
  const now = new Date();
  const todayH = gregorianToHijri({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
  return todayH.month <= RAMADAN ? todayH.year : todayH.year + 1;
}

type RamadanRow = {
  ramadanDay: number;
  gregorian: GregorianDate;
  sehri: string;
  iftar: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function RamadanCalendarTool() {
  const [cityName, setCityName] = useState<string>(GEO_CITIES[0].name);
  const [method, setMethod] = useState<MethodKey>("MWL");
  const [asrFactor] = useState<AsrFactor>(1);
  const [hijriYear, setHijriYear] = useState<number>(() => findRamadanYear());

  const city: GeoCity = GEO_CITIES.find((c) => c.name === cityName) ?? GEO_CITIES[0];

  const rows: RamadanRow[] = useMemo(() => {
    const start = hijriToGregorian({ year: hijriYear, month: RAMADAN, day: 1 });
    const nextMonthStart = hijriToGregorian({ year: hijriYear, month: RAMADAN + 1, day: 1 });
    const length = Math.round((toUTC(nextMonthStart) - toUTC(start)) / 86400e3);
    const out: RamadanRow[] = [];
    for (let d = 1; d <= length; d++) {
      const g = hijriToGregorian({ year: hijriYear, month: RAMADAN, day: d });
      const t = computePrayerTimes(g, city.lat, city.lng, city.tz, method, asrFactor);
      out.push({
        ramadanDay: d,
        gregorian: g,
        sehri: formatTime12(t.fajr),
        iftar: formatTime12(t.maghrib),
      });
    }
    return out;
  }, [hijriYear, city, method, asrFactor]);

  const startDate = rows[0]?.gregorian;
  const rangeLabel = startDate
    ? `${startDate.day} ${MONTHS_SHORT[startDate.month - 1]} – ${rows[rows.length - 1].gregorian.day} ${
        MONTHS_SHORT[rows[rows.length - 1].gregorian.month - 1]
      } ${rows[rows.length - 1].gregorian.year}`
    : "";

  return (
    <ToolPageLayout
      title="Ramadan Calendar"
      description="A full-month Sehri and Iftar timetable for your city, calculated astronomically in your browser — with a print option."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .ramadan-print-area, .ramadan-print-area * { visibility: visible !important; }
          .ramadan-print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 1rem; }
          .ramadan-print-area table { font-size: 11px !important; }
        }
      `}</style>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
          <Field label="City">
            <SelectInput value={cityName} onChange={(e) => setCityName(e.target.value)}>
              {GEO_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.country})
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Calculation method">
            <SelectInput value={method} onChange={(e) => setMethod(e.target.value as MethodKey)}>
              {METHOD_KEYS.map((k) => (
                <option key={k} value={k}>
                  {METHODS[k].name}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
        <Field label="Ramadan of Hijri year">
          <SelectInput value={hijriYear} onChange={(e) => setHijriYear(Number(e.target.value))}>
            {[0, 1, 2].map((offset) => {
              const y = findRamadanYear() + offset;
              return (
                <option key={y} value={y}>
                  Ramadan {y} AH
                </option>
              );
            })}
          </SelectInput>
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: ".8rem" }}>
          <button type="button" className="btn-secondary sm" onClick={() => window.print()}>
            🖨️ Print calendar
          </button>
        </div>

        <div className="ramadan-print-area">
          <h2 style={{ fontSize: "1.05rem", marginBottom: ".2rem" }}>
            Ramadan {hijriYear} AH — {city.name}
          </h2>
          <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".8rem" }}>
            {rangeLabel} · {METHODS[method].name} · Sehri ends at Fajr, Iftar at Maghrib
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
              <thead>
                <tr style={{ background: "var(--indigo-light)", textAlign: "left" }}>
                  <th style={{ padding: ".5rem .7rem" }}>Ramadan</th>
                  <th style={{ padding: ".5rem .7rem" }}>Date</th>
                  <th style={{ padding: ".5rem .7rem", textAlign: "right" }}>Sehri ends (Fajr)</th>
                  <th style={{ padding: ".5rem .7rem", textAlign: "right" }}>Iftar (Maghrib)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const dow = new Date(Date.UTC(r.gregorian.year, r.gregorian.month - 1, r.gregorian.day)).getUTCDay();
                  const friday = dow === 5;
                  return (
                    <tr
                      key={r.ramadanDay}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: friday ? "#f0fdf4" : "transparent",
                      }}
                    >
                      <td style={{ padding: ".45rem .7rem", fontWeight: 600 }}>{r.ramadanDay}</td>
                      <td style={{ padding: ".45rem .7rem" }}>
                        {WEEKDAYS[dow]}, {r.gregorian.day} {MONTHS_SHORT[r.gregorian.month - 1]} {r.gregorian.year}
                      </td>
                      <td style={{ padding: ".45rem .7rem", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {r.sehri}
                      </td>
                      <td style={{ padding: ".45rem .7rem", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {r.iftar}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: "1rem", fontSize: ".8rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
            Dates use the tabular Islamic calendar and may differ by ±1 day from local moon-sighting
            announcements — always confirm the start of Ramadan with your local committee. Calculated
            times; local mosque timetables may vary by a few minutes. Times are in {city.name}&apos;s
            standard timezone.
          </p>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
