import type { Metadata } from "next";
import IdCardMakerTool from "./IdCardMakerTool";

export const metadata: Metadata = {
  title: "ID Card Maker — Free Online Tool — AIVEXA",
  description:
    "Design an employee or student ID card free — photo upload, org color, live preview, print-ready PDF and PNG download, no signup, everything stays in your browser.",
};

export default function Page() {
  return <IdCardMakerTool />;
}
