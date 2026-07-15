import type { Metadata } from "next";
import AadhaarMaskingTool from "./AadhaarMaskingTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "aadhaar-masking-tool", {
  title: "Aadhaar Masking Tool — Free Online Tool — AIVEXA",
  description:
    "Mask the first 8 digits of an Aadhaar card image entirely in your browser for safe KYC sharing — free, no signup, and your image never leaves your device.",
});

export default function Page() {
  return (
    <>
      <AadhaarMaskingTool />
      <ToolSeoContent category="misc" slug="aadhaar-masking-tool" />
    </>
  );
}
