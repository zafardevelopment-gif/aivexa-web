import type { Metadata } from "next";
import UsSalaryCalculatorTool from "./UsSalaryCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "us-salary-calculator", {
  title: "US Salary Calculator — Take-Home Pay — AIVEXA",
  description:
    "Calculate your US take-home pay after federal income tax, Social Security, Medicare and state tax. Supports all 50 states for 2024–2025.",
});

export default function Page() {
  return (
    <>
      <UsSalaryCalculatorTool />
      <ToolSeoContent category="finance" slug="us-salary-calculator" />
    </>
  );
}
