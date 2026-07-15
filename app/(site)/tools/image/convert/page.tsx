import type { Metadata } from "next";
import ConvertTool from "./ConvertTool";

export const metadata: Metadata = {
  title: "Image Format Converter — Free Online Tool — AIVEXA",
  description:
    "Convert images between JPG, PNG and WebP online for free. No signup, no upload — conversion runs 100% in your browser for complete privacy.",
};

export default function Page() {
  return <ConvertTool />;
}
