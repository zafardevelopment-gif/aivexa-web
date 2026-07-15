"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput } from "@/components/tools/ToolUI";

const HEX_REGEX = /^#?[0-9a-fA-F]{6}$/;

type HSL = { h: number; s: number; l: number };

function hexToHsl(hex: string): HSL {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s, l };
}

function hue2rgb(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function hslToHex({ h, s, l }: HSL): string {
  const hue = ((h % 360) + 360) % 360;
  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hue / 360 + 1 / 3);
    g = hue2rgb(p, q, hue / 360);
    b = hue2rgb(p, q, hue / 360 - 1 / 3);
  }

  const toHex = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rotateHue(hsl: HSL, degrees: number): HSL {
  return { ...hsl, h: ((hsl.h + degrees) % 360 + 360) % 360 };
}

function Swatch({
  hex,
  copied,
  onClick,
}: {
  hex: string;
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "1px solid var(--border-2)",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        background: "none",
        textAlign: "left",
        flex: "1 1 100px",
        minWidth: "100px",
      }}
    >
      <div style={{ background: hex, height: "70px" }} />
      <div
        style={{
          padding: ".5rem",
          fontSize: ".8rem",
          fontFamily: "monospace",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        {copied ? "Copied!" : hex}
      </div>
    </button>
  );
}

function PaletteRow({
  title,
  colors,
  clicked,
  onCopy,
}: {
  title: string;
  colors: string[];
  clicked: string | null;
  onCopy: (hex: string) => void;
}) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: ".6rem" }}>{title}</h3>
      <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
        {colors.map((hex, i) => (
          <Swatch key={`${hex}-${i}`} hex={hex} copied={clicked === hex} onClick={() => onCopy(hex)} />
        ))}
      </div>
    </div>
  );
}

export default function ColorPaletteGeneratorTool() {
  const [inputValue, setInputValue] = useState("#4f46e5");
  const [clicked, setClicked] = useState<string | null>(null);

  const isValid = HEX_REGEX.test(inputValue);
  const normalizedHex = isValid
    ? `#${inputValue.replace("#", "").toUpperCase()}`
    : null;

  const baseHsl = normalizedHex ? hexToHsl(normalizedHex) : null;

  const complementary = baseHsl
    ? [normalizedHex as string, hslToHex(rotateHue(baseHsl, 180))]
    : [];

  const analogous = baseHsl
    ? [
        hslToHex(rotateHue(baseHsl, -30)),
        normalizedHex as string,
        hslToHex(rotateHue(baseHsl, 30)),
      ]
    : [];

  const triadic = baseHsl
    ? [
        normalizedHex as string,
        hslToHex(rotateHue(baseHsl, 120)),
        hslToHex(rotateHue(baseHsl, 240)),
      ]
    : [];

  async function handleCopy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setClicked(hex);
      setTimeout(() => setClicked(null), 1200);
    } catch {
      setClicked(null);
    }
  }

  return (
    <ToolPageLayout
      title="Color Palette Generator"
      description="Generate complementary, analogous, and triadic color palettes from any hex color, free and instant."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Base color (hex)">
          <TextInput
            type="text"
            placeholder="#4f46e5"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Field>

        {!isValid && (
          <p style={{ color: "#b91c1c", fontSize: ".85rem", marginTop: "-.5rem", marginBottom: "1rem" }}>
            Enter a valid 6-digit hex color, e.g. #4f46e5.
          </p>
        )}

        {isValid && (
          <div style={{ marginTop: "1.5rem" }}>
            <PaletteRow title="Complementary" colors={complementary} clicked={clicked} onCopy={handleCopy} />
            <PaletteRow title="Analogous" colors={analogous} clicked={clicked} onCopy={handleCopy} />
            <PaletteRow title="Triadic" colors={triadic} clicked={clicked} onCopy={handleCopy} />
            <p className="section-desc" style={{ fontSize: ".85rem", marginTop: ".5rem" }}>
              Click any swatch to copy its hex code.
            </p>
          </div>
        )}
      </Card>
    </ToolPageLayout>
  );
}
