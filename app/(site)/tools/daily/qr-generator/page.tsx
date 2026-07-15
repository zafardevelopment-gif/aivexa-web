import type { Metadata } from "next";
import QrGeneratorTool from "./QrGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "qr-generator", {
  title: "QR Code Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a free downloadable QR code from any text or URL with color customization, no signup required.",
});

export default function Page() {
  return (
    <>
      <QrGeneratorTool />
      <ToolSeoContent category="daily" slug="qr-generator" />
    </>
  );
}
