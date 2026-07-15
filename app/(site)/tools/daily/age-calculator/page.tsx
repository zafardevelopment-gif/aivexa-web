import type { Metadata } from "next";
import AgeCalculatorTool from "./AgeCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "age-calculator", {
  title: "Age Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your exact age in years, months, and days for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <AgeCalculatorTool />
      <ToolSeoContent category="daily" slug="age-calculator" />
    </>
  );
}
