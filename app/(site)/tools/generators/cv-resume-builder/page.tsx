import type { Metadata } from "next";
import CvResumeBuilderTool from "./CvResumeBuilderTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "cv-resume-builder", {
  title: "CV/Resume Builder — Free Online Tool — AIVEXA",
  description:
    "Free online CV & resume builder with ATS-friendly and modern templates. Live preview, PDF download with selectable text, no signup — your data never leaves your browser.",
});

export default function Page() {
  return (
    <>
      <CvResumeBuilderTool />
      <ToolSeoContent category="generators" slug="cv-resume-builder" />
    </>
  );
}
