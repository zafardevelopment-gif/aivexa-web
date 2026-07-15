import type { Metadata } from "next";
import DistanceCalculatorTool from "./DistanceCalculatorTool";

export const metadata: Metadata = {
  title: "Distance Calculator — Free Online Tool — AIVEXA",
  description:
    "Free tool to calculate the approximate straight-line and road distance in km between two major Indian cities.",
};

export default function Page() {
  return <DistanceCalculatorTool />;
}
