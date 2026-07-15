import type { Metadata } from "next";
import CompressPdfTool from "./CompressPdfTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "compress", {
  title: "Compress PDF — Free Online Tool — AIVEXA",
  description:
    "Reduce PDF file size free with no signup — lossless clean-up or aggressive image recompression. Your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <CompressPdfTool />
      <ToolSeoContent category="pdf" slug="compress" />
    </>
  );
}
