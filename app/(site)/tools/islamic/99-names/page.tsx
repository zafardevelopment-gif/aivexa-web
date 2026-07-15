import type { Metadata } from "next";
import NamesTool from "./NamesTool";

export const metadata: Metadata = {
  title: "99 Names of Allah — Free Online Tool — AIVEXA",
  description:
    "Asma-ul-Husna: all 99 names of Allah with Arabic script, transliteration and meaning. Searchable reference.",
};

export default function Page() {
  return <NamesTool />;
}
