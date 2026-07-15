import type { Metadata } from "next";
import DistanceCalculatorTool from "./DistanceCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "distance-calculator", {
  title: "Distance Calculator — Free Online Tool — AIVEXA",
  description:
    "Free tool to calculate the approximate straight-line and road distance in km between two major Indian cities.",
});

export default function Page() {
  return (
    <>
      <DistanceCalculatorTool />
      <ToolSeoContent category="misc" slug="distance-calculator" />
    </>
  );
}
