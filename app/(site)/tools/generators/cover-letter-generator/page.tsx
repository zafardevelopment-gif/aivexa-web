import type { Metadata } from "next";
import CoverLetterTool from "./CoverLetterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "cover-letter-generator", {
  title: "Cover Letter Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a professional, editable cover letter for any job in seconds — formal or friendly tone, PDF download, free, no signup, your data never leaves your browser.",
});

export default function Page() {
  return (
    <>
      <CoverLetterTool />
      <ToolSeoContent category="generators" slug="cover-letter-generator" />
    </>
  );
}
