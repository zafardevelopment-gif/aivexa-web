import type { Metadata } from "next";
import ComparePdfTool from "./ComparePdfTool";

export const metadata: Metadata = {
  title: "Compare PDFs — Free Online Tool — AIVEXA",
  description:
    "See a text diff between two PDF versions with added and removed lines highlighted, free with no signup. Your files never leave your browser.",
};

export default function Page() {
  return <ComparePdfTool />;
}
