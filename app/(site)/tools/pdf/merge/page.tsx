import type { Metadata } from "next";
import MergePdfTool from "./MergePdfTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "merge", {
  title: "Merge PDF — Free Online Tool — AIVEXA",
  description:
    "Combine multiple PDF files into one, free and with no signup. 100% client-side — your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <MergePdfTool />
      <ToolSeoContent category="pdf" slug="merge" />
    </>
  );
}
