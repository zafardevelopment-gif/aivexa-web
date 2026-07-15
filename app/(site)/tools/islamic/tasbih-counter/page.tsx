import type { Metadata } from "next";
import TasbihCounterTool from "./TasbihCounterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "tasbih-counter", {
  title: "Tasbih Counter — Free Online Tool — AIVEXA",
  description: "A digital dhikr counter with target count, vibration alert, sound and reset. Saved automatically.",
});

export default function Page() {
  return (
    <>
      <TasbihCounterTool />
      <ToolSeoContent category="islamic" slug="tasbih-counter" />
    </>
  );
}
