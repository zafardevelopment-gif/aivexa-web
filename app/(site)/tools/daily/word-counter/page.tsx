import type { Metadata } from "next";
import WordCounterTool from "./WordCounterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "word-counter", {
  title: "Word Counter — Free Online Tool — AIVEXA",
  description:
    "Count words, characters, sentences, and paragraphs with live reading time estimates, free and no signup required.",
});

export default function Page() {
  return (
    <>
      <WordCounterTool />
      <ToolSeoContent category="daily" slug="word-counter" />
    </>
  );
}
