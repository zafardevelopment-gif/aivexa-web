import type { Metadata } from "next";
import BarcodeGeneratorTool from "./BarcodeGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "barcode-generator", {
  title: "Barcode Generator — Free Online Tool — AIVEXA",
  description:
    "Generate free downloadable CODE128 and EAN-13 barcodes from text or numbers, no signup required.",
});

export default function Page() {
  return (
    <>
      <BarcodeGeneratorTool />
      <ToolSeoContent category="daily" slug="barcode-generator" />
    </>
  );
}
