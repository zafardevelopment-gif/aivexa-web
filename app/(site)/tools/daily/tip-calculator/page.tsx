import type { Metadata } from "next";
import TipCalculatorTool from "./TipCalculatorTool";

export const metadata: Metadata = {
  title: "Tip Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate tip amount, total bill, and per-person split for free, no signup required.",
};

export default function Page() {
  return <TipCalculatorTool />;
}
