import type { Metadata } from "next";
import MarriageBiodataTool from "./MarriageBiodataTool";

export const metadata: Metadata = {
  title: "Marriage Biodata Maker — Free Online Tool — AIVEXA",
  description:
    "Create a beautiful Indian marriage biodata PDF for free — traditional and modern templates, optional photo and horoscope details, no signup, data never leaves your browser.",
};

export default function Page() {
  return <MarriageBiodataTool />;
}
