import type { Metadata } from "next";
import PdfToWordTool from "./PdfToWordTool";

export const metadata: Metadata = {
  title: "PDF to Word — Free Online Tool — AIVEXA",
  description:
    "Convert PDF text content into an editable Word .docx file, free with no signup. Your files never leave your browser.",
};

export default function Page() {
  return <PdfToWordTool />;
}
