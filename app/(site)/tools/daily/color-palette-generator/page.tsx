import type { Metadata } from "next";
import ColorPaletteGeneratorTool from "./ColorPaletteGeneratorTool";

export const metadata: Metadata = {
  title: "Color Palette Generator — Free Online Tool — AIVEXA",
  description:
    "Generate complementary, analogous, and triadic color palettes from any hex color for free, no signup required.",
};

export default function Page() {
  return <ColorPaletteGeneratorTool />;
}
