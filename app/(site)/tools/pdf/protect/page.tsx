import type { Metadata } from "next";
import ProtectPdfTool from "./ProtectPdfTool";

export const metadata: Metadata = {
  title: "Protect PDF — Free Online Tool — AIVEXA",
  description:
    "Add a password to a PDF free, no signup. 100% client-side encryption — your files and passwords never leave your browser.",
};

export default function Page() {
  return <ProtectPdfTool />;
}
