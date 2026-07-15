import type { Metadata } from "next";
import LetterheadTool from "./LetterheadTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "letterhead-maker", {
  title: "Letterhead Maker — Free Online Tool — AIVEXA",
  description:
    "Create a professional company letterhead free — logo, tagline, contact details, accent color, two header layouts, A4 live preview and reusable blank PDF download. Fully in-browser.",
});

export default function Page() {
  return (
    <>
      <LetterheadTool />
      <ToolSeoContent category="generators" slug="letterhead-maker" />
    </>
  );
}
