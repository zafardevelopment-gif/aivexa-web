import type { Metadata } from "next";
import OfferLetterTool from "./OfferLetterTool";

export const metadata: Metadata = {
  title: "Offer Letter Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a formal employee offer letter in seconds — role, CTC, joining date, probation and more. Editable text, instant PDF, free, no signup, fully in-browser.",
};

export default function Page() {
  return <OfferLetterTool />;
}
