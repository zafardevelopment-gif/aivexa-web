import type { Metadata } from "next";
import RotateFlipTool from "./RotateFlipTool";

export const metadata: Metadata = {
  title: "Rotate & Flip Image — Free Online Tool — AIVEXA",
  description:
    "Rotate images 90°/180° and flip horizontally or vertically online for free. No signup, no upload — everything runs 100% in your browser.",
};

export default function Page() {
  return <RotateFlipTool />;
}
