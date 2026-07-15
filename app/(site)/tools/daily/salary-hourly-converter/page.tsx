import type { Metadata } from "next";
import SalaryHourlyConverterTool from "./SalaryHourlyConverterTool";

export const metadata: Metadata = {
  title: "Salary to Hourly Converter — Free Online Tool — AIVEXA",
  description:
    "Convert annual or monthly salary to hourly rate, or hourly rate to salary, for free, no signup required.",
};

export default function Page() {
  return <SalaryHourlyConverterTool />;
}
