import { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import JsonToCsvTool from "./JsonToCsvTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";

export const metadata: Metadata = buildToolMetadata("json", "json-to-csv", {
  title: "JSON to CSV Converter — Free Online Tool — AIVEXA",
  description:
    "Convert JSON arrays to CSV format instantly. Free online JSON to CSV converter — download or copy output. No signup, no upload, 100% browser-based.",
});

export default function Page() {
  return (
    <>
      <JsonToCsvTool />
      <ToolSeoContent category="json" slug="json-to-csv" />
    </>
  );
}
