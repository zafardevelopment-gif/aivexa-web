"use client";

import { useEffect, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, SelectInput } from "@/components/tools/ToolUI";

const formats = [
  { value: "CODE128", label: "CODE128 (any text)" },
  { value: "EAN13", label: "EAN-13 (12 or 13 digits)" },
  { value: "UPC", label: "UPC-A (11 or 12 digits)" },
  { value: "CODE39", label: "CODE39 (A-Z, 0-9, -.$/+% )" },
];

export default function BarcodeGeneratorTool() {
  const [value, setValue] = useState("");
  const [format, setFormat] = useState("CODE128");
  const [error, setError] = useState("");
  const [hasBarcode, setHasBarcode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!value.trim()) {
      setHasBarcode(false);
      setError("");
      return;
    }
    (async () => {
      try {
        const JsBarcode = (await import("jsbarcode")).default;
        if (cancelled) return;
        JsBarcode(canvas, value.trim(), {
          format,
          displayValue: true,
          fontSize: 16,
          margin: 12,
          height: 90,
          lineColor: "#111827",
          valid: (ok: boolean) => {
            if (!cancelled) {
              setHasBarcode(ok);
              setError(
                ok
                  ? ""
                  : "Invalid input for this barcode format — check length and allowed characters."
              );
            }
          },
        });
      } catch {
        if (!cancelled) {
          setHasBarcode(false);
          setError(
            "Invalid input for this barcode format — check length and allowed characters."
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value, format]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasBarcode) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "barcode.png";
    a.click();
  };

  return (
    <ToolPageLayout
      title="Barcode Generator"
      description="Generate CODE128, EAN-13, UPC-A and CODE39 barcodes — free and downloadable."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Barcode Format">
          <SelectInput value={format} onChange={(e) => setFormat(e.target.value)}>
            {formats.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Text / Number">
          <TextInput
            type="text"
            value={value}
            placeholder={format === "EAN13" ? "e.g. 590123412345" : "Enter value"}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>

        {error && <p style={{ color: "#dc2626", fontSize: ".88rem" }}>{error}</p>}

        <div style={{ textAlign: "center", marginTop: "1rem", overflowX: "auto" }}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: "100%",
              display: hasBarcode ? "inline-block" : "none",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
          />
          {!hasBarcode && !error && (
            <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>
              Enter a value above to generate a barcode.
            </p>
          )}
        </div>

        {hasBarcode && (
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
