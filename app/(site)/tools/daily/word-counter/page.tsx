import type { Metadata } from "next";
import WordCounterTool from "./WordCounterTool";

export const metadata: Metadata = {
  title: "Word Counter — Free Online Tool — AIVEXA",
  description:
    "Count words, characters, sentences, and paragraphs with live reading time estimates, free and no signup required.",
};

export default function Page() {
  return <WordCounterTool />;
}
