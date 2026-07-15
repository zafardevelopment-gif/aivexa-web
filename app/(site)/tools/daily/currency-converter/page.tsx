import type { Metadata } from "next";
import CurrencyConverterTool from "./CurrencyConverterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "currency-converter", {
  title: "Currency Converter — Free Online Tool — AIVEXA",
  description:
    "Convert between currencies using your own exchange rate for free, no signup and no external API required.",
});

export default function Page() {
  return (
    <>
      <CurrencyConverterTool />
      <ToolSeoContent category="daily" slug="currency-converter" />
    </>
  );
}
