import type { Metadata } from "next";
import WatermarkTool from "./WatermarkTool";

export const metadata: Metadata = {
  title: "Add Watermark to Image — Free Online Tool — AIVEXA",
  description:
    "Add a text watermark to photos online for free — custom text, size, opacity and position (center, corners, tiled). No signup, no upload — 100% browser-based.",
};

export default function Page() {
  return <WatermarkTool />;
}
