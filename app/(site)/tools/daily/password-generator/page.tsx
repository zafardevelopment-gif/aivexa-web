import type { Metadata } from "next";
import PasswordGeneratorTool from "./PasswordGeneratorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "password-generator", {
  title: "Password Generator — Free Online Tool — AIVEXA",
  description:
    "Generate strong, random, secure passwords for free, no signup required, with customizable length and character types.",
});

export default function Page() {
  return (
    <>
      <PasswordGeneratorTool />
      <ToolSeoContent category="daily" slug="password-generator" />
    </>
  );
}
