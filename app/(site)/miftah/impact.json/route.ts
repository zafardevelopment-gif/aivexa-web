import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Public, read-only: the Miftah app reads this on its Premium screen to show
// the Qur'an-education fund. Edited from Admin › App Analytics › Miftah.
export const revalidate = 300; // refresh at most every 5 minutes

const FALLBACK = {
  updated: "2026-10-07",
  currency: "INR",
  collected: 1000,
  share_percent: 20,
  pledged: 200,
  donated: 200,
  recipient: { name: "Al-Mahad Lil Tahfizul Quran", address: "Doghra, Darbhanga, Bihar, India 847302" },
  donations: [{ date: "2026-10-07", amount: 200 }],
};

export async function GET() {
  let data: unknown = FALLBACK;
  try {
    const db = supabaseAdmin();
    if (db) {
      const { data: row } = await db.from("miftah_impact").select("data").eq("id", 1).maybeSingle();
      if (row?.data) data = row.data;
    }
  } catch {
    // keep fallback
  }
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
  });
}
