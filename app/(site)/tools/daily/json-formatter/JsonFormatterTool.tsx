"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextArea, CopyButton } from "@/components/tools/ToolUI";

function positionToLineColumn(text: string, position: number): { line: number; column: number } {
  const upToPosition = text.slice(0, position);
  const lines = upToPosition.split("\n");
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorPos, setErrorPos] = useState<{ line: number; column: number } | null>(null);

  function handleFormat() {
    setError(null);
    setErrorPos(null);
    setOutput("");

    if (input.trim() === "") {
      setError("Please paste some JSON to format.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid JSON.";
      setError(message);

      const match = message.match(/position (\d+)/i);
      if (match) {
        const position = Number(match[1]);
        if (Number.isFinite(position)) {
          setErrorPos(positionToLineColumn(input, position));
        }
      }
    }
  }

  return (
    <ToolPageLayout
      title="JSON Formatter"
      description="Paste raw JSON to instantly format, validate, and pretty-print it, free and no signup required."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Raw JSON">
          <TextArea
            placeholder='{"hello": "world"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            style={{ fontFamily: "monospace" }}
          />
        </Field>

        <button type="button" className="btn-primary" onClick={handleFormat}>
          Format
        </button>

        {error && (
          <div
            style={{
              marginTop: "1.5rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              color: "#b91c1c",
              fontSize: ".92rem",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ display: "block", marginBottom: ".3rem" }}>Invalid JSON</strong>
            <div>{error}</div>
            {errorPos && (
              <div style={{ marginTop: ".3rem", fontWeight: 600 }}>
                Line {errorPos.line}, Column {errorPos.column}
              </div>
            )}
          </div>
        )}

        {output && (
          <div style={{ marginTop: "1.5rem" }}>
            <TextArea value={output} readOnly rows={12} style={{ fontFamily: "monospace" }} />
            <div style={{ marginTop: ".75rem" }}>
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </Card>
    </ToolPageLayout>
  );
}
