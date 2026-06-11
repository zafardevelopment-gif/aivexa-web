"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ADMIN_COOKIE, makeToken, verifyToken } from "@/lib/admin-auth";

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
