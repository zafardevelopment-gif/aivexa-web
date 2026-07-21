import type { Metadata } from "next";
import SalaryStructureOptimizerTool from "./SalaryStructureOptimizerTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "salary-structure-optimizer", {
  title: "Salary Structure Optimizer — CTC Breakup & Tax Regime Comparison — AIVEXA",
  description:
    "Free CTC to in-hand salary calculator. Get full salary breakup — Basic, HRA, PF, gratuity — with old vs new tax regime comparison for FY 2025-26. No signup.",
});

export default function Page() {
  return (
    <>
      <SalaryStructureOptimizerTool />
      <ToolSeoContent category="daily" slug="salary-structure-optimizer" />
    </>
  );
}
