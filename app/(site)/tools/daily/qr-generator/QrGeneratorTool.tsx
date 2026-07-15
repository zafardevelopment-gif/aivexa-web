"use client";

import { useEffect, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TextArea, SelectInput } from "@/components/tools/ToolUI";

export default function QrGeneratorTool() {
  const [text, setText] = useState("");
  const [dark, setDark] = useState("#111827");
  const [light, setLight] = useState("#ffffff");
  const [size, setSize] = useState("300");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasQr, setHasQr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!text.trim()) {
      setHasQr(false);
      setError("");
      return;
    }
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled) return;
        await QRCode.toCanvas(canvas, text, {
          width: Number(size) || 300,
          margin: 2,
          color: { dark, light },
          errorCorrectionLevel: "M",
        });
        if (!cancelled) {
          setHasQr(true);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setHasQr(false);
          setError("Could not generate QR code — the text may be too long.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text, dark, light, size]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasQr) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr-code.png";
    a.click();
  };

  return (
    <ToolPageLayout
      title="QR Code Generator"
      description="Turn any text or URL into a downloadable QR code — free and instant."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Text or URL">
          <TextArea
            value={text}
            style={{ minHeight: 90 }}
            placeholder="https://example.com or any text"
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Field label="Foreground">
            <TextInput
              type="color"
              value={dark}
              style={{ width: 70, height: 42, padding: 4 }}
              onChange={(e) => setDark(e.target.value)}
            />
          </Field>
          <Field label="Background">
            <TextInput
              type="color"
              value={light}
              style={{ width: 70, height: 42, padding: 4 }}
              onChange={(e) => setLight(e.target.value)}
            />
          </Field>
          <Field label="Size (px)">
            <SelectInput value={size} onChange={(e) => setSize(e.target.value)} style={{ width: 120 }}>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="500">500</option>
              <option value="800">800</option>
            </SelectInput>
          </Field>
        </div>

        {error && <p style={{ color: "#dc2626", fontSize: ".88rem" }}>{error}</p>}

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: "100%",
              border: hasQr ? "1px solid var(--border)" : "none",
              borderRadius: 12,
              display: hasQr ? "inline-block" : "none",
            }}
          />
          {!hasQr && !error && (
            <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>
              Enter text above to generate a QR code.
            </p>
          )}
        </div>

        {hasQr && (
          <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
            <button type="button" className="btn-primary" onClick={download}>
              Download PNG
            </button>
          </div>
        )}
      </Card>
    </ToolPageLayout>
  );
}
