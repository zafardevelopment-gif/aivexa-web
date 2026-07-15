"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, ResultRow } from "@/components/tools/ToolUI";
import { PLANETS, SUN } from "./planets-data";

export default function SolarSystemExplorerTool() {
  const [selected, setSelected] = useState<string>(PLANETS[2].name);
  const selectedPlanet = PLANETS.find((p) => p.name === selected);
  const showingSun = selected === SUN.name;

  return (
    <ToolPageLayout
      title="Solar System Explorer"
      description="Click the Sun or a planet to see its distance, size, moons and fun facts."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "1.4rem",
            overflowX: "auto",
            padding: "1.5rem .5rem 1rem",
            background: "linear-gradient(180deg,#0f172a,#1e1b4b)",
            borderRadius: 14,
          }}
        >
          <button
            type="button"
            onClick={() => setSelected(SUN.name)}
            style={{
              flexShrink: 0,
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: SUN.color,
              border: selected === SUN.name ? "3px solid #fff" : "3px solid transparent",
              cursor: "pointer",
              boxShadow: "0 0 30px rgba(245,158,11,.6)",
            }}
            aria-label="Sun"
          />
          {PLANETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setSelected(p.name)}
              title={p.name}
              style={{
                flexShrink: 0,
                width: p.relSize,
                height: p.relSize,
                borderRadius: "50%",
                background: p.color,
                border: selected === p.name ? "3px solid #fff" : "3px solid transparent",
                cursor: "pointer",
                alignSelf: "center",
              }}
              aria-label={p.name}
            />
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: ".78rem", color: "var(--muted-2)", marginTop: ".6rem" }}>
          Sizes are scaled for visibility, not to true relative scale. Tap a body to learn more.
        </p>

        <div style={{ marginTop: "1.4rem" }}>
          {showingSun ? (
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: ".8rem" }}>The Sun</h3>
              <ul style={{ paddingLeft: "1.2rem", color: "var(--muted)", lineHeight: 1.8 }}>
                {SUN.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ) : selectedPlanet ? (
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: ".8rem" }}>
                {selectedPlanet.name}
              </h3>
              <ResultRow label="Distance from Sun" value={selectedPlanet.distanceFromSunKm} />
              <ResultRow label="Distance (AU)" value={selectedPlanet.distanceAu} />
              <ResultRow label="Diameter" value={selectedPlanet.diameterKm} />
              <ResultRow label="Day length" value={selectedPlanet.dayLength} />
              <ResultRow label="Year length" value={selectedPlanet.yearLength} />
              <ResultRow label="Moons" value={selectedPlanet.moons} />
              <ul style={{ paddingLeft: "1.2rem", color: "var(--muted)", lineHeight: 1.8, marginTop: "1rem" }}>
                {selectedPlanet.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Card>
    </ToolPageLayout>
  );
}
