import type { Metadata } from "next";
import NumerologyCalculatorTool from "./NumerologyCalculatorTool";

export const metadata: Metadata = {
  title: "Numerology Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate your free Life Path and Destiny (Expression) number from your name and date of birth using traditional Pythagorean numerology.",
};

export default function Page() {
  return <NumerologyCalculatorTool />;
}
