import type { Metadata } from "next";
import TasbihCounterTool from "./TasbihCounterTool";

export const metadata: Metadata = {
  title: "Tasbih Counter — Free Online Tool — AIVEXA",
  description: "A digital dhikr counter with target count, vibration alert, sound and reset. Saved automatically.",
};

export default function Page() {
  return <TasbihCounterTool />;
}
