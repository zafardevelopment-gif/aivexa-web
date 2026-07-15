import type { Metadata } from "next";
import BackgroundColorTool from "./BackgroundColorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "background-color-change", {
  title: "Change Image Background Color — Free Online Tool — AIVEXA",
  description:
    "Fill the transparent background of a PNG with any solid color online for free. No signup, no upload — processing happens 100% in your browser.",
});

export default function Page() {
  return (
    <>
      <BackgroundColorTool />
      <ToolSeoContent category="image" slug="background-color-change" />
    </>
  );
}
