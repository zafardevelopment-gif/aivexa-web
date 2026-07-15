import type { Metadata } from "next";
import TypingSpeedTestTool from "./TypingSpeedTestTool";

export const metadata: Metadata = {
  title: "Typing Speed Test — Free Online Tool — AIVEXA",
  description:
    "Free online typing speed test to measure your words per minute (WPM) and typing accuracy with live character highlighting.",
};

export default function Page() {
  return <TypingSpeedTestTool />;
}
