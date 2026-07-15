import type { Metadata } from "next";
import { Suspense } from "react";
import CountdownTimerTool from "./CountdownTimerTool";

export const metadata: Metadata = {
  title: "Countdown Timer — Free Online Tool — AIVEXA",
  description:
    "Free online countdown timer to any date or event with a shareable link, no signup required.",
};

export default function Page() {
  return (
    <Suspense>
      <CountdownTimerTool />
    </Suspense>
  );
}
