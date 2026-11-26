/**
 * Daily summaries + "phone not syncing" checks. Call once a day (crontab on the VPS):
 *   30 21 * * * curl -s -X POST -H "Authorization: Bearer $UNSCROLL_CRON_SECRET" https://www.aivexallp.com/api/unscroll/cron/daily
 * (21:30 server time; the summary covers the family's previous full day.)
 */
import { NextResponse } from "next/server";
import { q } from "@/lib/unscroll/db";
import { createAlert } from "@/lib/unscroll/alerts";
import { pushToChild } from "@/lib/unscroll/push";
import { addDays, dayKeyIn, fmtDuration } from "@/lib/unscroll/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.UNSCROLL_CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const children = await q<{ id: string; name: string; family_id: string; time_zone: string; last_sync_at: Date | null }>(
    `SELECT c.id, c.name, c.family_id, f.time_zone, d.last_sync_at
     FROM unscroll_children c JOIN unscroll_families f ON f.id = c.family_id
     LEFT JOIN LATERAL (SELECT last_sync_at FROM unscroll_devices WHERE child_id = c.id AND revoked_at IS NULL ORDER BY created_at DESC LIMIT 1) d ON true`);
  let summaries = 0, stale = 0;
  for (const c of children) {
    const today = dayKeyIn(c.time_zone);
    const day = addDays(today, -1);
    const rows = await q<{ day_key: string; total_ms: string; apps: Array<{ label: string; foregroundMs: number }> }>(
      `SELECT day_key, total_ms, apps FROM unscroll_usage_days WHERE child_id = $1 AND day_key IN ($2, $3)`, [c.id, day, addDays(day, -1)]);
    const y = rows.find(r => r.day_key === day);
    const before = rows.find(r => r.day_key !== day);
    if (y) {
      const total = Number(y.total_ms);
      const top = [...(y.apps ?? [])].sort((a, b) => b.foregroundMs - a.foregroundMs)[0];
      const diff = before ? total - Number(before.total_ms) : null;
      const less = diff !== null && diff < 0;
      const title = less ? `${c.name} used the phone less yesterday` : `${c.name}'s screen time yesterday`;
      const body = diff === null
        ? `${fmtDuration(total)} in total${top ? `, most on ${top.label} (${fmtDuration(top.foregroundMs)})` : ""}.`
        : less
          ? `${fmtDuration(total)} — ${fmtDuration(-diff)} less than the day before. That's good progress, tell them well done!`
          : `${fmtDuration(total)} — ${fmtDuration(diff)} more than the day before${top ? `. Most time on ${top.label} (${fmtDuration(top.foregroundMs)}); consider a limit for it` : ""}.`;
      if (await createAlert({ familyId: c.family_id, childId: c.id, kind: "daily_summary", title, body, dedupeKey: `summary:${c.id}:${day}` })) summaries++;
      if (less) void pushToChild(c.id, { title: "Well done!", body: `You used your phone ${fmtDuration(-diff!)} less yesterday. Keep it up!`, data: { type: "encouragement" } });
    }
    if (c.last_sync_at && Date.now() - new Date(c.last_sync_at).getTime() > 24 * 60 * 60_000) {
      if (await createAlert({ familyId: c.family_id, childId: c.id, kind: "device_not_syncing", title: `${c.name}'s phone hasn't synced for a day`,
        body: "The phone may be off, offline, or Unscroll may have been stopped.", dedupeKey: `nosync:${c.id}:${today}` })) stale++;
    }
  }
  return NextResponse.json({ ok: true, children: children.length, summaries, stale });
}
