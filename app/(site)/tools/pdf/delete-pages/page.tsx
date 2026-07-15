import type { Metadata } from "next";
import DeletePagesTool from "./DeletePagesTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "delete-pages", {
  title: "Delete PDF Pages — Free Online Tool — AIVEXA",
  description:
    "Remove specific pages from a PDF by clicking their thumbnails, free with no signup. Your files never leave your browser.",
});

export default function Page() {
  return (
    <>
      <DeletePagesTool />
      <ToolSeoContent category="pdf" slug="delete-pages" />
    </>
  );
}
