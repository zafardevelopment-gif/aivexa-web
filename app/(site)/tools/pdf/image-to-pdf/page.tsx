import type { Metadata } from "next";
import ImageToPdfTool from "./ImageToPdfTool";

export const metadata: Metadata = {
  title: "Image to PDF — Free Online Tool — AIVEXA",
  description:
    "Combine JPG and PNG images into a single A4 PDF, free with no signup. 100% client-side — your files never leave your browser.",
};

export default function Page() {
  return <ImageToPdfTool />;
}
