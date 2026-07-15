import type { Metadata } from "next";
import ZakatCalculatorTool from "./ZakatCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "zakat-calculator", {
  title: "Zakat Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate Zakat payable on cash, gold, silver, savings and business assets, with gold/silver Nisab thresholds.",
});

export default function Page() {
  return (
    <>
      <ZakatCalculatorTool />
      <ToolSeoContent category="islamic" slug="zakat-calculator" />
    </>
  );
}
