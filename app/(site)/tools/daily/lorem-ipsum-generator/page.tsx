import type { Metadata } from "next";
import LoremIpsumGeneratorTool from "./LoremIpsumGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "lorem-ipsum-generator", {
  title: "Lorem Ipsum Generator — Free Online Tool — AIVEXA",
  description:
    "Generate placeholder Lorem Ipsum text by words or paragraphs for free, no signup required.",
});

export default function Page() {
  return (
    <>
      <LoremIpsumGeneratorTool />
      <ToolSeoContent category="daily" slug="lorem-ipsum-generator" />
    </>
  );
}
