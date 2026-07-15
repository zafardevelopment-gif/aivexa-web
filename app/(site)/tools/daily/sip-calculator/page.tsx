import type { Metadata } from "next";
import SipCalculatorTool from "./SipCalculatorTool";

export const metadata: Metadata = {
  title: "SIP Calculator — Free Online Tool — AIVEXA",
  description:
    "Estimate the future value of your monthly SIP investments with a year-by-year growth table for free, no signup required.",
};

export default function Page() {
  return <SipCalculatorTool />;
}
