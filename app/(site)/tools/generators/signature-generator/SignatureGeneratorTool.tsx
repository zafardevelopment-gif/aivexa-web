"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dancing_Script,
  Great_Vibes,
  Pacifico,
  Satisfy,
  Caveat,
  Allura,
} from "next/font/google";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TabGroup } from "@/components/tools/ToolUI";
import { canvasToBlob, downloadBlob } from "@/components/tools/imageUtils";

const dancing = Dancing_Script({ subsets: ["latin"], weight: "700" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
const satisfy = Satisfy({ subsets: ["latin"], weight: "400" });
const caveat = Caveat({ subsets: ["latin"], weight: "700" });
const allura = Allura({ subsets: ["latin"], weight: "400" });

const FONTS = [
  { label: "Dancing Script", font: dancing },
  { label: "Great Vibes", font: greatVibes },
  { label: "Allura", font: allura },
  { label: "Satisfy", font: satisfy },
  { label: "Caveat", font: caveat },
  { label: "Pacifico", font: pacifico },
];

export default function SignatureGeneratorTool() {
  const [tab, setTab] = useState("type");
  const [name, setName] = useState("");
  const [color, setColor] = useState("#1e2a78");
  const [busy, setBusy] = useState(false);

  // draw pad
  const padRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const canvas = padRef.current;
    if (!canvas || tab !== "draw") return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [tab]);

  function padPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function padDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastRef.current = padPos(e);
  }
  function padMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = padRef.current;
    const ctx = canvas?.getContext("2d");
    const last = lastRef.current;
    if (!ctx || !last) return;
    const p = padPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
    setHasInk(true);
  }
  function padUp() {
    drawingRef.current = false;
    lastRef.current = null;
  }

  function clearPad() {
    const canvas = padRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  }

  async function downloadDrawn() {
    const canvas = padRef.current;
    if (!canvas || !hasInk || busy) return;
    setBusy(true);
    try {
      downloadBlob(await canvasToBlob(canvas, "image/png"), "signature.png");
    } finally {
      setBusy(false);
    }
  }

  async function downloadTyped(fontFamily: string, label: string) {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const fontSpec = `120px ${fontFamily}`;
      try {
        await document.fonts.load(fontSpec, name.trim());
      } catch {
        /* proceed with fallback */
      }
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = fontSpec;
      const metrics = ctx.measureText(name.trim());
      const w = Math.ceil(metrics.width) + 80;
      const h = 240;
      canvas.width = w;
      canvas.height = h;
      const ctx2 = canvas.getContext("2d");
      if (!ctx2) return;
      ctx2.font = fontSpec;
      ctx2.fillStyle = color;
      ctx2.textBaseline = "middle";
      ctx2.fillText(name.trim(), 40, h / 2);
      downloadBlob(
        await canvasToBlob(canvas, "image/png"),
        `signature-${label.toLowerCase().replace(/\s+/g, "-")}.png`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Signature Generator"
      description="Type your name in script fonts or draw your signature by hand, then download a transparent PNG — perfect for documents and emails. 100% in-browser."
      categoryHref="/tools/generators"
      categoryName="Generators & Documents"
    >
      <Card>
        <TabGroup
          options={[
            { value: "type", label: "Type signature" },
            { value: "draw", label: "Draw signature" },
          ]}
          value={tab}
          onChange={setTab}
        />

        <Field label="Ink Color">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: 120, height: 42, border: "1px solid var(--border-2)", borderRadius: 10, cursor: "pointer", background: "#fff" }}
          />
        </Field>

        {tab === "type" ? (
          <>
            <Field label="Your Name">
              <TextInput value={name} placeholder="e.g. Rohan Kapoor" onChange={(e) => setName(e.target.value)} />
            </Field>
            {!name.trim() && (
              <p style={{ fontSize: ".88rem", color: "var(--muted-2)" }}>
                Type your name to see it rendered in signature styles.
              </p>
            )}
            {name.trim() && (
              <div style={{ display: "grid", gap: ".8rem" }}>
                {FONTS.map(({ label, font }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      border: "1px solid var(--border-2, #e2e8f0)",
                      borderRadius: 12,
                      padding: ".8rem 1.1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: ".72rem", color: "var(--muted-2)", marginBottom: ".15rem" }}>{label}</div>
                      <div className={font.className} style={{ fontSize: "2.1rem", color, lineHeight: 1.2 }}>
                        {name.trim()}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary sm"
                      disabled={busy}
                      onClick={() => downloadTyped(font.style.fontFamily, label)}
                    >
                      Download PNG
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <Field label={`Stroke Width: ${strokeWidth}px`}>
              <input
                type="range"
                min={1}
                max={10}
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </Field>
            <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginBottom: ".6rem" }}>
              Sign below with your mouse, finger or stylus.
            </p>
            <canvas
              ref={padRef}
              onPointerDown={padDown}
              onPointerMove={padMove}
              onPointerUp={padUp}
              onPointerLeave={padUp}
              style={{
                width: "100%",
                height: 220,
                border: "2px dashed var(--border-2, #cbd5e1)",
                borderRadius: 12,
                touchAction: "none",
                background:
                  "repeating-conic-gradient(#fafafa 0% 25%, #ffffff 0% 50%) 50% / 24px 24px",
                cursor: "crosshair",
                display: "block",
              }}
            />
            <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-primary"
                disabled={!hasInk || busy}
                style={{ opacity: !hasInk || busy ? 0.5 : 1 }}
                onClick={downloadDrawn}
              >
                Download transparent PNG
              </button>
              <button type="button" className="btn-secondary" onClick={clearPad}>
                Clear
              </button>
            </div>
          </>
        )}

        <p style={{ fontSize: ".82rem", color: "var(--muted-2)", marginTop: "1.2rem" }}>
          The PNG has a transparent background so you can place it on any document.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
