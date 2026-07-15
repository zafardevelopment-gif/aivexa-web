import type { Metadata } from "next";
import RotateFlipTool from "./RotateFlipTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "rotate-flip", {
  title: "Rotate & Flip Image — Free Online Tool — AIVEXA",
  description:
    "Rotate images 90°/180° and flip horizontally or vertically online for free. No signup, no upload — everything runs 100% in your browser.",
});

export default function Page() {
  return (
    <>
      <RotateFlipTool />
      <ToolSeoContent category="image" slug="rotate-flip" />
    </>
  );
}
