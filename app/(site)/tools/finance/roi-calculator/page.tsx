import type { Metadata } from "next";
import RoiCalculatorTool from "./RoiCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "roi-calculator", {
  title: "ROI Calculator — Return on Investment — AIVEXA",
  description:
    "Calculate return on investment (ROI), net profit, annualised ROI and payback period for any investment. Free, instant, no signup.",
});

export default function Page() {
  return (
    <>
      <RoiCalculatorTool />
      <ToolSeoContent category="finance" slug="roi-calculator" />
    </>
  );
}
