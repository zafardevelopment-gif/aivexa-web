import type { Metadata } from "next";
import FuelCostCalculatorTool from "./FuelCostCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "fuel-cost-calculator", {
  title: "Fuel Cost Calculator — Free Online Tool — AIVEXA",
  description:
    "Free calculator to estimate total fuel needed, trip fuel cost, and per-person cost based on distance, vehicle mileage and fuel price.",
});

export default function Page() {
  return (
    <>
      <FuelCostCalculatorTool />
      <ToolSeoContent category="misc" slug="fuel-cost-calculator" />
    </>
  );
}
