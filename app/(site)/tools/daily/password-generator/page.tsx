import type { Metadata } from "next";
import PasswordGeneratorTool from "./PasswordGeneratorTool";

export const metadata: Metadata = {
  title: "Password Generator — Free Online Tool — AIVEXA",
  description:
    "Generate strong, random, secure passwords for free, no signup required, with customizable length and character types.",
};

export default function Page() {
  return <PasswordGeneratorTool />;
}
