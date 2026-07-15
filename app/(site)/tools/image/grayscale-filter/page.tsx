import type { Metadata } from "next";
import GrayscaleFilterTool from "./GrayscaleFilterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "grayscale-filter", {
  title: "Grayscale & Photo Filters — Free Online Tool — AIVEXA",
  description:
    "Apply grayscale, sepia, high-contrast B&W and invert filters plus brightness control to any photo online for free. No signup, no upload — 100% browser-based.",
});

export default function Page() {
  return (
    <>
      <GrayscaleFilterTool />
      <ToolSeoContent category="image" slug="grayscale-filter" />
    </>
  );
}
