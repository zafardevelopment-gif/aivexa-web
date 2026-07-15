import type { Metadata } from "next";
import PassportPhotoMakerTool from "./PassportPhotoMakerTool";

export const metadata: Metadata = {
  title: "Passport Photo Maker — Free Online Tool — AIVEXA",
  description:
    "Crop your photo to passport, visa or ID specs and arrange multiple copies on a printable sheet, free and no signup. Your photo never leaves your browser.",
};

export default function Page() {
  return <PassportPhotoMakerTool />;
}
