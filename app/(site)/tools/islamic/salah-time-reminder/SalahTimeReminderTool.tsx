"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, SelectInput } from "@/components/tools/ToolUI";
import LocationPicker, { DEFAULT_LOCATION, type LocationValue } from "@/components/tools/LocationPicker";
import {
  METHODS,
  METHOD_KEYS,
  computePrayerTimes,
  formatTime12,
  toMinutesOfDay,
  type AsrFactor,
  type MethodKey,
  type PrayerTimesResult,
} from "@/lib/prayer-times";

const FIVE: { key: keyof PrayerTimesResult; label: string }[] = [
  { key: "fajr", label: "Fajr" },
  { key: "dhuhr", label: "Dhuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
];

function cityToday(tz: number): { year: number; month: number; day: number } {
  const d = new Date(Date.now() + tz * 3600e3);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

function cityNowMinutes(tz: number): number {
  const d = new Date(Date.now() + tz * 3600e3);
  return d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
}

type Scheduled = { id: number; label: string; timeLabel: string; kind: "at" | "before" };

export default function SalahTimeReminderTool() {
  const [location, setLocation] = useState<LocationValue>(DEFAULT_LOCATION);
  const [method, setMethod] = useState<MethodKey>("MWL");
  const [asrFactor, setAsrFactor] = useState<AsrFactor>(1);
  const [preAlert, setPreAlert] = useState(true);
  const [scheduled, setScheduled] = useState<Scheduled[]>([]);
  const [status, setStatus] = useState("");
  const [, setTick] = useState(0);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // Clear any pending timers on unmount.
  useEffect(
    () => () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    },
    []
  );

  const today = cityToday(location.tz);
  const times = useMemo(
    () => computePrayerTimes(today, location.lat, location.lng, location.tz, method, asrFactor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location, method, asrFactor, today.year, today.month, today.day]
  );

  const nowMin = cityNowMinutes(location.tz);
  const remaining = FIVE.filter(
    (p) => Number.isFinite(times[p.key]) && toMinutesOfDay(times[p.key]) > nowMin
  );

  function cancelAll() {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
    setScheduled([]);
    setStatus("All reminders cancelled.");
  }

  async function enableReminders() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatus("This browser does not support notifications. Try Chrome, Edge or Firefox on desktop/Android.");
      return;
    }
    let permission = Notification.permission;
    if (permission === "default") {
      try {
        permission = await Notification.requestPermission();
      } catch {
        permission = "denied";
      }
    }
    if (permission !== "granted") {
      setStatus("Notification permission was denied. You can still use this page as a timetable, or allow notifications in your browser's site settings.");
      return;
    }
    // Reset any existing schedule first.
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    const list: Scheduled[] = [];
    let idCounter = 1;
    const nowM = cityNowMinutes(location.tz);
    for (const p of remaining) {
      const prayerMin = toMinutesOfDay(times[p.key]);
      const timeLabel = formatTime12(times[p.key]);
      const delayMs = Math.round((prayerMin - nowM) * 60000);
      if (delayMs <= 0) continue;
      const atId = window.setTimeout(() => {
        try {
          new Notification(`🕌 ${p.label} time`, {
            body: `It is now time for ${p.label} (${timeLabel}).`,
          });
        } catch {
          /* notification construction can fail on some mobile browsers */
        }
        setScheduled((s) => s.filter((x) => x.label !== p.label || x.kind !== "at"));
      }, delayMs);
      timeoutsRef.current.push(atId);
      list.push({ id: idCounter++, label: p.label, timeLabel, kind: "at" });

      if (preAlert && delayMs > 10 * 60000) {
        const beforeId = window.setTimeout(() => {
          try {
            new Notification(`⏰ ${p.label} in 10 minutes`, {
              body: `${p.label} will begin at ${timeLabel}.`,
            });
          } catch {
            /* ignore */
          }
          setScheduled((s) => s.filter((x) => x.label !== p.label || x.kind !== "before"));
        }, delayMs - 10 * 60000);
        timeoutsRef.current.push(beforeId);
        list.push({ id: idCounter++, label: p.label, timeLabel, kind: "before" });
      }
    }
    setScheduled(list);
    setStatus(
      list.length > 0
        ? `${list.length} reminder${list.length > 1 ? "s" : ""} scheduled for today.`
        : "No remaining prayers today — come back tomorrow, or check after midnight."
    );
  }

  return (
    <ToolPageLayout
      title="Salah Time Reminder"
      description="See today's remaining prayers and get a browser notification at each prayer time — everything runs privately in your browser."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <Card>
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "10px",
            padding: ".8rem 1rem",
            fontSize: ".85rem",
            color: "#92400e",
            marginBottom: "1.2rem",
            lineHeight: 1.55,
          }}
        >
          <strong>Honest limitation:</strong> reminders work while this browser tab stays open. If you
          close the tab or your device sleeps, reminders will not fire. For always-on reminders, use a
          dedicated prayer app.
        </div>

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

        <h3 style={{ fontSize: ".95rem", margin: "0 0 .6rem" }}>Today&apos;s prayers</h3>
        <div style={{ marginBottom: "1.2rem" }}>
          {FIVE.map((p) => {
            const t = times[p.key];
            const passed = Number.isFinite(t) && toMinutesOfDay(t) <= nowMin;
            return (
              <div
                key={p.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: ".55rem .8rem",
                  borderBottom: "1px solid var(--border)",
                  opacity: passed ? 0.55 : 1,
                  fontSize: ".95rem",
                }}
              >
                <span>
                  <span aria-hidden style={{ marginRight: ".55rem" }}>{passed ? "✅" : "🕒"}</span>
                  {p.label}
                  {passed && <span style={{ fontSize: ".78rem", color: "var(--muted-2)" }}> — passed</span>}
                </span>
                <strong style={{ fontVariantNumeric: "tabular-nums" }}>{formatTime12(t)}</strong>
              </div>
            );
          })}
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: ".55rem", fontSize: ".9rem", marginBottom: "1rem" }}>
          <input type="checkbox" checked={preAlert} onChange={(e) => setPreAlert(e.target.checked)} />
          Also remind me 10 minutes before each prayer
        </label>

        <div style={{ display: "flex", gap: ".7rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-primary sm"
            onClick={enableReminders}
            disabled={remaining.length === 0}
          >
            🔔 Enable reminders ({remaining.length} prayer{remaining.length === 1 ? "" : "s"} left today)
          </button>
          {scheduled.length > 0 && (
            <button type="button" className="btn-secondary sm" onClick={cancelAll}>
              Cancel all reminders
            </button>
          )}
        </div>
        {status && <p style={{ fontSize: ".88rem", color: "var(--muted)", marginTop: ".8rem" }}>{status}</p>}

        {scheduled.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h3 style={{ fontSize: ".9rem", margin: "0 0 .5rem" }}>Scheduled reminders</h3>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: ".88rem", lineHeight: 1.9 }}>
              {scheduled.map((s) => (
                <li key={s.id}>
                  {s.kind === "at" ? (
                    <>
                      <strong>{s.label}</strong> at {s.timeLabel}
                    </>
                  ) : (
                    <>
                      10-minute heads-up before <strong>{s.label}</strong> ({s.timeLabel})
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p style={{ marginTop: "1.2rem", fontSize: ".82rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
          Calculated times; local mosque timings may vary by a few minutes. Reminder timing assumes the
          selected city is in your device&apos;s timezone.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
