import type { Metadata } from "next";
import RetirementCalculatorTool from "./RetirementCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "retirement-calculator", {
  title: "Retirement Calculator — Free Online Tool — AIVEXA",
  description:
    "Estimate your retirement corpus and monthly income from savings, monthly contributions and expected investment returns. Free and instant.",
});

export default function Page() {
  return (
    <>
      <RetirementCalculatorTool />
      <ToolSeoContent category="finance" slug="retirement-calculator" />
    </>
  );
}
