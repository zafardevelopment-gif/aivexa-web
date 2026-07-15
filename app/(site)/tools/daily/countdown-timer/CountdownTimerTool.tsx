"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, CopyButton } from "@/components/tools/ToolUI";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimerTool() {
  const params = useSearchParams();
  const [target, setTarget] = useState("");
  const [eventName, setEventName] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = params.get("t");
    const n = params.get("n");
    if (t && !Number.isNaN(new Date(t).getTime())) setTarget(t);
    if (n) setEventName(n.slice(0, 80));
  }, [params]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const targetMs = useMemo(() => {
    if (!target) return null;
    const d = new Date(target);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }, [target]);

  const remaining = targetMs === null ? null : targetMs - now;

  const shareUrl = useMemo(() => {
    if (!target || typeof window === "undefined") return "";
    const u = new URL(window.location.pathname, window.location.origin);
    u.searchParams.set("t", target);
    if (eventName) u.searchParams.set("n", eventName);
    return u.toString();
  }, [target, eventName]);

  let display: { d: number; h: number; m: number; s: number } | null = null;
  if (remaining !== null && remaining > 0) {
    display = {
      d: Math.floor(remaining / 86400000),
      h: Math.floor((remaining % 86400000) / 3600000),
      m: Math.floor((remaining % 3600000) / 60000),
      s: Math.floor((remaining % 60000) / 1000),
    };
  }

  return (
    <ToolPageLayout
      title="Countdown Timer"
      description="Count down to any date or event, with a shareable link."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Event Name (optional)">
          <TextInput
            type="text"
            value={eventName}
            maxLength={80}
            placeholder="e.g. Eid, Product Launch, Exam"
            onChange={(e) => setEventName(e.target.value)}
          />
        </Field>
        <Field label="Target Date & Time">
          <TextInput
            type="datetime-local"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </Field>

        <ResultBox>
          {targetMs === null ? (
            <p style={{ color: "var(--muted)", margin: 0 }}>
              Pick a target date and time to start the countdown.
            </p>
          ) : remaining !== null && remaining <= 0 ? (
            <p style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "var(--indigo)" }}>
              {eventName ? `${eventName} is here!` : "Time's up!"}
            </p>
          ) : display ? (
            <div style={{ textAlign: "center" }}>
              {eventName && (
                <p style={{ fontWeight: 600, marginBottom: ".8rem" }}>{eventName}</p>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { v: display.d, l: "Days" },
                  { v: display.h, l: "Hours" },
                  { v: display.m, l: "Minutes" },
                  { v: display.s, l: "Seconds" },
                ].map((u) => (
                  <div key={u.l} style={{ minWidth: 72 }}>
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "var(--indigo)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {u.l === "Days" ? u.v : pad(u.v)}
                    </div>
                    <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>{u.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </ResultBox>

        {shareUrl && (
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: ".6rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextInput readOnly value={shareUrl} style={{ flex: 1, minWidth: 220 }} />
            <CopyButton text={shareUrl} label="Copy share link" />
          </div>
        )}
      </Card>
    </ToolPageLayout>
  );
}
