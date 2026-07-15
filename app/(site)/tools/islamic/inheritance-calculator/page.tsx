import type { Metadata } from "next";
import InheritanceCalculatorTool from "./InheritanceCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "inheritance-calculator", {
  title: "Inheritance (Mirath) Calculator — Free Online Tool — AIVEXA",
  description:
    "Estimate Islamic inheritance shares (Faraid) for a standard Sunni Hanafi estate distribution among heirs.",
});

export default function Page() {
  return (
    <>
      <InheritanceCalculatorTool />
      <ToolSeoContent category="islamic" slug="inheritance-calculator" />
    </>
  );
}
