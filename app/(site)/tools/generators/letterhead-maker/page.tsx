import type { Metadata } from "next";
import LetterheadTool from "./LetterheadTool";

export const metadata: Metadata = {
  title: "Letterhead Maker — Free Online Tool — AIVEXA",
  description:
    "Create a professional company letterhead free — logo, tagline, contact details, accent color, two header layouts, A4 live preview and reusable blank PDF download. Fully in-browser.",
};

export default function Page() {
  return <LetterheadTool />;
}
