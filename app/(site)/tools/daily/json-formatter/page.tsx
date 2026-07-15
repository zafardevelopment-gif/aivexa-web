import type { Metadata } from "next";
import JsonFormatterTool from "./JsonFormatterTool";

export const metadata: Metadata = {
  title: "JSON Formatter — Free Online Tool — AIVEXA",
  description:
    "Format, validate, and beautify JSON instantly with clear error messages, free and no signup required.",
};

export default function Page() {
  return <JsonFormatterTool />;
}
