import type { Metadata } from "next";
import ExtractPagesTool from "./ExtractPagesTool";

export const metadata: Metadata = {
  title: "Extract PDF Pages — Free Online Tool — AIVEXA",
  description:
    "Pull specific pages or ranges out of a PDF into a new file, free with no signup. Your files never leave your browser.",
};

export default function Page() {
  return <ExtractPagesTool />;
}
