import type { Metadata } from "next";
import InheritanceCalculatorTool from "./InheritanceCalculatorTool";

export const metadata: Metadata = {
  title: "Inheritance (Mirath) Calculator — Free Online Tool — AIVEXA",
  description:
    "Estimate Islamic inheritance shares (Faraid) for a standard Sunni Hanafi estate distribution among heirs.",
};

export default function Page() {
  return <InheritanceCalculatorTool />;
}
