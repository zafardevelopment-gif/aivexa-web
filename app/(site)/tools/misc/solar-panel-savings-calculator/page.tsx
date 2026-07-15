import type { Metadata } from "next";
import SolarPanelSavingsCalculatorTool from "./SolarPanelSavingsCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "solar-panel-savings-calculator", {
  title: "Solar Panel Savings Calculator — Free Online Tool — AIVEXA",
  description:
    "Free calculator to estimate rooftop solar panel capacity, installation cost range, monthly savings and payback period for Indian cities.",
});

export default function Page() {
  return (
    <>
      <SolarPanelSavingsCalculatorTool />
      <ToolSeoContent category="misc" slug="solar-panel-savings-calculator" />
    </>
  );
}
