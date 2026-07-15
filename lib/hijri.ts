export const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

export type HijriDate = { day: number; month: number; year: number };
export type GregorianDate = { day: number; month: number; year: number };

function gregorianToJDN(g: GregorianDate): number {
  const { year: y, month: m, day: d } = g;
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

function jdnToGregorian(jdn: number): GregorianDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { day, month, year };
}

const HIJRI_EPOCH = 1948440;

function hijriToJDN(h: HijriDate): number {
  const { year: y, month: m, day: d } = h;
  return (
    d +
    Math.ceil(29.5 * (m - 1)) +
    (y - 1) * 354 +
    Math.floor((3 + 11 * y) / 30) +
    HIJRI_EPOCH -
    1
  );
}

function jdnToHijri(jdn: number): HijriDate {
  const daysSinceEpoch = jdn - HIJRI_EPOCH;
  let year = Math.floor((30 * daysSinceEpoch + 10646) / 10631);
  let startOfYear = hijriToJDN({ year, month: 1, day: 1 });
  if (startOfYear > jdn) {
    year -= 1;
    startOfYear = hijriToJDN({ year, month: 1, day: 1 });
  }
  let month = 1;
  let day = jdn - startOfYear + 1;
  while (true) {
    const monthLength = hijriMonthLength(year, month);
    if (day <= monthLength) break;
    day -= monthLength;
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return { day, month, year };
}

function hijriMonthLength(year: number, month: number): number {
  const startThis = hijriToJDN({ year, month, day: 1 });
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const startNext = hijriToJDN({ year: nextYear, month: nextMonth, day: 1 });
  return startNext - startThis;
}

export function gregorianToHijri(g: GregorianDate): HijriDate {
  return jdnToHijri(gregorianToJDN(g));
}

export function hijriToGregorian(h: HijriDate): GregorianDate {
  return jdnToGregorian(hijriToJDN(h));
}

export function hijriMonthName(month: number): string {
  return HIJRI_MONTHS[month - 1] ?? "";
}
