"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";

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

    const [{ count: total }, users30, recent, subs, meals7] = await Promise.all([
      db.from("calivo_users").select("id", { count: "exact", head: true }),
      db.from("calivo_users").select("created_at").gte("created_at", since30.toISOString()),
      db.from("calivo_users").select("email, created_at").order("created_at", { ascending: false }).limit(15),
      db.from("calivo_subscriptions").select("plan, status"),
      db.from("calivo_meals").select("user_id").gte("logged_at", since7.toISOString()).limit(20000),
    ]);

    const created = ((users30.data as { created_at: string }[] | null) ?? []).map((u) => new Date(u.created_at));
    const daily: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = isoDay(d);
      daily.push({ date: key, count: created.filter((c) => isoDay(c) === key).length });
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
      activeUsers7d: activeUsers,
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
export async function getAppTraffic(app: "calivo" | "miftah", days = 30): Promise<AppTraffic> {
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

  for (const r of rows) {
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
  };
}
