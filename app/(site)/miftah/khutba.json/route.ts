import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Public, read-only list of Juma khutbas (Makkah & Madinah) for the Miftah
// app — summaries only; the full text is at /miftah/khutba/<id>.
// Added weekly from Admin › Miftah Khutba.
export const revalidate = 300;

export async function GET() {
  let khutbas: unknown[] = [];
  try {
    const db = supabaseAdmin();
    if (db) {
      const { data } = await db
        .from("miftah_khutbas")
        .select("id, masjid, date, hijri, khateeb, khateeb_ar, title, translations")
        .eq("published", true)
        .order("date", { ascending: false })
        .limit(120);
      khutbas = (data ?? []).map((r) => ({
        id: r.id,
        masjid: r.masjid,
        date: r.date,
        hijri: r.hijri,
        khateeb: r.khateeb,
        khateeb_ar: r.khateeb_ar,
        title: r.title ?? {},
        langs: Object.keys((r.translations as Record<string, string>) ?? {}),
      }));
    }
  } catch {
    // empty list
  }
  return NextResponse.json(
    { updated: new Date().toISOString(), khutbas },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
  );
}
