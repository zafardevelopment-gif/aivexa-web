import type { Metadata } from "next";
import DateDifferenceCalculatorTool from "./DateDifferenceCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "date-difference-calculator", {
  title: "Date Difference Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate the exact number of days, weeks, months, and years between two dates for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <DateDifferenceCalculatorTool />
      <ToolSeoContent category="daily" slug="date-difference-calculator" />
    </>
  );
}
