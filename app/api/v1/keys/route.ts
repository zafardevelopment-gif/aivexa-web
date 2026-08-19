/**
 * AIVEXA PDF API — API Key Management Endpoints
 * GET  /api/v1/keys  — list user's keys (requires session auth, not API key)
 * POST /api/v1/keys  — create a new key
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateApiKey, hashKey } from "@/lib/pdf-api/api-keys";
import { createClient } from "@supabase/supabase-js";

// Helper: get logged-in user from cookie-based session
async function getSessionUser(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const accessToken = req.cookies.get("sb-access-token")?.value
    ?? req.headers.get("x-supabase-auth") ?? null;

  if (!accessToken) return null;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data: { user } } = await client.auth.getUser();
  return user;
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const { data, error } = await db
    .from("pdfapi_api_keys")
    .select("id, name, key_prefix, key_hint, is_test, is_active, last_used_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch keys" }, { status: 500 });

  return NextResponse.json({ keys: data });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  let body: { name?: string; isTest?: boolean };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  // Max 5 keys per user
  const { count } = await db
    .from("pdfapi_api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_active", true);

  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "Maximum 5 active API keys allowed" }, { status: 400 });
  }

  const isTest = body.isTest ?? false;
  const { key, hint } = generateApiKey(isTest);
  const keyHash = hashKey(key);
  const prefix = isTest ? "avx_pdf_test_" : "avx_pdf_live_";

  const { data, error } = await db
    .from("pdfapi_api_keys")
    .insert({
      user_id: user.id,
      name: body.name ?? (isTest ? "Test Key" : "Production Key"),
      key_prefix: prefix,
      key_hash: keyHash,
      key_hint: hint,
      is_test: isTest,
      is_active: true,
    })
    .select("id, name, key_prefix, key_hint, is_test, created_at")
    .single();

  if (error) return NextResponse.json({ error: "Failed to create key" }, { status: 500 });

  // Return the plaintext key ONCE — it's never stored
  return NextResponse.json({
    key: { ...data, full_key: key },
    warning: "Save this key now. It will not be shown again.",
  }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const keyId = searchParams.get("id");
  if (!keyId) return NextResponse.json({ error: "Key ID required" }, { status: 400 });

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  await db
    .from("pdfapi_api_keys")
    .update({ is_active: false })
    .eq("id", keyId)
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
