import type { Metadata } from "next";
import ComparePdfTool from "./ComparePdfTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "compare", {
  title: "Compare PDFs — Free Online Tool — AIVEXA",
  description:
    "See a text diff between two PDF versions with added and removed lines highlighted, free with no signup. Your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <ComparePdfTool />
      <ToolSeoContent category="pdf" slug="compare" />
    </>
  );
}
