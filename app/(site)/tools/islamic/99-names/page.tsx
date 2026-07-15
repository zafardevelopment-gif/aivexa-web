import type { Metadata } from "next";
import NamesTool from "./NamesTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "99-names", {
  title: "99 Names of Allah — Free Online Tool — AIVEXA",
  description:
    "Asma-ul-Husna: all 99 names of Allah with Arabic script, transliteration and meaning. Searchable reference.",
});

export default function Page() {
  return (
    <>
      <NamesTool />
      <ToolSeoContent category="islamic" slug="99-names" />
    </>
  );
}
