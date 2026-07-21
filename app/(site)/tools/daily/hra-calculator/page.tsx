import type { Metadata } from "next";
import HraCalculatorTool from "./HraCalculatorTool";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { buildToolMetadata } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata("daily", "hra-calculator", {
  title: "HRA Calculator — House Rent Allowance Exemption — AIVEXA",
  description:
    "Free HRA exemption calculator under Section 10(13A). Enter basic salary, HRA received and rent paid to instantly see exempt and taxable HRA for metro and non-metro cities.",
});

export default function Page() {
  return (
    <>
      <HraCalculatorTool />
      <ToolSeoContent category="daily" slug="hra-calculator" />
    </>
  );
}
