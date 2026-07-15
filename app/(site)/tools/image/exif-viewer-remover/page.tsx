import type { Metadata } from "next";
import ExifTool from "./ExifTool";

export const metadata: Metadata = {
  title: "EXIF Viewer & Remover — Free Online Tool — AIVEXA",
  description:
    "View photo EXIF metadata (camera, date, GPS location) and download a cleaned copy with all metadata stripped — free, no signup, 100% in your browser for privacy.",
};

export default function Page() {
  return <ExifTool />;
}
