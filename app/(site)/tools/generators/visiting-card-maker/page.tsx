import type { Metadata } from "next";
import VisitingCardTool from "./VisitingCardTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "visiting-card-maker", {
  title: "Visiting Card Maker — Free Online Tool — AIVEXA",
  description:
    "Design a business visiting card free — 2 layouts, accent color, logo upload, live preview, print-ready A4 PDF with multiple cards and cut margins plus PNG. No signup, fully in-browser.",
});

export default function Page() {
  return (
    <>
      <VisitingCardTool />
      <ToolSeoContent category="generators" slug="visiting-card-maker" />
    </>
  );
}
