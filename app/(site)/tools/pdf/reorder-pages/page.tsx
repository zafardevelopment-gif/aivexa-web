import type { Metadata } from "next";
import ReorderPagesTool from "./ReorderPagesTool";

export const metadata: Metadata = {
  title: "Reorder PDF Pages — Free Online Tool — AIVEXA",
  description:
    "Drag and drop PDF page thumbnails to rearrange them, free with no signup. Your files never leave your browser.",
};

export default function Page() {
  return <ReorderPagesTool />;
}
