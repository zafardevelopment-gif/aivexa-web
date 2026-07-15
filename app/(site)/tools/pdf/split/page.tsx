import type { Metadata } from "next";
import SplitPdfTool from "./SplitPdfTool";

export const metadata: Metadata = {
  title: "Split PDF — Free Online Tool — AIVEXA",
  description:
    "Split a PDF by page range or into chunks of N pages, free with no signup. 100% client-side — your files never leave your browser.",
};

export default function Page() {
  return <SplitPdfTool />;
}
