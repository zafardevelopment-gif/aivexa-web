import type { Metadata } from "next";
import UkSalaryCalculatorTool from "./UkSalaryCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "uk-salary-calculator", {
  title: "UK Salary Calculator — Take-Home Pay 2024/25 — AIVEXA",
  description:
    "Calculate your UK take-home pay after income tax and National Insurance for 2024/25. See monthly and annual net salary instantly.",
});

export default function Page() {
  return (
    <>
      <UkSalaryCalculatorTool />
      <ToolSeoContent category="finance" slug="uk-salary-calculator" />
    </>
  );
}
