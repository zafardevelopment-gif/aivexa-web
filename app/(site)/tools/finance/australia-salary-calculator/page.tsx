import type { Metadata } from "next";
import AustraliaSalaryCalculatorTool from "./AustraliaSalaryCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "australia-salary-calculator", {
  title: "Australia Salary Calculator — Take-Home Pay 2024–25 — AIVEXA",
  description:
    "Calculate your Australian take-home pay after income tax and Medicare levy for 2024–25. Supports annual, monthly, fortnightly and weekly pay.",
});

export default function Page() {
  return (
    <>
      <AustraliaSalaryCalculatorTool />
      <ToolSeoContent category="finance" slug="australia-salary-calculator" />
    </>
  );
}
