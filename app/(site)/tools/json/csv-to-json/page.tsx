import { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import CsvToJsonTool from "./CsvToJsonTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";

export const metadata: Metadata = buildToolMetadata("json", "csv-to-json", {
  title: "CSV to JSON Converter — Free Online Tool — AIVEXA",
  description:
    "Convert CSV files or pasted text to structured JSON instantly. Free online CSV to JSON converter — no signup, no upload, 100% browser-based.",
});

export default function Page() {
  return (
    <>
      <CsvToJsonTool />
      <ToolSeoContent category="json" slug="csv-to-json" />
    </>
  );
}
