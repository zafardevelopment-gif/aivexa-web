import type { Metadata } from "next";
import JsonFormatterTool from "./JsonFormatterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "json-formatter", {
  title: "JSON Formatter — Free Online Tool — AIVEXA",
  description:
    "Format, validate, and beautify JSON instantly with clear error messages, free and no signup required.",
});

export default function Page() {
  return (
    <>
      <JsonFormatterTool />
      <ToolSeoContent category="daily" slug="json-formatter" />
    </>
  );
}
