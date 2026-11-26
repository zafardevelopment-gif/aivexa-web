import { one } from "./db";
import { pushToFamily } from "./push";

export type AlertKind =
  | "limit_reached" | "extra_time_request" | "device_not_syncing" | "permission_removed" | "device_paired"
  | "daily_summary" | "prayer";

/**
 * Saves an alert for the parents and pushes it. `dedupeKey` makes it fire once
 * (e.g. one "YouTube limit reached" per child per day).
 */
export async function createAlert(a: {
  familyId: string; childId: string | null; kind: AlertKind; title: string; body: string; dedupeKey?: string;
}): Promise<boolean> {
  const row = await one<{ id: string }>(
    `INSERT INTO unscroll_alerts (family_id, child_id, kind, title, body, dedupe_key)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (dedupe_key) DO NOTHING RETURNING id`,
    [a.familyId, a.childId, a.kind, a.title, a.body, a.dedupeKey ?? null],
  );
  if (!row) return false;
  await pushToFamily(a.familyId, { title: a.title, body: a.body, data: { type: a.kind, childId: a.childId ?? "", alertId: row.id } });
  return true;
}
