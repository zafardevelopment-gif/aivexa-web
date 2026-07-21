import type { Metadata } from "next";
import YoutubeTagGeneratorTool from "./YoutubeTagGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "youtube-tag-generator", {
  title: "YouTube Tag Generator — Free SEO Tags for Videos — AIVEXA",
  description:
    "Generate SEO-optimized YouTube tags free from real YouTube search suggestions. Enter your video topic, pick a region, copy up to 500 characters of tags. No signup.",
});

export default function Page() {
  return (
    <>
      <YoutubeTagGeneratorTool />
      <ToolSeoContent category="misc" slug="youtube-tag-generator" />
    </>
  );
}
