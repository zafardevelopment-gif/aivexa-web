import type { Metadata } from "next";
import RentReceiptTool from "./RentReceiptTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "rent-receipt-generator", {
  title: "Rent Receipt Generator — Free Online Tool — AIVEXA",
  description:
    "Generate rent receipts for HRA claims free — single month or a whole date range (one receipt per month), landlord PAN, amount in words, revenue stamp box, instant PDF, fully in-browser.",
});

export default function Page() {
  return (
    <>
      <RentReceiptTool />
      <ToolSeoContent category="generators" slug="rent-receipt-generator" />
    </>
  );
}
