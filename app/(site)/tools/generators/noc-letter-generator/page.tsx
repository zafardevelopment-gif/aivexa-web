import type { Metadata } from "next";
import NocLetterTool from "./NocLetterTool";

export const metadata: Metadata = {
  title: "NOC Letter Generator — Free Online Tool — AIVEXA",
  description:
    "Generate a No Objection Certificate (NOC) letter free — landlord NOC for tenants, employer NOC for visa/travel, vehicle NOC for interstate transfer. Editable text, PDF download, fully in-browser.",
};

export default function Page() {
  return <NocLetterTool />;
}
