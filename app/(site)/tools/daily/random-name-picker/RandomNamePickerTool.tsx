"use client";

import { useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextArea, ResultBox } from "@/components/tools/ToolUI";

export default function RandomNamePickerTool() {
  const [namesText, setNamesText] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const names = namesText
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n.length > 0);

  function spin() {
    if (names.length === 0 || spinning) return;
    setWinner(null);
    setSpinning(true);

    const finalWinner = names[Math.floor(Math.random() * names.length)];
    const totalDuration = 2000;
    const start = Date.now();
    let delay = 80;

    function tick() {
      setDisplayName(names[Math.floor(Math.random() * names.length)]);
      const elapsed = Date.now() - start;
      if (elapsed >= totalDuration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayName(finalWinner);
        setWinner(finalWinner);
        setSpinning(false);
        return;
      }
      if (elapsed > totalDuration * 0.6) {
        delay = 160;
      }
      if (elapsed > totalDuration * 0.85) {
        delay = 260;
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setTimeout(tick, delay) as unknown as ReturnType<typeof setInterval>;
    }

    intervalRef.current = setTimeout(tick, delay) as unknown as ReturnType<typeof setInterval>;
  }

  return (
    <ToolPageLayout
      title="Random Name Picker"
      description="Paste a list of names and spin to randomly pick a winner, free and instant."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Names (one per line)">
          <TextArea
            placeholder={"Alice\nBob\nCharlie\nDiana"}
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            rows={8}
          />
        </Field>

        <button
          type="button"
          className="btn-primary"
          onClick={spin}
          disabled={spinning || names.length === 0}
        >
          {spinning ? "Spinning…" : "Spin"}
        </button>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "1.6rem",
            fontWeight: 700,
            minHeight: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: spinning ? "var(--muted)" : "var(--text)",
          }}
        >
          {displayName ?? (names.length > 0 ? "Ready to spin" : "Add some names above")}
        </div>

        {winner && !spinning && (
          <ResultBox>
            <div style={{ textAlign: "center", fontSize: "1.3rem", fontWeight: 700 }}>
              🎉 Winner: {winner}
            </div>
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
