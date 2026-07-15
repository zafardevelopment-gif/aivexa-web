import type { Metadata } from "next";
import TypingSpeedTestTool from "./TypingSpeedTestTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "typing-speed-test", {
  title: "Typing Speed Test — Free Online Tool — AIVEXA",
  description:
    "Free online typing speed test to measure your words per minute (WPM) and typing accuracy with live character highlighting.",
});

export default function Page() {
  return (
    <>
      <TypingSpeedTestTool />
      <ToolSeoContent category="misc" slug="typing-speed-test" />
    </>
  );
}
