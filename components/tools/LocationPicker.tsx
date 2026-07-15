"use client";

import { useState } from "react";
import { Field, SelectInput } from "@/components/tools/ToolUI";
import { GEO_CITIES, deviceTzHours, type GeoCity } from "@/lib/india-cities-geo";

export type LocationValue = {
  label: string;
  lat: number;
  lng: number;
  /** UTC offset in hours used for calculations. */
  tz: number;
  source: "city" | "geolocation";
};

export function cityToLocation(city: GeoCity): LocationValue {
  return {
    label: `${city.name}, ${city.country}`,
    lat: city.lat,
    lng: city.lng,
    tz: city.tz,
    source: "city",
  };
}

export const DEFAULT_LOCATION: LocationValue = cityToLocation(GEO_CITIES[0]);

export default function LocationPicker({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
}) {
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error">("idle");
  const [geoError, setGeoError] = useState("");

  function useMyLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("error");
      setGeoError("Geolocation is not supported by this browser. Please pick a city below.");
      return;
    }
    setGeoStatus("loading");
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoStatus("idle");
        onChange({
          label: `My location (${pos.coords.latitude.toFixed(3)}°, ${pos.coords.longitude.toFixed(3)}°)`,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          tz: deviceTzHours(),
          source: "geolocation",
        });
      },
      (err) => {
        setGeoStatus("error");
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was denied — no problem, just pick your city from the list below."
            : "Could not detect your location. Please pick your city from the list below."
        );
      },
      { timeout: 12000, maximumAge: 300000 }
    );
  }

  const selectedCityName =
    value.source === "city"
      ? GEO_CITIES.find((c) => `${c.name}, ${c.country}` === value.label)?.name ?? ""
      : "";

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", alignItems: "center", marginBottom: ".9rem" }}>
        <button
          type="button"
          className="btn-secondary sm"
          onClick={useMyLocation}
          disabled={geoStatus === "loading"}
        >
          {geoStatus === "loading" ? "Detecting…" : "📍 Use my location"}
        </button>
        <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>
          Current: <strong style={{ color: "var(--text)" }}>{value.label}</strong>
        </span>
      </div>
      {geoStatus === "error" && (
        <p style={{ color: "#b45309", fontSize: ".85rem", marginBottom: ".8rem" }}>{geoError}</p>
      )}
      <Field label="Or choose a city">
        <SelectInput
          value={selectedCityName}
          onChange={(e) => {
            const city = GEO_CITIES.find((c) => c.name === e.target.value);
            if (city) onChange(cityToLocation(city));
          }}
        >
          {value.source === "geolocation" && <option value="">— using my detected location —</option>}
          {GEO_CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.country})
            </option>
          ))}
        </SelectInput>
      </Field>
    </div>
  );
}
