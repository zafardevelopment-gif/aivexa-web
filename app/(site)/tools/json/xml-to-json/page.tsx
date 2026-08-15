import { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import XmlToJsonTool from "./XmlToJsonTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";

export const metadata: Metadata = buildToolMetadata("json", "xml-to-json", {
  title: "XML to JSON Converter — Free Online Tool — AIVEXA",
  description:
    "Parse XML and convert to clean JSON instantly. Free online XML to JSON converter — no signup, no file upload, 100% browser-based.",
});

export default function Page() {
  return (
    <>
      <XmlToJsonTool />
      <ToolSeoContent category="json" slug="xml-to-json" />
    </>
  );
}
