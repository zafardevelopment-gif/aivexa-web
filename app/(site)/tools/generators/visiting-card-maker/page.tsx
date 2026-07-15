import type { Metadata } from "next";
import VisitingCardTool from "./VisitingCardTool";

export const metadata: Metadata = {
  title: "Visiting Card Maker — Free Online Tool — AIVEXA",
  description:
    "Design a business visiting card free — 2 layouts, accent color, logo upload, live preview, print-ready A4 PDF with multiple cards and cut margins plus PNG. No signup, fully in-browser.",
};

export default function Page() {
  return <VisitingCardTool />;
}
