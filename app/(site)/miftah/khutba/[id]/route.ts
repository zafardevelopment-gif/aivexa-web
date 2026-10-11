import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Public, read-only: one Juma khutba with its full Arabic text and
// translations, for the Miftah app.
export const revalidate = 300;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const { data } = await db
    .from("miftah_khutbas")
    .select("id, masjid, date, hijri, khateeb, khateeb_ar, title, arabic, translations, source_url")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
  });
}
