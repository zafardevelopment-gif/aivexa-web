"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import { LETTER_VALUES, NUMBER_MEANINGS, reduceNumber } from "./numerology-data";

function computeLifePath(dob: string): number | null {
  if (!dob) return null;
  const digits = dob.replace(/-/g, "");
  if (digits.length !== 8 || !/^\d+$/.test(digits)) return null;
  const sum = digits.split("").reduce((s, d) => s + Number(d), 0);
  return reduceNumber(sum);
}

function computeDestiny(name: string): number | null {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "");
  if (!letters) return null;
  const sum = letters.split("").reduce((s, ch) => s + (LETTER_VALUES[ch] ?? 0), 0);
  return reduceNumber(sum);
}

export default function NumerologyCalculatorTool() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const lifePath = computeLifePath(dob);
  const destiny = computeDestiny(name);

  return (
    <ToolPageLayout
      title="Numerology Calculator"
      description="Find your Life Path and Destiny number from your name and date of birth."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "10px",
            padding: ".9rem 1.1rem",
            fontSize: ".85rem",
            color: "#9a3412",
            marginBottom: "1.4rem",
            fontWeight: 500,
          }}
        >
          For entertainment and traditional-belief purposes only. Numerology is
          not a scientific practice — results should not be used to make
          important life, health or financial decisions.
        </div>

        <Field label="Full Name">
          <TextInput
            type="text"
            placeholder="e.g. John Michael Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Date of Birth">
          <TextInput
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </Field>

        {(lifePath !== null || destiny !== null) && (
          <ResultBox>
            {lifePath !== null && (
              <>
                <ResultRow label="Life Path Number" value={lifePath} />
                <p style={{ fontSize: ".88rem", color: "var(--muted)", margin: ".6rem 0 1rem" }}>
                  {NUMBER_MEANINGS[lifePath]}
                </p>
              </>
            )}
            {destiny !== null && (
              <>
                <ResultRow label="Destiny (Expression) Number" value={destiny} />
                <p style={{ fontSize: ".88rem", color: "var(--muted)", margin: ".6rem 0 0" }}>
                  {NUMBER_MEANINGS[destiny]}
                </p>
              </>
            )}
          </ResultBox>
        )}

        {lifePath === null && destiny === null && (
          <p style={{ fontSize: ".88rem", color: "var(--muted-2)" }}>
            Enter your full name and date of birth above to see your numbers.
          </p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
