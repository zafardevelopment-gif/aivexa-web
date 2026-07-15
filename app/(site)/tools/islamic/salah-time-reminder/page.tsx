import type { Metadata } from "next";
import SalahTimeReminderTool from "./SalahTimeReminderTool";

export const metadata: Metadata = {
  title: "Salah Time Reminder — Free Online Tool — AIVEXA",
  description:
    "Get browser notifications for today's remaining prayer times — free, private, and fully in your browser while the tab stays open.",
};

export default function Page() {
  return <SalahTimeReminderTool />;
}
