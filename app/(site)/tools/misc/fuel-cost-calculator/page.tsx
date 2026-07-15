import type { Metadata } from "next";
import FuelCostCalculatorTool from "./FuelCostCalculatorTool";

export const metadata: Metadata = {
  title: "Fuel Cost Calculator — Free Online Tool — AIVEXA",
  description:
    "Free calculator to estimate total fuel needed, trip fuel cost, and per-person cost based on distance, vehicle mileage and fuel price.",
};

export default function Page() {
  return <FuelCostCalculatorTool />;
}
