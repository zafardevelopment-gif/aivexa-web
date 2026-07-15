import type { Metadata } from "next";
import ConvertTool from "./ConvertTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "convert", {
  title: "Image Format Converter — Free Online Tool — AIVEXA",
  description:
    "Convert images between JPG, PNG and WebP online for free. No signup, no upload — conversion runs 100% in your browser for complete privacy.",
});

export default function Page() {
  return (
    <>
      <ConvertTool />
      <ToolSeoContent category="image" slug="convert" />
    </>
  );
}
