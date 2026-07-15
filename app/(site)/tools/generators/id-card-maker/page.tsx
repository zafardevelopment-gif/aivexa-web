import type { Metadata } from "next";
import IdCardMakerTool from "./IdCardMakerTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("generators", "id-card-maker", {
  title: "ID Card Maker — Free Online Tool — AIVEXA",
  description:
    "Design an employee or student ID card free — photo upload, org color, live preview, print-ready PDF and PNG download, no signup, everything stays in your browser.",
});

export default function Page() {
  return (
    <>
      <IdCardMakerTool />
      <ToolSeoContent category="generators" slug="id-card-maker" />
    </>
  );
}
