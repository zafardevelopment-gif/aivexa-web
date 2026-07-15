import type { Metadata } from "next";
import CurrencyConverterTool from "./CurrencyConverterTool";

export const metadata: Metadata = {
  title: "Currency Converter — Free Online Tool — AIVEXA",
  description:
    "Convert between currencies using your own exchange rate for free, no signup and no external API required.",
};

export default function Page() {
  return <CurrencyConverterTool />;
}
