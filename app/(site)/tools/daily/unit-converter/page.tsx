import type { Metadata } from "next";
import UnitConverterTool from "./UnitConverterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "unit-converter", {
  title: "Unit Converter — Free Online Tool — AIVEXA",
  description:
    "Convert length, weight, temperature, and volume units instantly for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <UnitConverterTool />
      <ToolSeoContent category="daily" slug="unit-converter" />
    </>
  );
}
