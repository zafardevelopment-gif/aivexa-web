import type { Metadata } from "next";
import PercentageCalculatorTool from "./PercentageCalculatorTool";

export const metadata: Metadata = {
  title: "Percentage Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate percentages, percentage change, and percentage of a value for free, no signup required.",
};

export default function Page() {
  return <PercentageCalculatorTool />;
}
