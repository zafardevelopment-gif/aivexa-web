import type { Metadata } from "next";
import BmiCalculatorTool from "./BmiCalculatorTool";

export const metadata: Metadata = {
  title: "BMI Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your Body Mass Index (BMI) in metric or imperial units for free, no signup required.",
};

export default function Page() {
  return <BmiCalculatorTool />;
}
