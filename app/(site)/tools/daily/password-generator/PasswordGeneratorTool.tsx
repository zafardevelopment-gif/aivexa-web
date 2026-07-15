"use client";

import { useEffect, useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, ResultBox, CopyButton } from "@/components/tools/ToolUI";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function randomIndex(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function generatePassword(
  length: number,
  useLower: boolean,
  useUpper: boolean,
  useNumbers: boolean,
  useSymbols: boolean
): string {
  let charset = "";
  if (useLower) charset += LOWERCASE;
  if (useUpper) charset += UPPERCASE;
  if (useNumbers) charset += NUMBERS;
  if (useSymbols) charset += SYMBOLS;
  if (charset === "") charset = LOWERCASE;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[randomIndex(charset.length)];
  }
  return password;
}

function getStrength(
  length: number,
  categoryCount: number
): { label: string; color: string } {
  let score = 0;
  if (length >= 8) score++;
  if (length >= 12) score++;
  if (length >= 16) score++;
  if (categoryCount >= 2) score++;
  if (categoryCount >= 3) score++;
  if (categoryCount >= 4) score++;

  if (score <= 2) return { label: "Weak", color: "#dc2626" };
  if (score <= 4) return { label: "Medium", color: "#d97706" };
  return { label: "Strong", color: "#16a34a" };
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const categoryCount = useMemo(() => {
    return [useLower, useUpper, useNumbers, useSymbols].filter(Boolean).length;
  }, [useLower, useUpper, useNumbers, useSymbols]);

  useEffect(() => {
    setPassword(
      generatePassword(length, useLower, useUpper, useNumbers, useSymbols)
    );
  }, [length, useLower, useUpper, useNumbers, useSymbols, refreshKey]);

  const strength = getStrength(length, categoryCount || 1);

  function toggleWithFallback(
    current: boolean,
    setter: (v: boolean) => void
  ) {
    const next = !current;
    const others = [useLower, useUpper, useNumbers, useSymbols];
    const otherActiveCount = others.filter(Boolean).length - (current ? 1 : 0);
    if (!next && otherActiveCount === 0) {
      setUseLower(true);
      return;
    }
    setter(next);
  }

  return (
    <ToolPageLayout
      title="Password Generator"
      description="Generate strong, random passwords instantly, free, secure, and no signup required."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label={`Password Length: ${length}`}>
          <input
            type="range"
            min={6}
            max={32}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </Field>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: ".6rem",
            marginBottom: "1.1rem",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem" }}>
            <input
              type="checkbox"
              checked={useLower}
              onChange={() => toggleWithFallback(useLower, setUseLower)}
            />
            Lowercase (a-z)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem" }}>
            <input
              type="checkbox"
              checked={useUpper}
              onChange={() => toggleWithFallback(useUpper, setUseUpper)}
            />
            Uppercase (A-Z)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem" }}>
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={() => toggleWithFallback(useNumbers, setUseNumbers)}
            />
            Numbers (0-9)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem" }}>
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={() => toggleWithFallback(useSymbols, setUseSymbols)}
            />
            Symbols (!@#$)
          </label>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          Regenerate
        </button>

        <ResultBox>
          <div
            style={{
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "1.25rem",
              fontWeight: 600,
              wordBreak: "break-all",
              marginBottom: ".9rem",
            }}
          >
            {password}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: ".6rem",
            }}
          >
            <span style={{ fontSize: ".85rem", fontWeight: 600, color: strength.color }}>
              Strength: {strength.label}
            </span>
            <CopyButton text={password} label="Copy Password" />
          </div>
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
