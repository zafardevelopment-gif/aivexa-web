import type { Metadata } from "next";
import LoanComparisonTool from "./LoanComparisonTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "loan-comparison", {
  title: "Loan Comparison Calculator — Free Online Tool — AIVEXA",
  description:
    "Compare EMI, total interest, and total payment across two or three loans side by side for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <LoanComparisonTool />
      <ToolSeoContent category="daily" slug="loan-comparison" />
    </>
  );
}
