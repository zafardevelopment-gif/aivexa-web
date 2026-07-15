import type { Metadata } from "next";
import CollageMakerTool from "./CollageMakerTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "collage-maker", {
  title: "Photo Collage Maker — Free Online Tool — AIVEXA",
  description:
    "Make a photo collage online for free — grid layouts up to 3x3, spacing and background color controls. No signup, no upload — rendered 100% in your browser.",
});

export default function Page() {
  return (
    <>
      <CollageMakerTool />
      <ToolSeoContent category="image" slug="collage-maker" />
    </>
  );
}
