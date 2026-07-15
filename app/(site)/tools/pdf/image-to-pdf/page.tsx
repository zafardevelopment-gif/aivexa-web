import type { Metadata } from "next";
import ImageToPdfTool from "./ImageToPdfTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "image-to-pdf", {
  title: "Image to PDF — Free Online Tool — AIVEXA",
  description:
    "Combine JPG and PNG images into a single A4 PDF, free with no signup. 100% client-side — your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <ImageToPdfTool />
      <ToolSeoContent category="pdf" slug="image-to-pdf" />
    </>
  );
}
