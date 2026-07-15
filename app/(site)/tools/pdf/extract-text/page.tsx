import type { Metadata } from "next";
import ExtractTextTool from "./ExtractTextTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "extract-text", {
  title: "Extract Text from PDF — Free Online Tool — AIVEXA",
  description:
    "Pull all text content out of a PDF, copy it or download as .txt — free, no signup, and your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <ExtractTextTool />
      <ToolSeoContent category="pdf" slug="extract-text" />
    </>
  );
}
