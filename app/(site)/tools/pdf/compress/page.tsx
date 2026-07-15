import type { Metadata } from "next";
import CompressPdfTool from "./CompressPdfTool";

export const metadata: Metadata = {
  title: "Compress PDF — Free Online Tool — AIVEXA",
  description:
    "Reduce PDF file size free with no signup — lossless clean-up or aggressive image recompression. Your files never leave your browser.",
};

export default function Page() {
  return <CompressPdfTool />;
}
