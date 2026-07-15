import type { Metadata } from "next";
import EmiCalculatorTool from "./EmiCalculatorTool";

export const metadata: Metadata = {
  title: "EMI Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your monthly loan EMI, total interest, and full amortization schedule for free, no signup required.",
};

export default function Page() {
  return <EmiCalculatorTool />;
}
