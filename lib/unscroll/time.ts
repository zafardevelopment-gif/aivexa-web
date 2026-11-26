/** YYYY-MM-DD for `ms` in an IANA time zone. */
export function dayKeyIn(tz: string, ms = Date.now()): string {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(ms));
  const v = (t: string) => p.find(x => x.type === t)?.value ?? "";
  return `${v("year")}-${v("month")}-${v("day")}`;
}

export function addDays(dayKey: string, n: number): string {
  const d = new Date(`${dayKey}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function fmtDuration(ms: number): string {
  const m = Math.round(ms / 60_000);
  if (m < 60) return `${m}m`;
  return m % 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${Math.floor(m / 60)}h`;
}
