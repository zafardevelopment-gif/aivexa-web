import type { Metadata } from "next";
import QiblaDirectionTool from "./QiblaDirectionTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "qibla-direction", {
  title: "Qibla Direction Finder — Free Online Tool — AIVEXA",
  description:
    "Find the Qibla direction (bearing to the Kaaba in Makkah) from your location, with an interactive compass — free and fully in your browser.",
});

export default function Page() {
  return (
    <>
      <QiblaDirectionTool />
      <ToolSeoContent category="islamic" slug="qibla-direction" />
    </>
  );
}
