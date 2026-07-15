import type { Metadata } from "next";
import PropertyLandDistributionTool from "./PropertyLandDistributionTool";

export const metadata: Metadata = {
  title: "Property/Land Distribution — Free Online Tool — AIVEXA",
  description:
    "Divide property value or land area among heirs per Islamic Faraid rules, with Katha/Bigha/Acre/sqft/sqm support.",
};

export default function Page() {
  return <PropertyLandDistributionTool />;
}
