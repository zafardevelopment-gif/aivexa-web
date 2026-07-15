import type { Metadata } from "next";
import TimeZoneConverterTool from "./TimeZoneConverterTool";

export const metadata: Metadata = {
  title: "Time Zone Converter — Free Online Tool — AIVEXA",
  description:
    "Convert date and time between time zones instantly for free, no signup required.",
};

export default function Page() {
  return <TimeZoneConverterTool />;
}
