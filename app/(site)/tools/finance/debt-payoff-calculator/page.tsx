import type { Metadata } from "next";
import DebtPayoffCalculatorTool from "./DebtPayoffCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "debt-payoff-calculator", {
  title: "Debt Payoff Calculator — Avalanche vs Snowball — AIVEXA",
  description:
    "Calculate how fast you can pay off multiple debts using the avalanche (lowest interest first) or snowball (lowest balance first) method.",
});

export default function Page() {
  return (
    <>
      <DebtPayoffCalculatorTool />
      <ToolSeoContent category="finance" slug="debt-payoff-calculator" />
    </>
  );
}
