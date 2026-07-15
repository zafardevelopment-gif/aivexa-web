import type { Metadata } from "next";
import SignatureGeneratorTool from "./SignatureGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "signature-generator", {
  title: "Signature Generator — Free Online Tool — AIVEXA",
  description:
    "Create a signature free — type your name in beautiful script fonts or draw with mouse/touch, then download a transparent PNG. No signup, nothing leaves your browser.",
});

export default function Page() {
  return (
    <>
      <SignatureGeneratorTool />
      <ToolSeoContent category="generators" slug="signature-generator" />
    </>
  );
}
