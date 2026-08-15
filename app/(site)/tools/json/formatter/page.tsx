import { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo";
import JsonFormatterTool from "./JsonFormatterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";

export const metadata: Metadata = buildToolMetadata("json", "formatter", {
  title: "JSON Formatter & Validator — Free Online Tool — AIVEXA",
  description:
    "Beautify or minify JSON instantly in your browser. Free JSON formatter and validator with error highlighting — no signup, no file upload required.",
});

export default function Page() {
  return (
    <>
      <JsonFormatterTool />
      <ToolSeoContent category="json" slug="formatter" />
    </>
  );
}
