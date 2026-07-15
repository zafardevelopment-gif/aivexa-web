"use client";

import { useEffect, useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, SelectInput } from "@/components/tools/ToolUI";
import LocationPicker, { DEFAULT_LOCATION, type LocationValue } from "@/components/tools/LocationPicker";
import {
  METHODS,
  METHOD_KEYS,
  PRAYER_ORDER,
  computePrayerTimes,
  formatTime12,
  toMinutesOfDay,
  type AsrFactor,
  type MethodKey,
} from "@/lib/prayer-times";

function cityToday(tz: number): { year: number; month: number; day: number } {
  const d = new Date(Date.now() + tz * 3600e3);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

function cityNowMinutes(tz: number): number {
  const d = new Date(Date.now() + tz * 3600e3);
  return d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
}

const FIVE_PRAYERS = PRAYER_ORDER.filter((p) => p.key !== "sunrise");

export default function PrayerTimesTool() {
  const [location, setLocation] = useState<LocationValue>(DEFAULT_LOCATION);
  const [method, setMethod] = useState<MethodKey>("MWL");
  const [asrFactor, setAsrFactor] = useState<AsrFactor>(1);
  const [, setTick] = useState(0);

  // Re-render every second for the countdown.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const today = cityToday(location.tz);
  const times = useMemo(
    () => computePrayerTimes(today, location.lat, location.lng, location.tz, method, asrFactor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location, method, asrFactor, today.year, today.month, today.day]
  );

  const nowMin = cityNowMinutes(location.tz);
  const next = useMemo(() => {
    for (const p of FIVE_PRAYERS) {
      const t = times[p.key];
      if (Number.isFinite(t) && toMinutesOfDay(t) > nowMin) {
        return { key: p.key, label: p.label, minutesLeft: toMinutesOfDay(t) - nowMin };
      }
    }
    // All prayers passed — next is tomorrow's Fajr.
    if (Number.isFinite(times.fajr)) {
      return {
        key: "fajr" as const,
        label: "Fajr (tomorrow)",
        minutesLeft: 24 * 60 - nowMin + toMinutesOfDay(times.fajr),
      };
    }
    return null;
  }, [times, nowMin]);

  const countdown = next
    ? (() => {
        const totalSec = Math.max(0, Math.round(next.minutesLeft * 60));
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
      })()
    : "";

  const anyValid = Object.values(times).some((t) => Number.isFinite(t));
  const dateLabel = new Date(Date.UTC(today.year, today.month - 1, today.day)).toLocaleDateString(
    "en-IN",
    { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );

  return (
    <ToolPageLayout
      title="Prayer Times Calculator"
      description="Today's five daily prayer times plus sunrise, calculated astronomically for your location — entirely in your browser."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <Card>
        <LocationPicker value={location} onChange={setLocation} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" }}>
          <Field label="Calculation method">
            <SelectInput value={method} onChange={(e) => setMethod(e.target.value as MethodKey)}>
              {METHOD_KEYS.map((k) => (
                <option key={k} value={k}>
                  {METHODS[k].name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Asr juristic method">
            <SelectInput
              value={asrFactor}
              onChange={(e) => setAsrFactor(Number(e.target.value) === 2 ? 2 : 1)}
            >
              <option value={1}>Standard (Shafi&apos;i / Maliki / Hanbali)</option>
              <option value={2}>Hanafi</option>
            </SelectInput>
          </Field>
        </div>

        {anyValid ? (
          <>
            {next && (
              <div
                style={{
                  background: "var(--indigo-light)",
                  border: "1px solid #c7d2fe",
                  borderRadius: "12px",
                  padding: "1rem 1.3rem",
                  marginBottom: "1.2rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: ".5rem 1.5rem",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>Next prayer</span>
                <strong style={{ fontSize: "1.15rem" }}>{next.label}</strong>
                <span style={{ fontFamily: "monospace", fontSize: "1.05rem", color: "var(--indigo)" }}>
                  in {countdown}
                </span>
              </div>
            )}

            <p style={{ fontSize: ".88rem", color: "var(--muted)", marginBottom: ".6rem" }}>
              <strong>{location.label}</strong> — {dateLabel}
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".95rem" }}>
                <tbody>
                  {PRAYER_ORDER.map((p) => {
                    const isNext = next && p.label === next.label;
                    return (
                      <tr
                        key={p.key}
                        style={{
                          background: isNext ? "var(--indigo-light)" : "transparent",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <td style={{ padding: ".65rem .8rem", fontWeight: isNext ? 700 : 500 }}>
                          {p.label}
                          {p.key === "sunrise" && (
                            <span style={{ fontSize: ".78rem", color: "var(--muted-2)" }}> (end of Fajr)</span>
                          )}
                          {isNext && (
                            <span
                              style={{
                                marginLeft: ".5rem",
                                fontSize: ".72rem",
                                background: "var(--indigo)",
                                color: "#fff",
                                borderRadius: "99px",
                                padding: ".1rem .55rem",
                                verticalAlign: "middle",
                              }}
                            >
                              NEXT
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: ".65rem .8rem",
                            textAlign: "right",
                            fontWeight: isNext ? 700 : 600,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {formatTime12(times[p.key])}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p style={{ color: "#b45309", fontSize: ".9rem" }}>
            Times could not be calculated for this latitude (twilight formulas are unreliable near the
            poles). Please choose a location below ~66° latitude.
          </p>
        )}

        <p style={{ marginTop: "1.2rem", fontSize: ".82rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
          Calculated times; local mosque timings may vary by a few minutes. Times are shown in the
          selected city&apos;s standard timezone (your device&apos;s local timezone when using
          &ldquo;my location&rdquo;); daylight saving is not applied for international cities.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
