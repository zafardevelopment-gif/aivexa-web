"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextArea, ResultBox, ResultRow } from "@/components/tools/ToolUI";

export default function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() === "" ? [] : text.trim().split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, "").length;
    const sentenceCount = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0).length;
    const paragraphCount = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 0).length;
    const readingMinutes = wordCount / 200;
    const readingTime = wordCount === 0 ? "0 min read" : readingMinutes < 1 ? "< 1 min read" : `${Math.ceil(readingMinutes)} min read`;

    return { wordCount, charCount, charCountNoSpaces, sentenceCount, paragraphCount, readingTime };
  }, [text]);

  return (
    <ToolPageLayout
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs with live reading time, free and instant."
      categoryHref="/tools/daily"
      categoryName="Daily Use Tools"
    >
      <Card>
        <Field label="Your text">
          <TextArea
            placeholder="Start typing or paste your text here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
          />
        </Field>

        <ResultBox>
          <ResultRow label="Words" value={stats.wordCount.toLocaleString()} />
          <ResultRow label="Characters (with spaces)" value={stats.charCount.toLocaleString()} />
          <ResultRow label="Characters (no spaces)" value={stats.charCountNoSpaces.toLocaleString()} />
          <ResultRow label="Sentences" value={stats.sentenceCount.toLocaleString()} />
          <ResultRow label="Paragraphs" value={stats.paragraphCount.toLocaleString()} />
          <ResultRow label="Estimated reading time" value={stats.readingTime} />
        </ResultBox>
      </Card>
    </ToolPageLayout>
  );
}
