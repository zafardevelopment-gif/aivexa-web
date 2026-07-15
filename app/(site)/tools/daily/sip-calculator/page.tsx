import type { Metadata } from "next";
import SipCalculatorTool from "./SipCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "sip-calculator", {
  title: "SIP Calculator — Free Online Tool — AIVEXA",
  description:
    "Estimate the future value of your monthly SIP investments with a year-by-year growth table for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <SipCalculatorTool />
      <ToolSeoContent category="daily" slug="sip-calculator" />
    </>
  );
}
