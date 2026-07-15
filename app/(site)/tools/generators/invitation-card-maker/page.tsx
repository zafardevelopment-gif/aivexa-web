import type { Metadata } from "next";
import InvitationCardTool from "./InvitationCardTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "invitation-card-maker", {
  title: "Invitation Card Maker — Free Online Tool — AIVEXA",
  description:
    "Design a wedding, birthday or event invitation card free — elegant, festive and minimal templates, live preview, PDF and PNG download. No signup, fully in-browser.",
});

export default function Page() {
  return (
    <>
      <InvitationCardTool />
      <ToolSeoContent category="generators" slug="invitation-card-maker" />
    </>
  );
}
