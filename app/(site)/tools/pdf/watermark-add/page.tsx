import type { Metadata } from "next";
import WatermarkTool from "./WatermarkTool";

export const metadata: Metadata = {
  title: "Add Watermark to PDF — Free Online Tool — AIVEXA",
  description:
    "Overlay a text watermark on every PDF page with opacity, rotation and color options, free with no signup. Your files never leave your browser.",
};

export default function Page() {
  return <WatermarkTool />;
}
