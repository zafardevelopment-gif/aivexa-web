import type { Metadata } from "next";
import PdfToImageTool from "./PdfToImageTool";

export const metadata: Metadata = {
  title: "PDF to Image — Free Online Tool — AIVEXA",
  description:
    "Convert PDF pages to JPG or PNG images free, no signup needed. 100% client-side — your files never leave your browser.",
};

export default function Page() {
  return <PdfToImageTool />;
}
