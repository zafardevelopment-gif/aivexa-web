import type { Metadata } from "next";
import FaviconGeneratorTool from "./FaviconGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "favicon-generator", {
  title: "Favicon Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a complete favicon set (16x16 to 512x512 plus apple-touch-icon) from any image and download it as a ZIP with a ready-to-paste HTML snippet. 100% browser-based, free, no signup.",
});

export default function Page() {
  return (
    <>
      <FaviconGeneratorTool />
      <ToolSeoContent category="image" slug="favicon-generator" />
    </>
  );
}
