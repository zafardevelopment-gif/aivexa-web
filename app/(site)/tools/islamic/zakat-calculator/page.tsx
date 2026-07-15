import type { Metadata } from "next";
import ZakatCalculatorTool from "./ZakatCalculatorTool";

export const metadata: Metadata = {
  title: "Zakat Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate Zakat payable on cash, gold, silver, savings and business assets, with gold/silver Nisab thresholds.",
};

export default function Page() {
  return <ZakatCalculatorTool />;
}
