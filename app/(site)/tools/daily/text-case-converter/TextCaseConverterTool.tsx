"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextArea, CopyButton } from "@/components/tools/ToolUI";

function toUpperCase(text: string) {
  return text.toUpperCase();
}

function toLowerCase(text: string) {
  return text.toLowerCase();
}

function toTitleCase(text: string) {
  return text.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function toSentenceCase(text: string) {
  const lower = text.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
}

function toCamelCase(text: string) {
  const words = text.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

function toSnakeCase(text: string) {
  const withBoundaries = text.replace(/([a-z0-9])([A-Z])/g, "$1_$2");
  const words = withBoundaries.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return words.map((w) => w.toLowerCase()).join("_");
}

export default function TextCaseConverterTool() {
  const [text, setText] = useState("");

  const results = useMemo(
    () => [
      { label: "UPPERCASE", value: toUpperCase(text) },
      { label: "lowercase", value: toLowerCase(text) },
      { label: "Title Case", value: toTitleCase(text) },
      { label: "Sentence case", value: toSentenceCase(text) },
      { label: "camelCase", value: toCamelCase(text) },
      { label: "snake_case", value: toSnakeCase(text) },
    ],
    [text]
  );

  return (
    <ToolPageLayout
      title="Text Case Converter"
      description="Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case instantly, free."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Your Text">
          <TextArea
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginTop: "1.25rem",
        }}
      >
        {results.map((r) => (
          <Card key={r.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: ".6rem",
              }}
            >
              <strong style={{ fontSize: ".85rem" }}>{r.label}</strong>
              <CopyButton text={r.value} />
            </div>
            <p
              style={{
                wordBreak: "break-word",
                fontSize: ".92rem",
                color: "var(--muted)",
                minHeight: "1.4em",
              }}
            >
              {r.value || "—"}
            </p>
          </Card>
        ))}
      </div>
    </ToolPageLayout>
  );
}
