import type { Metadata } from "next";
import HijriConverterTool from "./HijriConverterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "hijri-converter", {
  title: "Hijri-Gregorian Converter — Free Online Tool — AIVEXA",
  description:
    "Convert dates between the Hijri (Islamic) and Gregorian calendars, both ways, free and instantly.",
});

export default function Page() {
  return (
    <>
      <HijriConverterTool />
      <ToolSeoContent category="islamic" slug="hijri-converter" />
    </>
  );
}
