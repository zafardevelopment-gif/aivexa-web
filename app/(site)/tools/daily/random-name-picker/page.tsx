import type { Metadata } from "next";
import RandomNamePickerTool from "./RandomNamePickerTool";

export const metadata: Metadata = {
  title: "Random Name Picker — Free Online Tool — AIVEXA",
  description:
    "Pick a random name from a list instantly with a fun spinning animation, free and no signup required.",
};

export default function Page() {
  return <RandomNamePickerTool />;
}
