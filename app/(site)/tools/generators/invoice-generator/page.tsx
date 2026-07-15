import type { Metadata } from "next";
import InvoiceGeneratorTool from "./InvoiceGeneratorTool";

export const metadata: Metadata = {
  title: "Invoice Generator — Free Online Tool — AIVEXA",
  description:
    "Create a professional GST invoice PDF for free — line items, CGST/SGST split, Indian ₹ formatting, logo upload, no signup, data never leaves your browser.",
};

export default function Page() {
  return <InvoiceGeneratorTool />;
}
