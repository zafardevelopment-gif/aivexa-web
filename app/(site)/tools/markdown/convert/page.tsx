import type { Metadata } from "next";
import FileToMarkdownTool from "./FileToMarkdownTool";

export const metadata: Metadata = {
  title: "File to Markdown Converter — PDF, DOCX, XLSX, CSV, Image & More — AIVEXA",
  description:
    "Convert PDF, Word (.docx), Excel (.xlsx), CSV, image (OCR), HTML, JSON and plain text files to clean Markdown (.md) — free, no signup, runs entirely in your browser.",
  keywords: [
    "file to markdown",
    "pdf to markdown",
    "docx to markdown",
    "word to markdown",
    "excel to markdown",
    "csv to markdown table",
    "image to markdown OCR",
    "html to markdown",
    "convert to md",
    "free markdown converter",
  ],
  alternates: { canonical: "/tools/markdown/convert" },
  openGraph: {
    title: "File to Markdown Converter — AIVEXA",
    description:
      "Free browser-based converter: PDF, DOCX, XLSX, CSV, image, HTML, JSON → Markdown .md file.",
    type: "website",
    url: "/tools/markdown/convert",
    siteName: "AIVEXA",
    images: [{ url: "/aivexa-logo.png", width: 512, height: 512, alt: "AIVEXA" }],
  },
  twitter: {
    card: "summary",
    title: "File to Markdown Converter — AIVEXA",
    description: "PDF, DOCX, XLSX, CSV, image, HTML & TXT → .md — free, no upload.",
  },
};

export default function Page() {
  return <FileToMarkdownTool />;
}
