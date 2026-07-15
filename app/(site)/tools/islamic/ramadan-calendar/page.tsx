import type { Metadata } from "next";
import RamadanCalendarTool from "./RamadanCalendarTool";

export const metadata: Metadata = {
  title: "Ramadan Calendar (Sehri & Iftar Times) — Free Online Tool — AIVEXA",
  description:
    "Full-month Ramadan calendar with daily Sehri (Fajr) and Iftar (Maghrib) times for your city — printable, free, and fully in your browser.",
};

export default function Page() {
  return <RamadanCalendarTool />;
}
