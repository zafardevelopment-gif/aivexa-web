import type { Metadata } from "next";
import AadhaarMaskingTool from "./AadhaarMaskingTool";

export const metadata: Metadata = {
  title: "Aadhaar Masking Tool — Free Online Tool — AIVEXA",
  description:
    "Mask the first 8 digits of an Aadhaar card image entirely in your browser for safe KYC sharing — free, no signup, and your image never leaves your device.",
};

export default function Page() {
  return <AadhaarMaskingTool />;
}
