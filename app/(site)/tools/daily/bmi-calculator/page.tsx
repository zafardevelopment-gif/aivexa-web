import type { Metadata } from "next";
import BmiCalculatorTool from "./BmiCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "bmi-calculator", {
  title: "BMI Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your Body Mass Index (BMI) in metric or imperial units for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <BmiCalculatorTool />
      <ToolSeoContent category="daily" slug="bmi-calculator" />
    </>
  );
}
