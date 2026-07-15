import type { Metadata } from "next";
import UnitConverterTool from "./UnitConverterTool";

export const metadata: Metadata = {
  title: "Unit Converter — Free Online Tool — AIVEXA",
  description:
    "Convert length, weight, temperature, and volume units instantly for free, no signup required.",
};

export default function Page() {
  return <UnitConverterTool />;
}
