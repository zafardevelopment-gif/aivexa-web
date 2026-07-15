import type { Metadata } from "next";
import GstCalculatorTool from "./GstCalculatorTool";

export const metadata: Metadata = {
  title: "GST Calculator — Free Online Tool — AIVEXA",
  description:
    "Add or remove GST from any amount and instantly see the CGST, SGST, and total GST breakdown for free, no signup required.",
};

export default function Page() {
  return <GstCalculatorTool />;
}
