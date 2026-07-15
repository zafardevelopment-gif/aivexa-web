import type { Metadata } from "next";
import QrGeneratorTool from "./QrGeneratorTool";

export const metadata: Metadata = {
  title: "QR Code Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a free downloadable QR code from any text or URL with color customization, no signup required.",
};

export default function Page() {
  return <QrGeneratorTool />;
}
