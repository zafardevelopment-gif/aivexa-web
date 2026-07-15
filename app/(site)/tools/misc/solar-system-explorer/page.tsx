import type { Metadata } from "next";
import SolarSystemExplorerTool from "./SolarSystemExplorerTool";

export const metadata: Metadata = {
  title: "Solar System Explorer — Free Educational Tool — AIVEXA",
  description:
    "Explore the Sun and 8 planets with an interactive diagram — distances, sizes, moons and fun facts, free for students.",
};

export default function Page() {
  return <SolarSystemExplorerTool />;
}
