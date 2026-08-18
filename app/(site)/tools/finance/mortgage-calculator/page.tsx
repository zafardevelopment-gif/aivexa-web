import type { Metadata } from "next";
import MortgageCalculatorTool from "./MortgageCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "mortgage-calculator", {
  title: "Mortgage Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your monthly mortgage payment, total interest and full amortization schedule. Works for US, UK, Canada and Australia home loans.",
});

export default function Page() {
  return (
    <>
      <MortgageCalculatorTool />
      <ToolSeoContent category="finance" slug="mortgage-calculator" />
    </>
  );
}
