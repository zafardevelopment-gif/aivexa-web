"use client";

import { useMemo, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import { TYPING_PARAGRAPHS } from "./paragraphs-data";

function randomParagraph(exclude?: string): string {
  const pool = TYPING_PARAGRAPHS.filter((p) => p !== exclude);
  const list = pool.length > 0 ? pool : TYPING_PARAGRAPHS;
  return list[Math.floor(Math.random() * list.length)];
}

export default function TypingSpeedTestTool() {
  const [paragraph, setParagraph] = useState(() => randomParagraph());
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isComplete = typed.length >= paragraph.length;

  function handleChange(value: string) {
    if (finished) return;
    if (value.length > paragraph.length) return;

    if (startTime === null && value.length > 0) {
      setStartTime(Date.now());
    }
    setTyped(value);

    if (value.length === paragraph.length) {
      finishTest(value);
    }
  }

  function finishTest(finalTyped: string) {
    const end = Date.now();
    setFinished(true);
    setElapsedMs(startTime !== null ? end - startTime : null);
    setTyped(finalTyped);
  }

  function handleFinishClick() {
    if (!finished && typed.length > 0) {
      finishTest(typed);
    }
  }

  function handleReset() {
    setParagraph(randomParagraph(paragraph));
    setTyped("");
    setStartTime(null);
    setFinished(false);
    setElapsedMs(null);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  const { correctChars, totalTypedChars } = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === paragraph[i]) correct++;
    }
    return { correctChars: correct, totalTypedChars: typed.length };
  }, [typed, paragraph]);

  const minutes = elapsedMs !== null && elapsedMs > 0 ? elapsedMs / 60000 : null;
  const wpm = minutes !== null ? Math.round(correctChars / 5 / minutes) : null;
  const accuracy =
    totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : null;

  const highlighted = useMemo(() => {
    return paragraph.split("").map((char, i) => {
      let color = "var(--muted-2)";
      let bg = "transparent";
      if (i < typed.length) {
        if (typed[i] === char) {
          color = "#15803d";
        } else {
          color = "#b91c1c";
          bg = "#fee2e2";
        }
      } else if (i === typed.length && !finished) {
        bg = "#e0e7ff";
      }
      return (
        <span key={i} style={{ color, background: bg }}>
          {char}
        </span>
      );
    });
  }, [paragraph, typed, finished]);

  return (
    <ToolPageLayout
      title="Typing Speed Test"
      description="Measure your typing speed (WPM) and accuracy with live feedback."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <div
          style={{
            fontSize: "1rem",
            lineHeight: 1.9,
            fontFamily: "monospace",
            background: "var(--indigo-light, #f5f5ff)",
            border: "1px solid var(--border-2)",
            borderRadius: "10px",
            padding: "1rem 1.2rem",
            marginBottom: "1.1rem",
            userSelect: "none",
          }}
        >
          {highlighted}
        </div>

        <textarea
          ref={textareaRef}
          value={typed}
          onChange={(e) => handleChange(e.target.value)}
          disabled={finished}
          placeholder="Start typing here..."
          style={{
            width: "100%",
            padding: ".7rem .9rem",
            borderRadius: "10px",
            border: "1px solid var(--border-2)",
            fontSize: ".95rem",
            fontFamily: "monospace",
            resize: "vertical",
            minHeight: "120px",
          }}
        />

        <div style={{ display: "flex", gap: ".7rem", marginTop: "1rem", flexWrap: "wrap" }}>
          {!finished && (
            <button
              type="button"
              className="btn-primary sm"
              onClick={handleFinishClick}
              disabled={typed.length === 0}
            >
              Finish
            </button>
          )}
          <button type="button" className="btn-secondary sm" onClick={handleReset}>
            Try Again (New Paragraph)
          </button>
        </div>

        {!finished && (
          <p style={{ fontSize: ".82rem", color: "var(--muted-2)", marginTop: ".8rem" }}>
            Timer starts on your first keystroke. Type the full paragraph
            above, or click Finish when you're done.
          </p>
        )}

        {finished && (
          <ResultBox>
            <ResultRow label="Speed" value={wpm !== null ? `${wpm} WPM` : "N/A"} />
            <ResultRow label="Accuracy" value={accuracy !== null ? `${accuracy}%` : "N/A"} />
            <ResultRow
              label="Time Taken"
              value={elapsedMs !== null ? `${(elapsedMs / 1000).toFixed(1)}s` : "N/A"}
            />
            <ResultRow
              label="Characters Typed"
              value={`${correctChars} correct / ${totalTypedChars} total`}
            />
          </ResultBox>
        )}

        {isComplete && !finished && (
          <p style={{ fontSize: ".82rem", color: "var(--muted-2)", marginTop: ".6rem" }}>
            Calculating results...
          </p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
