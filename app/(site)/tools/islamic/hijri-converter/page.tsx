import type { Metadata } from "next";
import HijriConverterTool from "./HijriConverterTool";

export const metadata: Metadata = {
  title: "Hijri-Gregorian Converter — Free Online Tool — AIVEXA",
  description:
    "Convert dates between the Hijri (Islamic) and Gregorian calendars, both ways, free and instantly.",
};

export default function Page() {
  return <HijriConverterTool />;
}
