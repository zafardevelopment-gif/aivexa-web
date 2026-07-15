import type { Metadata } from "next";
import TimeZoneConverterTool from "./TimeZoneConverterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "time-zone-converter", {
  title: "Time Zone Converter — Free Online Tool — AIVEXA",
  description:
    "Convert date and time between time zones instantly for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <TimeZoneConverterTool />
      <ToolSeoContent category="daily" slug="time-zone-converter" />
    </>
  );
}
