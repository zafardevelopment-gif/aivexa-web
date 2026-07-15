import type { Metadata } from "next";
import GstCalculatorTool from "./GstCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "gst-calculator", {
  title: "GST Calculator — Free Online Tool — AIVEXA",
  description:
    "Add or remove GST from any amount and instantly see the CGST, SGST, and total GST breakdown for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <GstCalculatorTool />
      <ToolSeoContent category="daily" slug="gst-calculator" />
    </>
  );
}
