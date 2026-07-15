import type { Metadata } from "next";
import PassportPhotoMakerTool from "./PassportPhotoMakerTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "passport-photo-maker", {
  title: "Passport Photo Maker — Free Online Tool — AIVEXA",
  description:
    "Crop your photo to passport, visa or ID specs and arrange multiple copies on a printable sheet, free and no signup. Your photo never leaves your browser.",
});

export default function Page() {
  return (
    <>
      <PassportPhotoMakerTool />
      <ToolSeoContent category="generators" slug="passport-photo-maker" />
    </>
  );
}
