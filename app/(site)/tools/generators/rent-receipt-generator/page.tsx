import type { Metadata } from "next";
import RentReceiptTool from "./RentReceiptTool";

export const metadata: Metadata = {
  title: "Rent Receipt Generator — Free Online Tool — AIVEXA",
  description:
    "Generate rent receipts for HRA claims free — single month or a whole date range (one receipt per month), landlord PAN, amount in words, revenue stamp box, instant PDF, fully in-browser.",
};

export default function Page() {
  return <RentReceiptTool />;
}
