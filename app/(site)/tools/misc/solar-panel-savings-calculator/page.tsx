import type { Metadata } from "next";
import SolarPanelSavingsCalculatorTool from "./SolarPanelSavingsCalculatorTool";

export const metadata: Metadata = {
  title: "Solar Panel Savings Calculator — Free Online Tool — AIVEXA",
  description:
    "Free calculator to estimate rooftop solar panel capacity, installation cost range, monthly savings and payback period for Indian cities.",
};

export default function Page() {
  return <SolarPanelSavingsCalculatorTool />;
}
