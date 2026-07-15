import type { Metadata } from "next";
import SolarSystemExplorerTool from "./SolarSystemExplorerTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "solar-system-explorer", {
  title: "Solar System Explorer — Free Educational Tool — AIVEXA",
  description:
    "Explore the Sun and 8 planets with an interactive diagram — distances, sizes, moons and fun facts, free for students.",
});

export default function Page() {
  return (
    <>
      <SolarSystemExplorerTool />
      <ToolSeoContent category="misc" slug="solar-system-explorer" />
    </>
  );
}
