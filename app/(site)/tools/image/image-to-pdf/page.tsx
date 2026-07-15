import type { Metadata } from "next";
import ImageToPdfTool from "./ImageToPdfTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "image-to-pdf", {
  title: "Image to PDF Converter — Free Online Tool — AIVEXA",
  description:
    "Convert JPG and PNG images to a single A4 PDF online for free — reorder pages, fit-to-page layout. No signup, no upload — the PDF is built 100% in your browser.",
});

export default function Page() {
  return (
    <>
      <ImageToPdfTool />
      <ToolSeoContent category="image" slug="image-to-pdf" />
    </>
  );
}
