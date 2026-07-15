import type { Metadata } from "next";
import SignatureGeneratorTool from "./SignatureGeneratorTool";

export const metadata: Metadata = {
  title: "Signature Generator — Free Online Tool — AIVEXA",
  description:
    "Create a signature free — type your name in beautiful script fonts or draw with mouse/touch, then download a transparent PNG. No signup, nothing leaves your browser.",
};

export default function Page() {
  return <SignatureGeneratorTool />;
}
