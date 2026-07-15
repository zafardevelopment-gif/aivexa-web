import type { Metadata } from "next";
import ReorderPagesTool from "./ReorderPagesTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "reorder-pages", {
  title: "Reorder PDF Pages — Free Online Tool — AIVEXA",
  description:
    "Drag and drop PDF page thumbnails to rearrange them, free with no signup. Your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <ReorderPagesTool />
      <ToolSeoContent category="pdf" slug="reorder-pages" />
    </>
  );
}
