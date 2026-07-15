import type { Metadata } from "next";
import AgeCalculatorTool from "./AgeCalculatorTool";

export const metadata: Metadata = {
  title: "Age Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your exact age in years, months, and days for free, no signup required.",
};

export default function Page() {
  return <AgeCalculatorTool />;
}
