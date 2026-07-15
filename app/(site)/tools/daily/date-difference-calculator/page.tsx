import type { Metadata } from "next";
import DateDifferenceCalculatorTool from "./DateDifferenceCalculatorTool";

export const metadata: Metadata = {
  title: "Date Difference Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate the exact number of days, weeks, months, and years between two dates for free, no signup required.",
};

export default function Page() {
  return <DateDifferenceCalculatorTool />;
}
