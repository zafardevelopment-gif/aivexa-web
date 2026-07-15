"use client";

import { useEffect, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput } from "@/components/tools/ToolUI";

const STORAGE_KEY = "aivexa-tasbih-count";
const TARGET_KEY = "aivexa-tasbih-target";

export default function TasbihCounterTool() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<number | "">(33);
  const [muted, setMuted] = useState(true);
  const [celebrated, setCelebrated] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const savedCount = localStorage.getItem(STORAGE_KEY);
    const savedTarget = localStorage.getItem(TARGET_KEY);
    if (savedCount) setCount(parseInt(savedCount, 10) || 0);
    if (savedTarget) setTarget(savedTarget === "" ? "" : parseInt(savedTarget, 10) || "");
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(count));
  }, [count]);

  useEffect(() => {
    localStorage.setItem(TARGET_KEY, target === "" ? "" : String(target));
  }, [target]);

  function playTick() {
    if (muted) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Web Audio unavailable — silently ignore
    }
  }

  function handleTap() {
    const next = count + 1;
    setCount(next);
    playTick();

    if (target !== "" && next === target) {
      setCelebrated(true);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate([120, 60, 120]);
        } catch {
          // vibration unavailable — ignore
        }
      }
      setTimeout(() => setCelebrated(false), 2000);
    }
  }

  function handleReset() {
    setCount(0);
    setCelebrated(false);
  }

  const reachedTarget = target !== "" && count >= target;

  return (
    <ToolPageLayout
      title="Tasbih Counter"
      description="A simple digital dhikr counter with a target count, vibration alert and optional tick sound."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: ".8rem", alignItems: "end" }}>
          <Field label="Target count (optional)">
            <TextInput
              type="number"
              min={1}
              placeholder="e.g. 33, 99, 100"
              value={target}
              onChange={(e) => setTarget(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
          </Field>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setMuted((m) => !m)}
            style={{ marginBottom: "1.1rem" }}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>

        <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
          <button
            type="button"
            onClick={handleTap}
            aria-label="Increment tasbih count"
            style={{
              width: "min(70vw, 260px)",
              height: "min(70vw, 260px)",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              fontSize: "3rem",
              fontWeight: 800,
              color: "#fff",
              background: celebrated || reachedTarget ? "var(--emerald, #10b981)" : "var(--indigo)",
              boxShadow: celebrated ? "0 0 0 12px rgba(16,185,129,.18)" : "var(--shadow-lg)",
              transition: "all .25s ease",
              animation: celebrated ? "tasbih-pulse 0.6s ease infinite" : "none",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
            }}
          >
            {count}
          </button>
          <style>{`
            @keyframes tasbih-pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>
        </div>

        {target !== "" && (
          <p style={{ textAlign: "center", fontSize: ".9rem", color: "var(--muted)", marginBottom: "1rem" }}>
            {reachedTarget ? `Target of ${target} reached!` : `${count} / ${target}`}
          </p>
        )}

        <div style={{ textAlign: "center" }}>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>

        <p style={{ marginTop: "1.4rem", fontSize: ".82rem", color: "var(--muted-2)", lineHeight: 1.6, textAlign: "center" }}>
          Your count is saved automatically in this browser and will survive a page refresh.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
