import type { Metadata } from "next";
import CropTool from "./CropTool";

export const metadata: Metadata = {
  title: "Image Cropper — Free Online Tool — AIVEXA",
  description:
    "Crop images online for free with an interactive crop box and aspect ratio presets (1:1, 16:9, 4:3). No signup, no upload — cropping runs 100% in your browser.",
};

export default function Page() {
  return <CropTool />;
}
