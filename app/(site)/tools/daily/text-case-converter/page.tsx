import type { Metadata } from "next";
import TextCaseConverterTool from "./TextCaseConverterTool";

export const metadata: Metadata = {
  title: "Text Case Converter — Free Online Tool — AIVEXA",
  description:
    "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case for free, no signup required.",
};

export default function Page() {
  return <TextCaseConverterTool />;
}
