import type { Metadata } from "next";
import TipCalculatorTool from "./TipCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "tip-calculator", {
  title: "Tip Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate tip amount, total bill, and per-person split for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <TipCalculatorTool />
      <ToolSeoContent category="daily" slug="tip-calculator" />
    </>
  );
}
