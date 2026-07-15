import type { Metadata } from "next";
import PdfToImageTool from "./PdfToImageTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "pdf-to-image", {
  title: "PDF to Image — Free Online Tool — AIVEXA",
  description:
    "Convert PDF pages to JPG or PNG images free, no signup needed. 100% client-side — your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <PdfToImageTool />
      <ToolSeoContent category="pdf" slug="pdf-to-image" />
    </>
  );
}
