import type { Metadata } from "next";
import PageNumbersTool from "./PageNumbersTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "page-numbers-add", {
  title: "Add Page Numbers to PDF — Free Online Tool — AIVEXA",
  description:
    "Stamp page numbers onto a PDF with position and format options, free with no signup. Your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <PageNumbersTool />
      <ToolSeoContent category="pdf" slug="page-numbers-add" />
    </>
  );
}
