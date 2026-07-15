import type { Metadata } from "next";
import RotatePdfTool from "./RotatePdfTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "rotate", {
  title: "Rotate PDF — Free Online Tool — AIVEXA",
  description:
    "Rotate all or selected PDF pages by 90, 180 or 270 degrees, free with no signup. Your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <RotatePdfTool />
      <ToolSeoContent category="pdf" slug="rotate" />
    </>
  );
}
