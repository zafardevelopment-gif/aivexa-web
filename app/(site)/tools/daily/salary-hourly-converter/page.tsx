import type { Metadata } from "next";
import SalaryHourlyConverterTool from "./SalaryHourlyConverterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "salary-hourly-converter", {
  title: "Salary to Hourly Converter — Free Online Tool — AIVEXA",
  description:
    "Convert annual or monthly salary to hourly rate, or hourly rate to salary, for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <SalaryHourlyConverterTool />
      <ToolSeoContent category="daily" slug="salary-hourly-converter" />
    </>
  );
}
