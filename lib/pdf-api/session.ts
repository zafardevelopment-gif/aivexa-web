/**
 * AIVEXA PDF API — dashboard session helper (server side).
 * Reads the Supabase access token sent by the dashboard, returns the user,
 * and makes sure the user's PDF API profile exists and is up to date
 * (monthly credit reset, paid-plan expiry).
 */

import { NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ensurePdfUser, refreshUser } from "@/lib/pdf-api/api-keys";

export async function getSessionUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get("authorization");
  const accessToken =
    (authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null) ||
    req.cookies.get("sb-access-token")?.value ||
    req.headers.get("x-supabase-auth") ||
    null;
  if (!accessToken) return null;

  const db = supabaseAdmin();
  if (!db) return null;

  const { data, error } = await db.auth.getUser(accessToken);
  if (error || !data?.user) return null;

  await ensurePdfUser(data.user.id, data.user.email ?? "");
  await refreshUser(data.user.id);
  return data.user;
}
