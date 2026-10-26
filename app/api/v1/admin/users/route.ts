/** GET /api/v1/admin/users?q=&page= — all PDF API customers (admin only) */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/pdf-api/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

const PAGE = 50;

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const sp = new URL(req.url).searchParams;
  const q = (sp.get("q") ?? "").trim().slice(0, 100);
  const page = Math.max(1, parseInt(sp.get("page") ?? "1") || 1);

  const { data, error } = await db.rpc("pdfapi_admin_user_list", {
    p_search: q, p_limit: PAGE, p_offset: (page - 1) * PAGE,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []) as Record<string, unknown>[];
  return NextResponse.json({
    users: rows,
    total: rows.length ? Number(rows[0].total_count) : 0,
    page, pageSize: PAGE,
  });
}
