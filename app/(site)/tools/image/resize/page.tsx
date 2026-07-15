import type { Metadata } from "next";
import ResizeTool from "./ResizeTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "resize", {
  title: "Image Resizer — Free Online Tool — AIVEXA",
  description:
    "Resize images online for free by pixels or percentage. No signup, no upload — resizing happens 100% in your browser. Download as PNG or JPG instantly.",
});

export default function Page() {
  return (
    <>
      <ResizeTool />
      <ToolSeoContent category="image" slug="resize" />
    </>
  );
}
