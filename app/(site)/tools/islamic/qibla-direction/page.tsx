import type { Metadata } from "next";
import QiblaDirectionTool from "./QiblaDirectionTool";

export const metadata: Metadata = {
  title: "Qibla Direction Finder — Free Online Tool — AIVEXA",
  description:
    "Find the Qibla direction (bearing to the Kaaba in Makkah) from your location, with an interactive compass — free and fully in your browser.",
};

export default function Page() {
  return <QiblaDirectionTool />;
}
