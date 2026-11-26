"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";
import { q as unscrollQ } from "@/lib/unscroll/db";
import { currentPrices as unscrollCurrentPrices, savePrices as unscrollSavePrices, PLANS as UNSCROLL_PLANS, type PlanKey as UnscrollPlanKey } from "@/lib/unscroll/billing";

// ─────────────────────────────────────────────────────────────────────
// App Analytics for the admin panel: CALIVO AI (live from the CALIVO
// Supabase project) and Miftah (installs + Qur'an-education fund).
// ─────────────────────────────────────────────────────────────────────

async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

// CALIVO lives in its own Supabase project. Set in Vercel:
//   CALIVO_SUPABASE_URL, CALIVO_SUPABASE_SERVICE_KEY  (server-only)
let calivoClient: SupabaseClient | null | undefined;
function calivoDb(): SupabaseClient | null {
  if (calivoClient !== undefined) return calivoClient;
  const url = process.env.CALIVO_SUPABASE_URL;
  const key = process.env.CALIVO_SUPABASE_SERVICE_KEY;
  calivoClient = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return calivoClient;
}

export interface AppMetric {
  installs: number;
  installs_as_of: string | null;
  notes: string | null;
}

export interface CalivoStats {
  error: string;
  configured: boolean;
  totalUsers: number;
  signupsToday: number;
  signups7d: number;
  signups30d: number;
  activeUsers7d: number;
  activeToday: number;
  activeYesterday: number;
  active30d: number;
  activeTracking: boolean; // false until calivo_daily_active exists
  dailyActive: { date: string; count: number }[];
  opensByHour: number[]; // 24 buckets, IST, last 7 days
  todayActivity: { email: string; first: string; last: string; opens: number }[];
  premiumActive: number;
  premiumMonthly: number;
  premiumYearly: number;
  estMonthlyRevenue: number;
  daily: { date: string; count: number }[];
  recent: { email: string; created_at: string }[];
  metric: AppMetric;
}

export interface MiftahImpact {
  updated: string;
  currency: string;
  collected: number;
  share_percent: number;
  pledged: number;
  donated: number;
  recipient: { name: string; address: string };
  donations: { date: string; amount: number }[];
}

export interface MiftahStats {
  error: string;
  metric: AppMetric;
  impact: MiftahImpact | null;
}

const EMPTY_METRIC: AppMetric = { installs: 0, installs_as_of: null, notes: null };

async function getMetric(app: string): Promise<AppMetric> {
  const db = supabaseAdmin();
  if (!db) return EMPTY_METRIC;
  const { data } = await db.from("app_metrics").select("installs, installs_as_of, notes").eq("app", app).maybeSingle();
  return (data as AppMetric | null) ?? EMPTY_METRIC;
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getCalivoStats(): Promise<CalivoStats> {
  const base: CalivoStats = {
    error: "",
    configured: false,
    totalUsers: 0,
    signupsToday: 0,
    signups7d: 0,
    signups30d: 0,
    activeUsers7d: 0,
    activeToday: 0,
    activeYesterday: 0,
    active30d: 0,
    activeTracking: false,
    dailyActive: [],
    opensByHour: [],
    todayActivity: [],
    premiumActive: 0,
    premiumMonthly: 0,
    premiumYearly: 0,
    estMonthlyRevenue: 0,
    daily: [],
    recent: [],
    metric: EMPTY_METRIC,
  };
  if (!(await isAdmin())) return { ...base, error: "Not authorised" };
  base.metric = await getMetric("calivo");

  const db = calivoDb();
  if (!db) {
    return {
      ...base,
      error: "Add CALIVO_SUPABASE_URL and CALIVO_SUPABASE_SERVICE_KEY in Vercel to see live CALIVO numbers.",
    };
  }
  base.configured = true;

  try {
    const now = new Date();
    const since30 = new Date(now.getTime() - 30 * 86400000);
    const since7 = new Date(now.getTime() - 7 * 86400000);
    const today = new Date(now.toISOString().slice(0, 10) + "T00:00:00Z");

    const [{ count: total }, users30, recent, subs, meals7, dau, opens] = await Promise.all([
      db.from("calivo_users").select("id", { count: "exact", head: true }),
      db.from("calivo_users").select("created_at").gte("created_at", since30.toISOString()),
      db.from("calivo_users").select("email, created_at").order("created_at", { ascending: false }).limit(15),
      db.from("calivo_subscriptions").select("plan, status"),
      db.from("calivo_meals").select("user_id").gte("logged_at", since7.toISOString()).limit(20000),
      // One row per user per (IST) day the app was opened — written by the backend.
      db.from("calivo_daily_active").select("user_id, day").gte("day", isoDay(since30)).limit(50000),
      db.from("calivo_app_opens").select("user_id, at").gte("at", since7.toISOString()).order("at").limit(50000),
    ]);

    // When people open the app (IST).
    const openRows = (opens.data as { user_id: string; at: string }[] | null) ?? [];
    const opensByHour = new Array(24).fill(0) as number[];
    const istHour = (iso: string) => new Date(new Date(iso).getTime() + 5.5 * 3600000).getUTCHours();
    for (const o of openRows) opensByHour[istHour(o.at)]++;

    const dauRows = (dau.data as { user_id: string; day: string }[] | null) ?? [];
    const tracking = !dau.error;
    // Days are stored in IST.
    const istDay = (d: Date) => new Date(d.getTime() + 5.5 * 3600000).toISOString().slice(0, 10);
    const todayIst = istDay(now);
    const yesterdayIst = istDay(new Date(now.getTime() - 86400000));
    const since7Ist = istDay(since7);
    const byDay = new Map<string, Set<string>>();
    for (const r of dauRows) {
      if (!byDay.has(r.day)) byDay.set(r.day, new Set());
      byDay.get(r.day)!.add(r.user_id);
    }
    const dailyActive: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = istDay(new Date(now.getTime() - i * 86400000));
      dailyActive.push({ date: d, count: byDay.get(d)?.size ?? 0 });
    }

    const created = ((users30.data as { created_at: string }[] | null) ?? []).map((u) => new Date(u.created_at));
    const daily: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = isoDay(d);
      daily.push({ date: key, count: created.filter((c) => isoDay(c) === key).length });
    }

    const todayOpens = openRows.filter((o) => istDay(new Date(o.at)) === todayIst);
    const perUser = new Map<string, { first: string; last: string; opens: number }>();
    for (const o of todayOpens) {
      const e = perUser.get(o.user_id);
      if (!e) perUser.set(o.user_id, { first: o.at, last: o.at, opens: 1 });
      else {
        e.last = o.at;
        e.opens++;
      }
    }
    let todayActivity: CalivoStats["todayActivity"] = [];
    if (perUser.size) {
      const { data: us } = await db.from("calivo_users").select("id, email").in("id", Array.from(perUser.keys()));
      const emails = new Map(((us as { id: string; email: string }[] | null) ?? []).map((u) => [u.id, u.email]));
      todayActivity = Array.from(perUser.entries())
        .map(([id, v]) => ({ email: emails.get(id) ?? id.slice(0, 8), ...v }))
        .sort((a, b) => (a.last < b.last ? 1 : -1));
    }

    const active = ((subs.data as { plan: string; status: string }[] | null) ?? []).filter((s) => s.status === "active");
    const monthly = active.filter((s) => s.plan === "monthly").length;
    const yearly = active.filter((s) => s.plan === "yearly").length;
    const activeUsers = new Set(((meals7.data as { user_id: string }[] | null) ?? []).map((m) => m.user_id)).size;

    return {
      ...base,
      totalUsers: total ?? 0,
      signupsToday: created.filter((c) => c >= today).length,
      signups7d: created.filter((c) => c >= since7).length,
      signups30d: created.length,
      activeUsers7d: tracking
        ? new Set(dauRows.filter((r) => r.day >= since7Ist).map((r) => r.user_id)).size
        : activeUsers,
      activeToday: byDay.get(todayIst)?.size ?? 0,
      activeYesterday: byDay.get(yesterdayIst)?.size ?? 0,
      active30d: new Set(dauRows.map((r) => r.user_id)).size,
      activeTracking: tracking,
      dailyActive,
      opensByHour,
      todayActivity,
      premiumActive: active.length,
      premiumMonthly: monthly,
      premiumYearly: yearly,
      // ₹199/month and ₹1,499/year (shown monthly).
      estMonthlyRevenue: Math.round(monthly * 199 + (yearly * 1499) / 12),
      daily,
      recent: (recent.data as { email: string; created_at: string }[] | null) ?? [],
    };
  } catch (e) {
    return { ...base, error: e instanceof Error ? e.message : "Could not load CALIVO data" };
  }
}

export async function getMiftahStats(): Promise<MiftahStats> {
  if (!(await isAdmin())) return { error: "Not authorised", metric: EMPTY_METRIC, impact: null };
  const db = supabaseAdmin();
  if (!db) return { error: "Supabase not configured", metric: EMPTY_METRIC, impact: null };
  const [metric, { data, error }] = await Promise.all([
    getMetric("miftah"),
    db.from("miftah_impact").select("data").eq("id", 1).maybeSingle(),
  ]);
  return {
    error: error ? `${error.message} — run supabase/migrations/003_app_analytics.sql once.` : "",
    metric,
    impact: (data?.data as MiftahImpact | undefined) ?? null,
  };
}

export async function saveAppMetric(app: string, installs: number, asOf: string, notes: string): Promise<string> {
  if (!(await isAdmin())) return "Not authorised";
  const db = supabaseAdmin();
  if (!db) return "Supabase not configured";
  const { error } = await db.from("app_metrics").upsert({
    app,
    installs: Math.max(0, Math.round(installs || 0)),
    installs_as_of: asOf || null,
    notes: notes || null,
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/admin/app-analytics");
  return error ? error.message : "";
}

export async function saveMiftahImpact(impact: MiftahImpact): Promise<string> {
  if (!(await isAdmin())) return "Not authorised";
  const db = supabaseAdmin();
  if (!db) return "Supabase not configured";
  const clean: MiftahImpact = {
    ...impact,
    currency: impact.currency || "INR",
    collected: Number(impact.collected) || 0,
    share_percent: Number(impact.share_percent) || 0,
    pledged: Number(impact.pledged) || 0,
    donated: Number(impact.donated) || 0,
    donations: (impact.donations || [])
      .filter((d) => d.date && Number(d.amount) > 0)
      .map((d) => ({ date: d.date, amount: Number(d.amount) })),
    updated: new Date().toISOString().slice(0, 10),
  };
  const { error } = await db
    .from("miftah_impact")
    .upsert({ id: 1, data: clean, updated_at: new Date().toISOString() });
  revalidatePath("/admin/app-analytics");
  revalidatePath("/miftah/impact.json");
  return error ? error.message : "";
}

// ─────────────────────── Website traffic per app ───────────────────────

export interface CountRow {
  label: string;
  count: number;
}

export interface AppTraffic {
  error: string;
  days: number;
  views: number;
  visitors: number;
  daily: { date: string; views: number; visitors: number }[];
  topPages: CountRow[];
  referrers: CountRow[];
  devices: CountRow[];
  os: CountRow[];
  countries: CountRow[];
  cities: CountRow[];
  byHour: number[]; // 24 buckets, IST
  recent: { at: string; page: string; source: string; place: string; device: string }[];
}

type PvRow = {
  path: string;
  referrer: string | null;
  visitor_id: string | null;
  created_at: string;
  device_type: string | null;
  os: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
};

function top(map: Map<string, number>, n = 10): CountRow[] {
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function referrerLabel(ref: string | null): string {
  if (!ref) return "Direct / app / WhatsApp";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host.includes("aivexallp.com")) return "Internal (aivexallp.com)";
    if (host.includes("google.")) return "Google Search";
    if (host.includes("bing.")) return "Bing";
    if (host.includes("facebook.") || host === "l.facebook.com" || host === "m.facebook.com") return "Facebook";
    if (host.includes("instagram.")) return "Instagram";
    if (host.includes("whatsapp.") || host === "wa.me") return "WhatsApp";
    if (host.includes("youtube.")) return "YouTube";
    if (host.includes("t.co") || host.includes("twitter.") || host.includes("x.com")) return "X / Twitter";
    if (host.includes("chatgpt.") || host.includes("openai.")) return "ChatGPT";
    if (host.includes("perplexity.")) return "Perplexity";
    return host;
  } catch {
    return "Other";
  }
}

/** Traffic to an app's pages on aivexallp.com (/calivo…, /miftah…, its blog). */
export async function getAppTraffic(app: "calivo" | "miftah" | "unscroll", days = 30): Promise<AppTraffic> {
  const empty: AppTraffic = {
    error: "",
    days,
    views: 0,
    visitors: 0,
    daily: [],
    topPages: [],
    referrers: [],
    devices: [],
    os: [],
    countries: [],
    cities: [],
    byHour: [],
    recent: [],
  };
  if (!(await isAdmin())) return { ...empty, error: "Not authorised" };
  const db = supabaseAdmin();
  if (!db) return { ...empty, error: "Supabase not configured" };

  const since =
    days === 0
      ? new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      : new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await db
    .from("aivexa_pageviews")
    .select("path, referrer, visitor_id, created_at, device_type, os, country, region, city")
    .ilike("path", `%${app}%`)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(20000);
  if (error) return { ...empty, error: error.message };

  const rows = (data ?? []) as PvRow[];
  const pages = new Map<string, number>();
  const refs = new Map<string, number>();
  const devices = new Map<string, number>();
  const oses = new Map<string, number>();
  const countries = new Map<string, number>();
  const cities = new Map<string, number>();
  const dayViews = new Map<string, number>();
  const dayVisitors = new Map<string, Set<string>>();
  const byHour = new Array(24).fill(0) as number[];

  for (const r of rows) {
    byHour[new Date(new Date(r.created_at).getTime() + 5.5 * 3600000).getUTCHours()]++;
    bump(pages, r.path.split("?")[0]);
    bump(refs, referrerLabel(r.referrer));
    bump(devices, r.device_type || "Unknown");
    bump(oses, r.os || "Unknown");
    bump(countries, r.country || "Unknown");
    bump(cities, [r.city, r.region].filter(Boolean).join(", ") || "Unknown");
    const d = r.created_at.slice(0, 10);
    bump(dayViews, d);
    if (!dayVisitors.has(d)) dayVisitors.set(d, new Set());
    if (r.visitor_id) dayVisitors.get(d)!.add(r.visitor_id);
  }

  const span = days === 0 ? 1 : days;
  const daily: AppTraffic["daily"] = [];
  for (let i = span - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    daily.push({ date: d, views: dayViews.get(d) ?? 0, visitors: dayVisitors.get(d)?.size ?? 0 });
  }

  return {
    error: "",
    days,
    views: rows.length,
    visitors: new Set(rows.map((r) => r.visitor_id).filter(Boolean)).size,
    daily,
    topPages: top(pages, 15),
    referrers: top(refs, 12),
    devices: top(devices, 6),
    os: top(oses, 6),
    countries: top(countries, 10),
    cities: top(cities, 12),
    byHour,
    recent: rows.slice(0, 60).map((r) => ({
      at: r.created_at,
      page: r.path.split("?")[0],
      source: referrerLabel(r.referrer),
      place: [r.city, r.region, r.country].filter(Boolean).join(", ") || "—",
      device: [r.device_type, r.os].filter(Boolean).join(" · ") || "—",
    })),
  };
}


// ───────────────────────────── Unscroll (VPS PostgreSQL) ─────────────────────────────

export interface UnscrollStats {
  error: string;
  configured: boolean;
  activeToday: number;
  activeYesterday: number;
  active7d: number;
  active30d: number;
  installsSeen: number;
  dailyActive: { date: string; count: number }[];
  opensByHour: number[]; // 24 buckets, IST, last 7 days
  modes: { label: string; count: number }[]; // last 30 days
  versions: { label: string; count: number }[]; // last 7 days
  parents: number;
  signupsToday: number;
  signups7d: number;
  signups30d: number;
  families: number;
  children: number;
  devicesPaired: number;
  devicesSynced24h: number;
  pushTokens: number;
  requests30d: number;
  requestsApproved30d: number;
  requestsPending: number;
  alerts7d: number;
  dailySignups: { date: string; count: number }[];
  recent: { email: string; created_at: string; children: number }[];
  metric: AppMetric;
}

const IST_TODAY = "(now() AT TIME ZONE 'Asia/Kolkata')::date";

export async function getUnscrollStats(): Promise<UnscrollStats> {
  const base: UnscrollStats = {
    error: "", configured: false,
    activeToday: 0, activeYesterday: 0, active7d: 0, active30d: 0, installsSeen: 0,
    dailyActive: [], opensByHour: [], modes: [], versions: [],
    parents: 0, signupsToday: 0, signups7d: 0, signups30d: 0, families: 0, children: 0,
    devicesPaired: 0, devicesSynced24h: 0, pushTokens: 0,
    requests30d: 0, requestsApproved30d: 0, requestsPending: 0, alerts7d: 0,
    dailySignups: [], recent: [], metric: EMPTY_METRIC,
  };
  if (!(await isAdmin())) return { ...base, error: "Not authorised" };
  base.metric = await getMetric("unscroll");
  if (!process.env.UNSCROLL_DATABASE_URL) {
    return { ...base, error: "UNSCROLL_DATABASE_URL is not set in .env.local on the server." };
  }
  base.configured = true;
  const n = (v: unknown) => Number(v ?? 0);
  try {
    const [act] = await unscrollQ<Record<string, string>>(`
      SELECT
        count(DISTINCT install_id) FILTER (WHERE day = ${IST_TODAY})            AS today,
        count(DISTINCT install_id) FILTER (WHERE day = ${IST_TODAY} - 1)        AS yesterday,
        count(DISTINCT install_id) FILTER (WHERE day > ${IST_TODAY} - 7)        AS d7,
        count(DISTINCT install_id) FILTER (WHERE day > ${IST_TODAY} - 30)       AS d30,
        count(DISTINCT install_id)                                              AS seen
      FROM unscroll_daily_active`);
    const daily = await unscrollQ<{ d: string; c: string }>(`
      SELECT to_char(g::date, 'YYYY-MM-DD') AS d, count(DISTINCT a.install_id) AS c
      FROM generate_series(${IST_TODAY} - 29, ${IST_TODAY}, interval '1 day') g
      LEFT JOIN unscroll_daily_active a ON a.day = g::date
      GROUP BY g ORDER BY g`);
    const hours = await unscrollQ<{ h: string; c: string }>(`
      SELECT extract(hour FROM opened_at AT TIME ZONE 'Asia/Kolkata')::int AS h, count(*) AS c
      FROM unscroll_app_opens WHERE opened_at > now() - interval '7 days' GROUP BY 1`);
    const modes = await unscrollQ<{ label: string; c: string }>(`
      SELECT mode AS label, count(DISTINCT install_id) AS c FROM unscroll_daily_active
      WHERE day > ${IST_TODAY} - 30 GROUP BY mode ORDER BY 2 DESC`);
    const versions = await unscrollQ<{ label: string; c: string }>(`
      SELECT coalesce(app_version, 'unknown') AS label, count(DISTINCT install_id) AS c FROM unscroll_daily_active
      WHERE day > ${IST_TODAY} - 7 GROUP BY 1 ORDER BY 2 DESC LIMIT 6`);
    const [acc] = await unscrollQ<Record<string, string>>(`
      SELECT
        (SELECT count(*) FROM unscroll_users)                                                        AS parents,
        (SELECT count(*) FROM unscroll_users WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata') AS today,
        (SELECT count(*) FROM unscroll_users WHERE created_at > now() - interval '7 days')            AS d7,
        (SELECT count(*) FROM unscroll_users WHERE created_at > now() - interval '30 days')           AS d30,
        (SELECT count(*) FROM unscroll_families)                                                     AS families,
        (SELECT count(*) FROM unscroll_children)                                                     AS children,
        (SELECT count(*) FROM unscroll_devices WHERE revoked_at IS NULL)                             AS paired,
        (SELECT count(*) FROM unscroll_devices WHERE revoked_at IS NULL AND last_sync_at > now() - interval '24 hours') AS synced,
        (SELECT count(*) FROM unscroll_push_tokens)                                                  AS tokens,
        (SELECT count(*) FROM unscroll_extra_time_requests WHERE created_at > now() - interval '30 days') AS req30,
        (SELECT count(*) FROM unscroll_extra_time_requests WHERE created_at > now() - interval '30 days' AND status = 'approved') AS appr30,
        (SELECT count(*) FROM unscroll_extra_time_requests WHERE status = 'pending')                 AS pending,
        (SELECT count(*) FROM unscroll_alerts WHERE created_at > now() - interval '7 days')           AS alerts7`);
    const signups = await unscrollQ<{ d: string; c: string }>(`
      SELECT to_char(g::date, 'YYYY-MM-DD') AS d, count(u.id) AS c
      FROM generate_series(${IST_TODAY} - 29, ${IST_TODAY}, interval '1 day') g
      LEFT JOIN unscroll_users u ON (u.created_at AT TIME ZONE 'Asia/Kolkata')::date = g::date
      GROUP BY g ORDER BY g`);
    const recent = await unscrollQ<{ email: string; created_at: Date; children: string }>(`
      SELECT u.email, u.created_at,
        (SELECT count(*) FROM unscroll_children c WHERE c.family_id = u.family_id) AS children
      FROM unscroll_users u ORDER BY u.created_at DESC LIMIT 12`);

    const byHour = new Array(24).fill(0) as number[];
    for (const r of hours) byHour[n(r.h)] = n(r.c);
    const modeName: Record<string, string> = { individual: "Self (own phone)", parent: "Parent", child: "Child phone" };
    return {
      ...base,
      activeToday: n(act?.today), activeYesterday: n(act?.yesterday), active7d: n(act?.d7), active30d: n(act?.d30),
      installsSeen: n(act?.seen),
      dailyActive: daily.map((r) => ({ date: r.d, count: n(r.c) })),
      opensByHour: byHour,
      modes: modes.map((r) => ({ label: modeName[r.label] ?? r.label, count: n(r.c) })),
      versions: versions.map((r) => ({ label: r.label, count: n(r.c) })),
      parents: n(acc?.parents), signupsToday: n(acc?.today), signups7d: n(acc?.d7), signups30d: n(acc?.d30),
      families: n(acc?.families), children: n(acc?.children),
      devicesPaired: n(acc?.paired), devicesSynced24h: n(acc?.synced), pushTokens: n(acc?.tokens),
      requests30d: n(acc?.req30), requestsApproved30d: n(acc?.appr30), requestsPending: n(acc?.pending), alerts7d: n(acc?.alerts7),
      dailySignups: signups.map((r) => ({ date: r.d, count: n(r.c) })),
      recent: recent.map((r) => ({ email: r.email, created_at: new Date(r.created_at).toISOString(), children: n(r.children) })),
    };
  } catch (e) {
    return { ...base, error: `Unscroll database: ${e instanceof Error ? e.message : String(e)}` };
  }
}


export interface UnscrollPriceRow {
  key: string;
  name: string;
  rupees: number;
  defaultRupees: number;
}

/** Plan prices shown in the app (₹ incl. GST). */
export async function getUnscrollPrices(): Promise<{ error: string; rows: UnscrollPriceRow[]; revenue30d: number; payments30d: number }> {
  if (!(await isAdmin())) return { error: "Not authorised", rows: [], revenue30d: 0, payments30d: 0 };
  if (!process.env.UNSCROLL_DATABASE_URL) return { error: "UNSCROLL_DATABASE_URL is not set", rows: [], revenue30d: 0, payments30d: 0 };
  try {
    const prices = await unscrollCurrentPrices();
    const rows = (Object.keys(UNSCROLL_PLANS) as UnscrollPlanKey[]).map((key) => ({
      key, name: UNSCROLL_PLANS[key].name, rupees: prices[key] / 100, defaultRupees: UNSCROLL_PLANS[key].amount / 100,
    }));
    const [p] = await unscrollQ<{ total: string; n: string }>(
      `SELECT coalesce(sum(amount), 0) AS total, count(*) AS n FROM unscroll_payments WHERE created_at > now() - interval '30 days'`);
    return { error: "", rows, revenue30d: Number(p?.total ?? 0) / 100, payments30d: Number(p?.n ?? 0) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e), rows: [], revenue30d: 0, payments30d: 0 };
  }
}

export async function saveUnscrollPrices(rupees: Record<string, number>): Promise<string> {
  if (!(await isAdmin())) return "Not authorised";
  try {
    const paise: Record<string, number> = {};
    for (const [k, v] of Object.entries(rupees)) paise[k] = Math.round(Number(v) * 100);
    await unscrollSavePrices(paise as Partial<Record<UnscrollPlanKey, number>>);
    revalidatePath("/admin/app-analytics");
    return "";
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}
