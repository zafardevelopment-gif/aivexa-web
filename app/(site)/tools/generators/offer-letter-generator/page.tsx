import type { Metadata } from "next";
import OfferLetterTool from "./OfferLetterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "offer-letter-generator", {
  title: "Offer Letter Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a formal employee offer letter in seconds — role, CTC, joining date, probation and more. Editable text, instant PDF, free, no signup, fully in-browser.",
});

export default function Page() {
  return (
    <>
      <OfferLetterTool />
      <ToolSeoContent category="generators" slug="offer-letter-generator" />
    </>
  );
}
