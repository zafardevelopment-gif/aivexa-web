import type { Metadata } from "next";
import ToBase64Tool from "./ToBase64Tool";

export const metadata: Metadata = {
  title: "Image to Base64 Converter — Free Online Tool — AIVEXA",
  description:
    "Convert images to Base64 data URLs online for free — plain string, CSS background-image and HTML img tag formats with one-click copy. 100% browser-based, no upload.",
};

export default function Page() {
  return <ToBase64Tool />;
}
