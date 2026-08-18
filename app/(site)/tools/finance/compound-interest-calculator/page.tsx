import type { Metadata } from "next";
import CompoundInterestCalculatorTool from "./CompoundInterestCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "compound-interest-calculator", {
  title: "Compound Interest Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate compound interest with daily, monthly or annual compounding. See future value, total interest earned and year-by-year growth.",
});

export default function Page() {
  return (
    <>
      <CompoundInterestCalculatorTool />
      <ToolSeoContent category="finance" slug="compound-interest-calculator" />
    </>
  );
}
