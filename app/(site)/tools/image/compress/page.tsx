import type { Metadata } from "next";
import CompressTool from "./CompressTool";

export const metadata: Metadata = {
  title: "Image Compressor — Free Online Tool — AIVEXA",
  description:
    "Compress JPG, PNG and WebP images online for free. No signup, no upload — compression runs 100% in your browser for total privacy. Reduce image file size in seconds.",
};

export default function Page() {
  return <CompressTool />;
}
