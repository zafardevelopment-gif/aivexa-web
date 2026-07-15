"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, SelectInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import { INDIAN_CITIES } from "./cities-data";

const EARTH_RADIUS_KM = 6371;
const ROAD_FACTOR = 1.3;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export default function DistanceCalculatorTool() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  const from = INDIAN_CITIES.find((c) => c.name === fromCity);
  const to = INDIAN_CITIES.find((c) => c.name === toCity);

  const straightLine =
    from && to && from.name !== to.name
      ? haversineKm(from.lat, from.lon, to.lat, to.lon)
      : null;
  const roadEstimate = straightLine !== null ? straightLine * ROAD_FACTOR : null;

  return (
    <ToolPageLayout
      title="Distance Calculator"
      description="Approximate straight-line and road distance between two Indian cities."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <Field label="From City">
          <SelectInput value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
            <option value="">Select a city</option>
            {INDIAN_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}, {c.state}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label="To City">
          <SelectInput value={toCity} onChange={(e) => setToCity(e.target.value)}>
            <option value="">Select a city</option>
            {INDIAN_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}, {c.state}
              </option>
            ))}
          </SelectInput>
        </Field>

        {fromCity && toCity && fromCity === toCity && (
          <p style={{ fontSize: ".88rem", color: "var(--muted-2)" }}>
            Please select two different cities.
          </p>
        )}

        {straightLine !== null && roadEstimate !== null && (
          <ResultBox>
            <ResultRow label="Straight-line (great-circle) distance" value={`${straightLine.toFixed(1)} km`} />
            <ResultRow label="Approximate road distance (estimate)" value={`${roadEstimate.toFixed(1)} km`} />
            <p style={{ fontSize: ".82rem", color: "var(--muted)", margin: ".8rem 0 0" }}>
              Road distance is an ESTIMATE only (straight-line distance × 1.3 to
              roughly account for actual road routing) — it is not calculated
              from live map/routing data and can differ from the real driving
              distance.
            </p>
          </ResultBox>
        )}

        {(!fromCity || !toCity) && (
          <p style={{ fontSize: ".88rem", color: "var(--muted-2)" }}>
            Select both cities to see the distance.
          </p>
        )}
      </Card>
    </ToolPageLayout>
  );
}
