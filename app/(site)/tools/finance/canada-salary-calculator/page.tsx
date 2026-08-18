import type { Metadata } from "next";
import CanadaSalaryCalculatorTool from "./CanadaSalaryCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "canada-salary-calculator", {
  title: "Canada Salary Calculator — Take-Home Pay 2024 — AIVEXA",
  description:
    "Calculate your Canadian take-home pay after federal and provincial income tax, CPP and EI deductions for 2024.",
});

export default function Page() {
  return (
    <>
      <CanadaSalaryCalculatorTool />
      <ToolSeoContent category="finance" slug="canada-salary-calculator" />
    </>
  );
}
