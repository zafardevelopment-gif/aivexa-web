import type { Metadata } from "next";
import PrayerTimesTool from "./PrayerTimesTool";

export const metadata: Metadata = {
  title: "Prayer Times Calculator — Free Online Tool — AIVEXA",
  description:
    "Calculate today's Fajr, Dhuhr, Asr, Maghrib and Isha prayer times for your location — free, accurate, and fully in your browser.",
};

export default function Page() {
  return <PrayerTimesTool />;
}
