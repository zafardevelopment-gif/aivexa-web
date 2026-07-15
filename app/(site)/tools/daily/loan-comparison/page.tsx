import type { Metadata } from "next";
import LoanComparisonTool from "./LoanComparisonTool";

export const metadata: Metadata = {
  title: "Loan Comparison Calculator — Free Online Tool — AIVEXA",
  description:
    "Compare EMI, total interest, and total payment across two or three loans side by side for free, no signup required.",
};

export default function Page() {
  return <LoanComparisonTool />;
}
