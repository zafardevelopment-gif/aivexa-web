import type { Metadata } from "next";
import WatermarkTool from "./WatermarkTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "watermark", {
  title: "Add Watermark to Image — Free Online Tool — AIVEXA",
  description:
    "Add a text watermark to photos online for free — custom text, size, opacity and position (center, corners, tiled). No signup, no upload — 100% browser-based.",
});

export default function Page() {
  return (
    <>
      <WatermarkTool />
      <ToolSeoContent category="image" slug="watermark" />
    </>
  );
}
