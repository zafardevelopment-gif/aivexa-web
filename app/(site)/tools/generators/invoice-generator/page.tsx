import type { Metadata } from "next";
import InvoiceGeneratorTool from "./InvoiceGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "invoice-generator", {
  title: "Invoice Generator — Free Online Tool — AIVEXA",
  description:
    "Create a professional GST invoice PDF for free — line items, CGST/SGST split, Indian ₹ formatting, logo upload, no signup, data never leaves your browser.",
});

export default function Page() {
  return (
    <>
      <InvoiceGeneratorTool />
      <ToolSeoContent category="generators" slug="invoice-generator" />
    </>
  );
}
