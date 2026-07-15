import type { Metadata } from "next";
import CoverLetterTool from "./CoverLetterTool";

export const metadata: Metadata = {
  title: "Cover Letter Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a professional, editable cover letter for any job in seconds — formal or friendly tone, PDF download, free, no signup, your data never leaves your browser.",
};

export default function Page() {
  return <CoverLetterTool />;
}
