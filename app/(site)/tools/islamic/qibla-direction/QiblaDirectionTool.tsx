"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card } from "@/components/tools/ToolUI";
import LocationPicker, { DEFAULT_LOCATION, type LocationValue } from "@/components/tools/LocationPicker";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const DEG = Math.PI / 180;

function qiblaBearing(lat: number, lng: number): number {
  const phi1 = lat * DEG;
  const phi2 = KAABA_LAT * DEG;
  const dLng = (KAABA_LNG - lng) * DEG;
  const y = Math.sin(dLng) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLng);
  const b = Math.atan2(y, x) / DEG;
  return (b + 360) % 360;
}

function distanceToKaabaKm(lat: number, lng: number): number {
  const dLat = (KAABA_LAT - lat) * DEG;
  const dLng = (KAABA_LNG - lng) * DEG;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat * DEG) * Math.cos(KAABA_LAT * DEG) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const COMPASS_POINTS = [
  "North", "North-North-East", "North-East", "East-North-East",
  "East", "East-South-East", "South-East", "South-South-East",
  "South", "South-South-West", "South-West", "West-South-West",
  "West", "West-North-West", "North-West", "North-North-West",
];

function directionWord(bearing: number): string {
  return COMPASS_POINTS[Math.round(bearing / 22.5) % 16];
}

type OrientationEventWithWebkit = DeviceOrientationEvent & { webkitCompassHeading?: number };
type DOEConstructorWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function CompassRose({ rotation, live }: { rotation: number; live: boolean }) {
  const size = 260;
  const c = size / 2;
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Qibla compass">
      <circle cx={c} cy={c} r={c - 4} fill="#fff" stroke="var(--indigo, #4f46e5)" strokeWidth={2.5} />
      <circle cx={c} cy={c} r={c - 18} fill="none" stroke="#e0e7ff" strokeWidth={1} />
      {ticks.map((deg) => {
        const major = deg % 90 === 0;
        const r1 = c - 8;
        const r2 = major ? c - 22 : c - 15;
        const rad = (deg - 90) * DEG;
        return (
          <line
            key={deg}
            x1={c + r1 * Math.cos(rad)}
            y1={c + r1 * Math.sin(rad)}
            x2={c + r2 * Math.cos(rad)}
            y2={c + r2 * Math.sin(rad)}
            stroke={major ? "var(--indigo, #4f46e5)" : "#cbd5e1"}
            strokeWidth={major ? 2.5 : 1.5}
          />
        );
      })}
      {(["N", "E", "S", "W"] as const).map((label, i) => {
        const rad = (i * 90 - 90) * DEG;
        const r = c - 36;
        return (
          <text
            key={label}
            x={c + r * Math.cos(rad)}
            y={c + r * Math.sin(rad) + 6}
            textAnchor="middle"
            fontSize={17}
            fontWeight={700}
            fill={label === "N" ? "#dc2626" : "#334155"}
          >
            {label}
          </text>
        );
      })}
      <g transform={`rotate(${rotation} ${c} ${c})`} style={{ transition: live ? "none" : "transform .4s ease" }}>
        <polygon
          points={`${c},${c - (c - 58)} ${c - 11},${c + 14} ${c},${c + 4} ${c + 11},${c + 14}`}
          fill="#059669"
          stroke="#047857"
          strokeWidth={1}
        />
        <text x={c} y={c - (c - 50)} textAnchor="middle" fontSize={20} aria-hidden>
          🕋
        </text>
      </g>
      <circle cx={c} cy={c} r={5} fill="var(--indigo, #4f46e5)" />
    </svg>
  );
}

export default function QiblaDirectionTool() {
  const [location, setLocation] = useState<LocationValue>(DEFAULT_LOCATION);
  const [liveMode, setLiveMode] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [liveMsg, setLiveMsg] = useState("");
  const cleanupRef = useRef<(() => void) | null>(null);

  const bearing = useMemo(() => qiblaBearing(location.lat, location.lng), [location]);
  const distance = useMemo(() => distanceToKaabaKm(location.lat, location.lng), [location]);

  const orientationSupported =
    typeof window !== "undefined" && "DeviceOrientationEvent" in window;

  function stopLive() {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setLiveMode(false);
    setHeading(null);
    setLiveMsg("");
  }

  async function startLive() {
    if (!orientationSupported) {
      setLiveMsg("Device orientation is not available on this device — use the static bearing with a physical compass.");
      return;
    }
    // iOS 13+ requires an explicit permission request from a user gesture.
    const DOE = DeviceOrientationEvent as DOEConstructorWithPermission;
    if (typeof DOE.requestPermission === "function") {
      try {
        const res = await DOE.requestPermission();
        if (res !== "granted") {
          setLiveMsg("Motion/orientation permission was denied. Showing static bearing — use a physical compass to face the direction shown.");
          return;
        }
      } catch {
        setLiveMsg("Could not request orientation permission. Showing static bearing only.");
        return;
      }
    }
    let gotReading = false;
    const handler = (e: DeviceOrientationEvent) => {
      const we = e as OrientationEventWithWebkit;
      let h: number | null = null;
      if (typeof we.webkitCompassHeading === "number" && Number.isFinite(we.webkitCompassHeading)) {
        h = we.webkitCompassHeading; // iOS: already a compass heading
      } else if (e.alpha !== null && Number.isFinite(e.alpha)) {
        h = (360 - e.alpha) % 360; // absolute alpha: 0 = North
      }
      if (h !== null) {
        gotReading = true;
        setHeading(h);
      }
    };
    const eventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(eventName, handler as EventListener, true);
    cleanupRef.current = () => window.removeEventListener(eventName, handler as EventListener, true);
    setLiveMode(true);
    setLiveMsg("");
    setTimeout(() => {
      if (!gotReading) {
        setLiveMsg("No compass readings received — your device may not have a compass sensor. Use the static bearing with a physical compass.");
      }
    }, 3000);
  }

  useEffect(() => () => cleanupRef.current?.(), []);

  const rotation = liveMode && heading !== null ? bearing - heading : bearing;
  const roundedBearing = Math.round(bearing);

  return (
    <ToolPageLayout
      title="Qibla Direction Finder"
      description="Find the exact direction of the Kaaba in Makkah from anywhere, using the great-circle bearing formula — entirely in your browser."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <Card>
        <LocationPicker value={location} onChange={setLocation} />

        <div style={{ textAlign: "center", margin: "1.2rem 0" }}>
          <CompassRose rotation={rotation} live={liveMode && heading !== null} />
          <p style={{ fontSize: "1.15rem", marginTop: ".8rem" }}>
            Qibla is <strong style={{ color: "var(--indigo)" }}>{roundedBearing}° from North</strong>{" "}
            (roughly {directionWord(bearing)})
          </p>
          <p style={{ fontSize: ".88rem", color: "var(--muted)" }}>
            Distance to the Kaaba: <strong>{Math.round(distance).toLocaleString("en-IN")} km</strong>
          </p>
          {liveMode && heading !== null && (
            <p style={{ fontSize: ".85rem", color: "#059669", marginTop: ".3rem" }}>
              Live compass active — device heading {Math.round(heading)}°. Rotate until the green arrow points straight up.
            </p>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: ".7rem", flexWrap: "wrap" }}>
          {!liveMode ? (
            <button type="button" className="btn-primary sm" onClick={startLive}>
              🧭 Start live compass (mobile)
            </button>
          ) : (
            <button type="button" className="btn-secondary sm" onClick={stopLive}>
              Stop live compass
            </button>
          )}
        </div>
        {liveMsg && (
          <p style={{ color: "#b45309", fontSize: ".85rem", textAlign: "center", marginTop: ".7rem" }}>
            {liveMsg}
          </p>
        )}

        <p style={{ marginTop: "1.3rem", fontSize: ".82rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
          In static mode, hold a physical compass flat, find {roundedBearing}° and face that direction.
          Live compass mode works on most mobile devices (on iOS you will be asked for motion &amp;
          orientation permission). Magnetic interference and sensor calibration can affect live
          readings — the numeric bearing is always the reliable reference.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
