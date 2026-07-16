"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ADMIN_COOKIE, makeToken, verifyToken } from "@/lib/admin-auth";
import { PAGE_TYPE_LABELS } from "@/lib/analytics";

// Tables the admin panel is allowed to touch via the generic actions.
const TABLES = new Set([
  "aivexa_settings",
  "aivexa_products",
  "aivexa_steps",
  "aivexa_why",
  "aivexa_stats",
  "aivexa_testimonials",
  "aivexa_pages",
  "aivexa_messages",
]);

type Row = Record<string, unknown>;

export interface LoginState {
  ok: boolean;
  error: string;
}

async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const userId = String(formData.get("user_id") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!userId || !password) {
    return { ok: false, error: "User ID aur password dono bharein." };
  }

  const db = supabaseAdmin();
  if (!db) {
    return {
      ok: false,
      error:
        "SUPABASE_SERVICE_ROLE_KEY .env.local mein set nahi hai — Project Settings > API se copy karke daalein, phir server restart karein.",
    };
  }

  const { data, error } = await db
    .from("aivexa_users")
    .select("user_id, password")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data || data.password !== password) {
    return { ok: false, error: "Galat user ID ya password." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, makeToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return { ok: true, error: "" };
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

interface ListResult {
  data: Row[];
  error: string;
}

export async function adminList(
  table: string,
  orderBy: string,
  ascending = true
): Promise<ListResult> {
  if (!(await isAdmin())) return { data: [], error: "Not signed in." };
  if (!TABLES.has(table)) return { data: [], error: "Unknown table." };
  const db = supabaseAdmin();
  if (!db) return { data: [], error: "SUPABASE_SERVICE_ROLE_KEY missing in .env.local." };
  const { data, error } = await db.from(table).select("*").order(orderBy, { ascending });
  return { data: data ?? [], error: error?.message ?? "" };
}

export async function adminSave(
  table: string,
  pk: string,
  payload: Row,
  pkValue: string | number | null
): Promise<{ error: string }> {
  if (!(await isAdmin())) return { error: "Not signed in." };
  if (!TABLES.has(table)) return { error: "Unknown table." };
  const db = supabaseAdmin();
  if (!db) return { error: "SUPABASE_SERVICE_ROLE_KEY missing in .env.local." };
  const { error } =
    pkValue === null
      ? await db.from(table).insert(payload)
      : await db.from(table).update(payload).eq(pk, pkValue);
  if (!error) revalidatePath("/", "layout"); // refresh the whole site immediately
  return { error: error?.message ?? "" };
}

export async function adminDelete(
  table: string,
  pk: string,
  pkValue: string | number
): Promise<{ error: string }> {
  if (!(await isAdmin())) return { error: "Not signed in." };
  if (!TABLES.has(table)) return { error: "Unknown table." };
  const db = supabaseAdmin();
  if (!db) return { error: "SUPABASE_SERVICE_ROLE_KEY missing in .env.local." };
  const { error } = await db.from(table).delete().eq(pk, pkValue);
  if (!error) revalidatePath("/", "layout"); // refresh the whole site immediately
  return { error: error?.message ?? "" };
}

export async function getDashboard(): Promise<{
  counts: Record<string, number>;
  recent: Row[];
  error: string;
}> {
  if (!(await isAdmin())) return { counts: {}, recent: [], error: "Not signed in." };
  const db = supabaseAdmin();
  if (!db) return { counts: {}, recent: [], error: "SUPABASE_SERVICE_ROLE_KEY missing in .env.local." };

  const countTables = [
    "aivexa_messages",
    "aivexa_products",
    "aivexa_testimonials",
    "aivexa_pages",
  ];
  const counts: Record<string, number> = {};
  await Promise.all(
    countTables.map(async (table) => {
      const { count } = await db.from(table).select("*", { count: "exact", head: true });
      counts[table] = count ?? 0;
    })
  );
  const { data, error } = await db
    .from("aivexa_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  return { counts, recent: data ?? [], error: error?.message ?? "" };
}

interface PageviewRow {
  path: string;
  page_type: string;
  page_key: string;
  referrer: string;
  visitor_id: string;
  created_at: string;
  device_type: string;
  browser: string;
  os: string;
  country: string;
  region: string;
  city: string;
}

export interface AnalyticsResult {
  error: string;
  days: number;
  totalViews: number;
  uniqueVisitors: number;
  byType: { type: string; label: string; count: number }[];
  topPages: { pageKey: string; pageType: string; count: number }[];
  byDevice: { label: string; count: number }[];
  byLocation: { label: string; count: number }[];
  recent: PageviewRow[];
}

const EMPTY_ANALYTICS: Omit<AnalyticsResult, "error" | "days"> = {
  totalViews: 0,
  uniqueVisitors: 0,
  byType: [],
  topPages: [],
  byDevice: [],
  byLocation: [],
  recent: [],
};

// days = 0 means "Today" — see the since-date logic below.
export async function getAnalytics(days = 0): Promise<AnalyticsResult> {
  if (!(await isAdmin())) return { ...EMPTY_ANALYTICS, days, error: "Not signed in." };
  const db = supabaseAdmin();
  if (!db) {
    return {
      ...EMPTY_ANALYTICS,
      days,
      error: "SUPABASE_SERVICE_ROLE_KEY missing in .env.local.",
    };
  }

  // days === 0 means "Today" — since midnight, rather than a rolling 24h window.
  const since =
    days === 0
      ? new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      : new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await db
    .from("aivexa_pageviews")
    .select(
      "path, page_type, page_key, referrer, visitor_id, created_at, device_type, browser, os, country, region, city"
    )
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) return { ...EMPTY_ANALYTICS, days, error: error.message };

  const rows = (data ?? []) as PageviewRow[];

  const uniqueVisitors = new Set(rows.map((r) => r.visitor_id).filter(Boolean)).size;

  const typeCounts = new Map<string, number>();
  const pageCounts = new Map<string, { pageKey: string; pageType: string; count: number }>();
  const deviceCounts = new Map<string, number>();
  const locationCounts = new Map<string, number>();

  for (const row of rows) {
    typeCounts.set(row.page_type, (typeCounts.get(row.page_type) ?? 0) + 1);
    const key = `${row.page_type}::${row.page_key}`;
    const existing = pageCounts.get(key);
    if (existing) existing.count += 1;
    else pageCounts.set(key, { pageKey: row.page_key, pageType: row.page_type, count: 1 });

    const deviceLabel = [row.device_type, row.os, row.browser].filter(Boolean).join(" · ") || "Unknown";
    deviceCounts.set(deviceLabel, (deviceCounts.get(deviceLabel) ?? 0) + 1);

    const locationLabel = [row.city, row.region, row.country].filter(Boolean).join(", ") || "Unknown";
    locationCounts.set(locationLabel, (locationCounts.get(locationLabel) ?? 0) + 1);
  }

  const byType = Array.from(typeCounts.entries())
    .map(([type, count]) => ({ type, label: PAGE_TYPE_LABELS[type] ?? type, count }))
    .sort((a, b) => b.count - a.count);

  const topPages = Array.from(pageCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const byDevice = Array.from(deviceCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const byLocation = Array.from(locationCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return {
    error: "",
    days,
    totalViews: rows.length,
    uniqueVisitors,
    byType,
    topPages,
    byDevice,
    byLocation,
    recent: rows.slice(0, 60),
  };
}
