import type { Metadata } from "next";
import CertificateQrGeneratorTool from "./CertificateQrGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "certificate-qr-generator", {
  title: "Certificate Verification QR Generator — Free — AIVEXA",
  description:
    "Generate a QR code for certificates free — encode certificate details or a verification URL and download a PNG to place on the certificate. No signup, runs in your browser.",
});

export default function Page() {
  return (
    <>
      <CertificateQrGeneratorTool />
      <ToolSeoContent category="misc" slug="certificate-qr-generator" />
    </>
  );
}
