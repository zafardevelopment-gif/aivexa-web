import type { Metadata } from "next";
import ColorPickerTool from "./ColorPickerTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "color-picker", {
  title: "Image Color Picker — Free Online Tool — AIVEXA",
  description:
    "Pick any pixel color from an image online for free — get HEX, RGB and HSL values with copy buttons and a swatch history. 100% browser-based, no upload, no signup.",
});

export default function Page() {
  return (
    <>
      <ColorPickerTool />
      <ToolSeoContent category="image" slug="color-picker" />
    </>
  );
}
