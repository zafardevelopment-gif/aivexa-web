import type { Metadata } from "next";
import UnlockPdfTool from "./UnlockPdfTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("pdf", "unlock", {
  title: "Unlock PDF — Free Online Tool — AIVEXA",
  description:
    "Remove a known password from a PDF free, no signup. 100% client-side — your files and passwords never leave your browser.",
});

export default function Page() {
  return (
    <>
      <UnlockPdfTool />
      <ToolSeoContent category="pdf" slug="unlock" />
    </>
  );
}
