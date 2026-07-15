import type { Metadata } from "next";
import BarcodeGeneratorTool from "./BarcodeGeneratorTool";

export const metadata: Metadata = {
  title: "Barcode Generator — Free Online Tool — AIVEXA",
  description:
    "Generate free downloadable CODE128 and EAN-13 barcodes from text or numbers, no signup required.",
};

export default function Page() {
  return <BarcodeGeneratorTool />;
}
