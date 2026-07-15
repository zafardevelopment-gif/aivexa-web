import type { Metadata } from "next";
import ProtectPdfTool from "./ProtectPdfTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "protect", {
  title: "Protect PDF — Free Online Tool — AIVEXA",
  description:
    "Add a password to a PDF free, no signup. 100% client-side encryption — your files and passwords never leave your browser.",
});

export default function Page() {
  return (
    <>
      <ProtectPdfTool />
      <ToolSeoContent category="pdf" slug="protect" />
    </>
  );
}
