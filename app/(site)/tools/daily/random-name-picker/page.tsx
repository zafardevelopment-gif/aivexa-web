import type { Metadata } from "next";
import RandomNamePickerTool from "./RandomNamePickerTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "random-name-picker", {
  title: "Random Name Picker — Free Online Tool — AIVEXA",
  description:
    "Pick a random name from a list instantly with a fun spinning animation, free and no signup required.",
});

export default function Page() {
  return (
    <>
      <RandomNamePickerTool />
      <ToolSeoContent category="daily" slug="random-name-picker" />
    </>
  );
}
