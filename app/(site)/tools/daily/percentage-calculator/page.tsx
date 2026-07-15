import type { Metadata } from "next";
import PercentageCalculatorTool from "./PercentageCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "percentage-calculator", {
  title: "Percentage Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate percentages, percentage change, and percentage of a value for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <PercentageCalculatorTool />
      <ToolSeoContent category="daily" slug="percentage-calculator" />
    </>
  );
}
