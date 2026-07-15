import type { Metadata } from "next";
import BabyNameGeneratorTool from "./BabyNameGeneratorTool";

export const metadata: Metadata = {
  title: "Baby Name Generator — Free Online Tool — AIVEXA",
  description:
    "Browse Islamic, Hindu, Christian and Sikh baby names with meaning, origin and gender filters, free and no signup required.",
};

export default function Page() {
  return <BabyNameGeneratorTool />;
}
