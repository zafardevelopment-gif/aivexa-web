import type { Metadata } from "next";
import RentalRoiCalculatorTool from "./RentalRoiCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "rental-roi-calculator", {
  title: "Rental ROI Calculator — Rental Yield & Payback Period — AIVEXA",
  description:
    "Free rental property ROI calculator for India. Get gross yield, net yield, total ROI with appreciation and payback period from purchase price and monthly rent. No signup.",
});

export default function Page() {
  return (
    <>
      <RentalRoiCalculatorTool />
      <ToolSeoContent category="misc" slug="rental-roi-calculator" />
    </>
  );
}
