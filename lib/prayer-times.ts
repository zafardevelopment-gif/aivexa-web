// Prayer time calculation using standard astronomical solar-position formulas
// (solar declination + equation of time from the Julian date). Pure TypeScript,
// runs entirely in the browser. Based on the well-known algorithm popularised
// by PrayTimes.org.

export type MethodKey = "MWL" | "ISNA" | "Egyptian" | "UmmAlQura" | "Karachi";

export type MethodDef = {
  name: string;
  fajrAngle: number;
  ishaAngle?: number;
  /** Umm al-Qura style: Isha is a fixed interval after Maghrib. */
  ishaMinutesAfterMaghrib?: number;
};

export const METHODS: Record<MethodKey, MethodDef> = {
  MWL: { name: "Muslim World League (18° / 17°)", fajrAngle: 18, ishaAngle: 17 },
  ISNA: { name: "ISNA — North America (15° / 15°)", fajrAngle: 15, ishaAngle: 15 },
  Egyptian: { name: "Egyptian General Authority (19.5° / 17.5°)", fajrAngle: 19.5, ishaAngle: 17.5 },
  UmmAlQura: { name: "Umm al-Qura, Makkah (18.5°, Isha = Maghrib + 90 min)", fajrAngle: 18.5, ishaMinutesAfterMaghrib: 90 },
  Karachi: { name: "Univ. of Islamic Sciences, Karachi (18° / 18°)", fajrAngle: 18, ishaAngle: 18 },
};

export const METHOD_KEYS: MethodKey[] = ["MWL", "ISNA", "Egyptian", "UmmAlQura", "Karachi"];

/** 1 = Standard (Shafi'i, Maliki, Hanbali); 2 = Hanafi. */
export type AsrFactor = 1 | 2;

export type PrayerTimesResult = {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
};

export const PRAYER_ORDER: { key: keyof PrayerTimesResult; label: string }[] = [
  { key: "fajr", label: "Fajr" },
  { key: "sunrise", label: "Sunrise" },
  { key: "dhuhr", label: "Dhuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
];

const DEG = Math.PI / 180;
const dSin = (d: number) => Math.sin(d * DEG);
const dCos = (d: number) => Math.cos(d * DEG);
const dTan = (d: number) => Math.tan(d * DEG);
const dArcSin = (x: number) => Math.asin(x) / DEG;
const dArcCos = (x: number) => Math.acos(x) / DEG;
const dArcTan2 = (y: number, x: number) => Math.atan2(y, x) / DEG;
const dArcCot = (x: number) => Math.atan(1 / x) / DEG;

function fixAngle(a: number): number {
  a %= 360;
  return a < 0 ? a + 360 : a;
}
function fixHour(h: number): number {
  h %= 24;
  return h < 0 ? h + 24 : h;
}

/** Julian day number for a Gregorian calendar date (at 0h UT). */
export function julianDate(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

/** Solar declination (deg) and equation of time (hours) for a Julian date. */
function sunPosition(jd: number): { declination: number; equation: number } {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * dSin(g) + 0.02 * dSin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const declination = dArcSin(dSin(e) * dSin(L));
  const RA = fixHour(dArcTan2(dCos(e) * dSin(L), dCos(L)) / 15);
  const equation = q / 15 - RA;
  return { declination, equation };
}

export function computePrayerTimes(
  date: { year: number; month: number; day: number },
  lat: number,
  lng: number,
  tzHours: number,
  method: MethodKey,
  asrFactor: AsrFactor
): PrayerTimesResult {
  const invalid: PrayerTimesResult = {
    fajr: NaN, sunrise: NaN, dhuhr: NaN, asr: NaN, maghrib: NaN, isha: NaN,
  };
  if (
    !Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(tzHours) ||
    Math.abs(lat) > 66 || Math.abs(lng) > 180
  ) {
    // Above ~66° twilight-angle formulas break down (midnight sun / polar night).
    return invalid;
  }

  const def = METHODS[method];
  // Bake longitude into the Julian date so intermediate times are local solar times.
  const jDate = julianDate(date.year, date.month, date.day) - lng / (15 * 24);

  const midDay = (time: number): number => {
    const eqt = sunPosition(jDate + time).equation;
    return fixHour(12 - eqt);
  };

  /** Time of day at which the sun reaches `angle` degrees below the horizon. */
  const sunAngleTime = (angle: number, time: number, ccw: boolean): number => {
    const decl = sunPosition(jDate + time).declination;
    const noon = midDay(time);
    const cosArg =
      (-dSin(angle) - dSin(decl) * dSin(lat)) / (dCos(decl) * dCos(lat));
    if (cosArg < -1 || cosArg > 1) return NaN;
    const t = dArcCos(cosArg) / 15;
    return noon + (ccw ? -t : t);
  };

  const asrTime = (factor: number, time: number): number => {
    const decl = sunPosition(jDate + time).declination;
    const angle = -dArcCot(factor + dTan(Math.abs(lat - decl)));
    return sunAngleTime(angle, time, false);
  };

  // Initial guesses (day fractions), refined over a few iterations.
  let fajr = 5 / 24;
  let sunrise = 6 / 24;
  let dhuhr = 12 / 24;
  let asr = 13 / 24;
  let maghrib = 18 / 24;
  let isha = 18 / 24;

  for (let i = 0; i < 3; i++) {
    fajr = sunAngleTime(def.fajrAngle, fajr, true) / 24;
    sunrise = sunAngleTime(0.833, sunrise, true) / 24;
    dhuhr = midDay(dhuhr) / 24;
    asr = asrTime(asrFactor, asr) / 24;
    maghrib = sunAngleTime(0.833, maghrib, false) / 24;
    isha = def.ishaAngle !== undefined ? sunAngleTime(def.ishaAngle, isha, false) / 24 : maghrib;
  }

  // Convert local solar time -> local civil time for the given timezone.
  const adjust = tzHours - lng / 15;
  const out: PrayerTimesResult = {
    fajr: fajr * 24 + adjust,
    sunrise: sunrise * 24 + adjust,
    dhuhr: dhuhr * 24 + adjust,
    asr: asr * 24 + adjust,
    maghrib: maghrib * 24 + adjust,
    isha:
      def.ishaMinutesAfterMaghrib !== undefined
        ? maghrib * 24 + adjust + def.ishaMinutesAfterMaghrib / 60
        : isha * 24 + adjust,
  };
  (Object.keys(out) as (keyof PrayerTimesResult)[]).forEach((k) => {
    out[k] = Number.isFinite(out[k]) ? fixHour(out[k]) : NaN;
  });
  return out;
}

/** Format decimal hours as "5:23 AM". Returns "—" for NaN. */
export function formatTime12(hours: number): string {
  if (!Number.isFinite(hours)) return "—";
  const totalMin = Math.round(fixHour(hours) * 60) % (24 * 60);
  let h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Minutes since local midnight for a decimal-hours value. */
export function toMinutesOfDay(hours: number): number {
  return Math.round(fixHour(hours) * 60);
}
