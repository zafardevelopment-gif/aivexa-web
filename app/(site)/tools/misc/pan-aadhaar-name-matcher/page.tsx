import type { Metadata } from "next";
import PanAadhaarNameMatcherTool from "./PanAadhaarNameMatcherTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "pan-aadhaar-name-matcher", {
  title: "PAN Aadhaar Name Matcher — Name Mismatch Checker — AIVEXA",
  description:
    "Free PAN-Aadhaar name mismatch checker. Compare names on two documents, get a similarity score and correction suggestions. Runs fully in your browser — nothing uploaded.",
});

export default function Page() {
  return (
    <>
      <PanAadhaarNameMatcherTool />
      <ToolSeoContent category="misc" slug="pan-aadhaar-name-matcher" />
    </>
  );
}
