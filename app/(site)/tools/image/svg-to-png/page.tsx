import type { Metadata } from "next";
import SvgToPngTool from "./SvgToPngTool";

export const metadata: Metadata = {
  title: "SVG to PNG Converter — Free Online Tool — AIVEXA",
  description:
    "Convert SVG files or pasted SVG markup to PNG at any resolution online for free. Handles viewBox-only SVGs. No signup, no upload — 100% browser-based.",
};

export default function Page() {
  return <SvgToPngTool />;
}
