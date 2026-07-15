import type { Metadata } from "next";
import SimpleCompoundInterestTool from "./SimpleCompoundInterestTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "simple-compound-interest", {
  title: "Simple & Compound Interest Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate simple and compound interest on your savings or loans for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <SimpleCompoundInterestTool />
      <ToolSeoContent category="daily" slug="simple-compound-interest" />
    </>
  );
}
