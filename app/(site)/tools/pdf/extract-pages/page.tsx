import type { Metadata } from "next";
import ExtractPagesTool from "./ExtractPagesTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "extract-pages", {
  title: "Extract PDF Pages — Free Online Tool — AIVEXA",
  description:
    "Pull specific pages or ranges out of a PDF into a new file, free with no signup. Your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <ExtractPagesTool />
      <ToolSeoContent category="pdf" slug="extract-pages" />
    </>
  );
}
