import type { Metadata } from "next";
import DeletePagesTool from "./DeletePagesTool";

export const metadata: Metadata = {
  title: "Delete PDF Pages — Free Online Tool — AIVEXA",
  description:
    "Remove specific pages from a PDF by clicking their thumbnails, free with no signup. Your files never leave your browser.",
};

export default function Page() {
  return <DeletePagesTool />;
}
