import type { Metadata } from "next";
import MergePdfTool from "./MergePdfTool";

export const metadata: Metadata = {
  title: "Merge PDF — Free Online Tool — AIVEXA",
  description:
    "Combine multiple PDF files into one, free and with no signup. 100% client-side — your files never leave your browser.",
};

export default function Page() {
  return <MergePdfTool />;
}
