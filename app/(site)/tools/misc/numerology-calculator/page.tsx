import type { Metadata } from "next";
import NumerologyCalculatorTool from "./NumerologyCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "numerology-calculator", {
  title: "Numerology Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your free Life Path and Destiny (Expression) number from your name and date of birth using traditional Pythagorean numerology.",
});

export default function Page() {
  return (
    <>
      <NumerologyCalculatorTool />
      <ToolSeoContent category="misc" slug="numerology-calculator" />
    </>
  );
}
