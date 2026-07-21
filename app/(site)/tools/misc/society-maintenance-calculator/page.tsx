import type { Metadata } from "next";
import SocietyMaintenanceCalculatorTool from "./SocietyMaintenanceCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("misc", "society-maintenance-calculator", {
  title: "Society Maintenance Split Calculator — Per Flat Share — AIVEXA",
  description:
    "Free calculator to divide housing society monthly expenses across flats — equally or by carpet area (per sq.ft rate). Instant per-flat maintenance share. No signup.",
});

export default function Page() {
  return (
    <>
      <SocietyMaintenanceCalculatorTool />
      <ToolSeoContent category="misc" slug="society-maintenance-calculator" />
    </>
  );
}
