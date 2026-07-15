import type { Metadata } from "next";
import NocLetterTool from "./NocLetterTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "noc-letter-generator", {
  title: "NOC Letter Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a No Objection Certificate (NOC) letter free — landlord NOC for tenants, employer NOC for visa/travel, vehicle NOC for interstate transfer. Editable text, PDF download, fully in-browser.",
});

export default function Page() {
  return (
    <>
      <NocLetterTool />
      <ToolSeoContent category="generators" slug="noc-letter-generator" />
    </>
  );
}
