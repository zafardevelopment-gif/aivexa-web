import type { Metadata } from "next";
import ColorPaletteGeneratorTool from "./ColorPaletteGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "color-palette-generator", {
  title: "Color Palette Generator — Free Online Tool — AIVEXA",
  description:
    "Generate complementary, analogous, and triadic color palettes from any hex color for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <ColorPaletteGeneratorTool />
      <ToolSeoContent category="daily" slug="color-palette-generator" />
    </>
  );
}
