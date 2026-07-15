import type { Metadata } from "next";
import SimpleCompoundInterestTool from "./SimpleCompoundInterestTool";

export const metadata: Metadata = {
  title: "Simple & Compound Interest Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate simple and compound interest on your savings or loans for free, no signup required.",
};

export default function Page() {
  return <SimpleCompoundInterestTool />;
}
