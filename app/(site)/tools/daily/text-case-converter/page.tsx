import type { Metadata } from "next";
import TextCaseConverterTool from "./TextCaseConverterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "text-case-converter", {
  title: "Text Case Converter — Free Online Tool — AIVEXA",
  description:
    "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <TextCaseConverterTool />
      <ToolSeoContent category="daily" slug="text-case-converter" />
    </>
  );
}
