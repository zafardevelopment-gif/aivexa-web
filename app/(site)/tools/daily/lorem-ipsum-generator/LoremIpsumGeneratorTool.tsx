"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, TextArea, TabGroup, CopyButton } from "@/components/tools/ToolUI";

type Mode = "words" | "paragraphs";

const WORD_POOL = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
];

function randomWord(): string {
  return WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSentence(): string {
  const wordCount = randomInt(8, 16);
  const words = Array.from({ length: wordCount }, () => randomWord());
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function generateWords(count: number): string {
  if (count <= 0) return "";
  const opening = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const openingWords = opening.replace(".", "").replace(",", "").split(" ");
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i < openingWords.length) {
      words.push(openingWords[i]);
    } else {
      words.push(randomWord());
    }
  }
  return words.join(" ") + ".";
}

function generateParagraphs(count: number): string {
  if (count <= 0) return "";
  const paragraphs: string[] = [];
  for (let p = 0; p < count; p++) {
    const sentenceCount = randomInt(4, 7);
    const sentences: string[] = [];
    for (let s = 0; s < sentenceCount; s++) {
      if (p === 0 && s === 0) {
        sentences.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
      } else {
        sentences.push(generateSentence());
      }
    }
    paragraphs.push(sentences.join(" "));
  }
  return paragraphs.join("\n\n");
}

export default function LoremIpsumGeneratorTool() {
  const [mode, setMode] = useState<Mode>("words");
  const [count, setCount] = useState("50");
  const [output, setOutput] = useState("");

  function handleGenerate() {
    const n = Number(count);
    const safeCount = Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), 500) : mode === "words" ? 50 : 3;
    if (mode === "words") {
      setOutput(generateWords(safeCount));
    } else {
      setOutput(generateParagraphs(safeCount));
    }
  }

  return (
    <ToolPageLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder Lorem Ipsum text by word count or paragraph count for free, instantly."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <TabGroup
          options={[
            { value: "words", label: "Words" },
            { value: "paragraphs", label: "Paragraphs" },
          ]}
          value={mode}
          onChange={(v) => {
            setMode(v as Mode);
            setCount(v === "words" ? "50" : "3");
          }}
        />

        <Field label={mode === "words" ? "Number of words" : "Number of paragraphs"}>
          <TextInput
            type="number"
            inputMode="numeric"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </Field>

        <button type="button" className="btn-primary" onClick={handleGenerate}>
          Generate
        </button>

        {output && (
          <div style={{ marginTop: "1.5rem" }}>
            <TextArea value={output} readOnly rows={10} style={{ fontFamily: "monospace" }} />
            <div style={{ marginTop: ".75rem" }}>
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </Card>
    </ToolPageLayout>
  );
}
