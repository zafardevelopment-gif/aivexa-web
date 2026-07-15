import type { Metadata } from "next";
import PageNumbersTool from "./PageNumbersTool";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF — Free Online Tool — AIVEXA",
  description:
    "Stamp page numbers onto a PDF with position and format options, free with no signup. Your files never leave your browser.",
};

export default function Page() {
  return <PageNumbersTool />;
}
