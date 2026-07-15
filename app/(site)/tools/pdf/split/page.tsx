import type { Metadata } from "next";
import SplitPdfTool from "./SplitPdfTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "split", {
  title: "Split PDF — Free Online Tool — AIVEXA",
  description:
    "Split a PDF by page range or into chunks of N pages, free with no signup. 100% client-side — your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <SplitPdfTool />
      <ToolSeoContent category="pdf" slug="split" />
    </>
  );
}
