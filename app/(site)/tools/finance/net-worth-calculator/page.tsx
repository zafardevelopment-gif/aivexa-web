import type { Metadata } from "next";
import NetWorthCalculatorTool from "./NetWorthCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("finance", "net-worth-calculator", {
  title: "Net Worth Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your personal net worth by adding up your assets and subtracting your liabilities. Free, private, browser-based.",
});

export default function Page() {
  return (
    <>
      <NetWorthCalculatorTool />
      <ToolSeoContent category="finance" slug="net-worth-calculator" />
    </>
  );
}
