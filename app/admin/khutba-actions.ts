"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";

// ─────────────────────────────────────────────────────────────────────
// Miftah › Juma Khutba (Makkah & Madinah). The admin adds each Friday's
// khutba here; the app reads /miftah/khutba.json (list) and
// /miftah/khutba/<id> (full text). Table: supabase/migrations/004.
// ─────────────────────────────────────────────────────────────────────

export interface Khutba {
  id?: string;
  masjid: "makkah" | "madinah";
  date: string; // YYYY-MM-DD
  hijri: string;
  khateeb: string;
  khateeb_ar: string;
  title: Record<string, string>;
  arabic: string;
  translations: Record<string, string>;
  source_url: string;
  published: boolean;
}

async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

function cleanMap(m: Record<string, string> | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(m || {})) {
    const t = (v || "").trim();
    if (t) out[k] = t;
  }
  return out;
}

export async function listKhutbas(): Promise<{ error: string; rows: Khutba[] }> {
  if (!(await isAdmin())) return { error: "Not authorised", rows: [] };
  const db = supabaseAdmin();
  if (!db) return { error: "Supabase not configured", rows: [] };
  const { data, error } = await db
    .from("miftah_khutbas")
    .select("id, masjid, date, hijri, khateeb, khateeb_ar, title, arabic, translations, source_url, published")
    .order("date", { ascending: false })
    .limit(200);
  return { error: error?.message ?? "", rows: (data as Khutba[]) ?? [] };
}

export async function saveKhutba(k: Khutba): Promise<string> {
  if (!(await isAdmin())) return "Not authorised";
  const db = supabaseAdmin();
  if (!db) return "Supabase not configured";
  if (!k.date || !k.khateeb.trim() || !k.arabic.trim()) return "Date, khateeb and Arabic text are required";
  if (k.masjid !== "makkah" && k.masjid !== "madinah") return "Choose Makkah or Madinah";

  const row = {
    masjid: k.masjid,
    date: k.date,
    hijri: k.hijri.trim() || null,
    khateeb: k.khateeb.trim(),
    khateeb_ar: k.khateeb_ar.trim() || null,
    title: cleanMap(k.title),
    arabic: k.arabic.trim(),
    translations: cleanMap(k.translations),
    source_url: k.source_url.trim() || null,
    published: k.published,
    updated_at: new Date().toISOString(),
  };
  const { error } = k.id
    ? await db.from("miftah_khutbas").update(row).eq("id", k.id)
    : await db.from("miftah_khutbas").upsert(row, { onConflict: "masjid,date" });
  revalidatePath("/admin/khutba");
  revalidatePath("/miftah/khutba.json");
  return error ? error.message : "";
}

export async function deleteKhutba(id: string): Promise<string> {
  if (!(await isAdmin())) return "Not authorised";
  const db = supabaseAdmin();
  if (!db) return "Supabase not configured";
  const { error } = await db.from("miftah_khutbas").delete().eq("id", id);
  revalidatePath("/admin/khutba");
  revalidatePath("/miftah/khutba.json");
  return error ? error.message : "";
}
