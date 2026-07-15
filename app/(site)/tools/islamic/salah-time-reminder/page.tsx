import type { Metadata } from "next";
import SalahTimeReminderTool from "./SalahTimeReminderTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("islamic", "salah-time-reminder", {
  title: "Salah Time Reminder — Free Online Tool — AIVEXA",
  description:
    "Get browser notifications for today's remaining prayer times — free, private, and fully in your browser while the tab stays open.",
});

export default function Page() {
  return (
    <>
      <SalahTimeReminderTool />
      <ToolSeoContent category="islamic" slug="salah-time-reminder" />
    </>
  );
}
