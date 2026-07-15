import type { Metadata } from "next";
import PropertyLandDistributionTool from "./PropertyLandDistributionTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "property-land-distribution", {
  title: "Property/Land Distribution — Free Online Tool — AIVEXA",
  description:
    "Divide property value or land area among heirs per Islamic Faraid rules, with Katha/Bigha/Acre/sqft/sqm support.",
});

export default function Page() {
  return (
    <>
      <PropertyLandDistributionTool />
      <ToolSeoContent category="islamic" slug="property-land-distribution" />
    </>
  );
}
