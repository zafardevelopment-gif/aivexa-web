import type { Metadata } from "next";
import EmiCalculatorTool from "./EmiCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "emi-calculator", {
  title: "EMI Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your monthly loan EMI, total interest, and full amortization schedule for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <EmiCalculatorTool />
      <ToolSeoContent category="daily" slug="emi-calculator" />
    </>
  );
}
