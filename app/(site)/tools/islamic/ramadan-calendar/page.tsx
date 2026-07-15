import type { Metadata } from "next";
import RamadanCalendarTool from "./RamadanCalendarTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "ramadan-calendar", {
  title: "Ramadan Calendar (Sehri & Iftar Times) — Free Online Tool — AIVEXA",
  description:
    "Full-month Ramadan calendar with daily Sehri (Fajr) and Iftar (Maghrib) times for your city — printable, free, and fully in your browser.",
});

export default function Page() {
  return (
    <>
      <RamadanCalendarTool />
      <ToolSeoContent category="islamic" slug="ramadan-calendar" />
    </>
  );
}
