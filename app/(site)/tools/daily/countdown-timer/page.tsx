import type { Metadata } from "next";
import { Suspense } from "react";
import CountdownTimerTool from "./CountdownTimerTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "countdown-timer", {
  title: "Countdown Timer — Free Online Tool — AIVEXA",
  description:
    "Free online countdown timer to any date or event with a shareable link, no signup required.",
});

export default function Page() {
  return (
    <>
      <Suspense>
        <CountdownTimerTool />
      </Suspense>
      <ToolSeoContent category="daily" slug="countdown-timer" />
    </>
  );
}
