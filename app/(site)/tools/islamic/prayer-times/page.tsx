import type { Metadata } from "next";
import PrayerTimesTool from "./PrayerTimesTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "prayer-times", {
  title: "Prayer Times Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate today's Fajr, Dhuhr, Asr, Maghrib and Isha prayer times for your location — free, accurate, and fully in your browser.",
});

export default function Page() {
  return (
    <>
      <PrayerTimesTool />
      <ToolSeoContent category="islamic" slug="prayer-times" />
    </>
  );
}
