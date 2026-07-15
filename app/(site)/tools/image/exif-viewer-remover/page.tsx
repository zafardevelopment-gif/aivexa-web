import type { Metadata } from "next";
import ExifTool from "./ExifTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("image", "exif-viewer-remover", {
  title: "EXIF Viewer & Remover — Free Online Tool — AIVEXA",
  description:
    "View photo EXIF metadata (camera, date, GPS location) and download a cleaned copy with all metadata stripped — free, no signup, 100% in your browser for privacy.",
});

export default function Page() {
  return (
    <>
      <ExifTool />
      <ToolSeoContent category="image" slug="exif-viewer-remover" />
    </>
  );
}
