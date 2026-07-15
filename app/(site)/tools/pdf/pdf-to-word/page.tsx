import type { Metadata } from "next";
import PdfToWordTool from "./PdfToWordTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "pdf-to-word", {
  title: "PDF to Word — Free Online Tool — AIVEXA",
  description:
    "Convert PDF text content into an editable Word .docx file, free with no signup. Your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <PdfToWordTool />
      <ToolSeoContent category="pdf" slug="pdf-to-word" />
    </>
  );
}
