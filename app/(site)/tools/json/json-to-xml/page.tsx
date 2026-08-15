import { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import JsonToXmlTool from "./JsonToXmlTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";

export const metadata: Metadata = buildToolMetadata("json", "json-to-xml", {
  title: "JSON to XML Converter — Free Online Tool — AIVEXA",
  description:
    "Transform JSON objects to valid XML format instantly. Free online JSON to XML converter — browser-based, no signup, no file upload required.",
});

export default function Page() {
  return (
    <>
      <JsonToXmlTool />
      <ToolSeoContent category="json" slug="json-to-xml" />
    </>
  );
}
