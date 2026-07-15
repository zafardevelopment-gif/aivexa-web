import type { Metadata } from "next";
import LoremIpsumGeneratorTool from "./LoremIpsumGeneratorTool";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator — Free Online Tool — AIVEXA",
  description:
    "Generate placeholder Lorem Ipsum text by words or paragraphs for free, no signup required.",
};

export default function Page() {
  return <LoremIpsumGeneratorTool />;
}
