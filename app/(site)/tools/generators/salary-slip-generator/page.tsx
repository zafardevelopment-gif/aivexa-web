import type { Metadata } from "next";
import SalarySlipTool from "./SalarySlipTool";

export const metadata: Metadata = {
  title: "Salary Slip Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a professional salary slip (payslip) PDF for free — earnings and deductions breakdown, automatic net pay, amount in words (lakh/crore), no signup, fully in-browser.",
};

export default function Page() {
  return <SalarySlipTool />;
}
