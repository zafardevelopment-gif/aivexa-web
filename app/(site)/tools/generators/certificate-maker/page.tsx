import type { Metadata } from "next";
import CertificateMakerTool from "./CertificateMakerTool";

export const metadata: Metadata = {
  title: "Certificate Maker — Free Online Tool — AIVEXA",
  description:
    "Design a certificate of completion, participation or achievement free — elegant, modern and classic styles, live preview, PDF and PNG download, no signup, fully in-browser.",
};

export default function Page() {
  return <CertificateMakerTool />;
}
