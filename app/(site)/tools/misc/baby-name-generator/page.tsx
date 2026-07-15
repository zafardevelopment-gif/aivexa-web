import type { Metadata } from "next";
import BabyNameGeneratorTool from "./BabyNameGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "baby-name-generator", {
  title: "Baby Name Generator — Free Online Tool — AIVEXA",
  description:
    "Browse Islamic, Hindu, Christian and Sikh baby names with meaning, origin and gender filters, free and no signup required.",
});

export default function Page() {
  return (
    <>
      <BabyNameGeneratorTool />
      <ToolSeoContent category="misc" slug="baby-name-generator" />
    </>
  );
}
