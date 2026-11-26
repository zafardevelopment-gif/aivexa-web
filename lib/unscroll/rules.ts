import { one, q } from "./db";
import { dayKeyIn } from "./time";

/** Mirrors RuleSet in the app (src/types/domain.ts). Stored as JSON. */
export interface RuleSet {
  mode: "soft" | "strict";
  dailyLimitMinutes: number | null;
  appLimits: Array<{ packageName: string; label: string; dailyLimitMinutes: number }>;
  schedules: unknown[];
  temporaryBlocks: Array<{ packageName: string; label: string; untilMs: number }>;
  bonusMinutes: Record<string, number>;
}

export const emptyRules = (): RuleSet => ({ mode: "strict", dailyLimitMinutes: null, appLimits: [], schedules: [], temporaryBlocks: [], bonusMinutes: {} });

/** Keeps only known fields with sane types, so a bad client can't store junk. */
export function sanitizeRules(input: unknown): RuleSet {
  const r = (input ?? {}) as Partial<RuleSet>;
  const num = (v: unknown, min: number, max: number) => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : null);
  return {
    mode: r.mode === "soft" ? "soft" : "strict",
    dailyLimitMinutes: num(r.dailyLimitMinutes, 1, 24 * 60),
    appLimits: (Array.isArray(r.appLimits) ? r.appLimits : []).slice(0, 200).flatMap(l =>
      l && typeof l.packageName === "string" && num(l.dailyLimitMinutes, 1, 24 * 60) !== null
        ? [{ packageName: l.packageName.slice(0, 200), label: String(l.label ?? l.packageName).slice(0, 100), dailyLimitMinutes: num(l.dailyLimitMinutes, 1, 24 * 60)! }]
        : []),
    schedules: (Array.isArray(r.schedules) ? r.schedules : []).slice(0, 50),
    temporaryBlocks: (Array.isArray(r.temporaryBlocks) ? r.temporaryBlocks : []).slice(0, 100).flatMap(b =>
      b && typeof b.packageName === "string" && typeof b.untilMs === "number"
        ? [{ packageName: b.packageName.slice(0, 200), label: String(b.label ?? b.packageName).slice(0, 100), untilMs: b.untilMs }]
        : []),
    bonusMinutes: Object.fromEntries(
      Object.entries(r.bonusMinutes && typeof r.bonusMinutes === "object" ? r.bonusMinutes : {})
        .flatMap(([k, v]) => (num(v, 0, 12 * 60) !== null ? [[k.slice(0, 200), num(v, 0, 12 * 60)!]] : []))
        .slice(0, 200),
    ),
  };
}

export async function familyTimeZone(familyId: string): Promise<string> {
  const f = await one<{ time_zone: string }>(`SELECT time_zone FROM unscroll_families WHERE id = $1`, [familyId]);
  return f?.time_zone || "Asia/Kolkata";
}

/** Rules for a child; bonus time from an earlier day is dropped. */
export async function loadRules(childId: string, familyId: string) {
  const row = await one<{ rules: RuleSet; bonus_day: string | null; updated_at: Date }>(
    `SELECT rules, bonus_day, updated_at FROM unscroll_rules WHERE child_id = $1`, [childId]);
  const today = dayKeyIn(await familyTimeZone(familyId));
  const rules = sanitizeRules(row?.rules ?? emptyRules());
  if (row?.bonus_day !== today) rules.bonusMinutes = {};
  rules.temporaryBlocks = rules.temporaryBlocks.filter(b => b.untilMs > Date.now());
  return { familyId, childId, rules, updatedAtMs: row ? new Date(row.updated_at).getTime() : 0, today };
}

export async function saveRules(childId: string, rules: RuleSet, bonusDay: string | null) {
  await q(
    `INSERT INTO unscroll_rules (child_id, rules, bonus_day, updated_at) VALUES ($1, $2, $3, now())
     ON CONFLICT (child_id) DO UPDATE SET rules = EXCLUDED.rules, bonus_day = EXCLUDED.bonus_day, updated_at = now()`,
    [childId, JSON.stringify(rules), bonusDay],
  );
}
