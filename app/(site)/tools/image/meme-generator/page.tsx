import type { Metadata } from "next";
import MemeGeneratorTool from "./MemeGeneratorTool";

export const metadata: Metadata = {
  title: "Meme Generator — Free Online Tool — AIVEXA",
  description:
    "Make classic memes online for free — top and bottom text in bold Impact style with black outline. No signup, no upload — 100% browser-based and private.",
};

export default function Page() {
  return <MemeGeneratorTool />;
}
