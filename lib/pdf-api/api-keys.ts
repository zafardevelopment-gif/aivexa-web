/**
 * AIVEXA PDF API — API Key System
 * Generates, hashes, and validates API keys.
 *
 * Key format:
 *   avx_pdf_live_<32 random chars>   (production)
 *   avx_pdf_test_<32 random chars>   (test mode)
 *
 * Only the SHA-256 hash is stored in the database.
 * The plaintext key is shown ONCE at creation time.
 */

import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ── Key generation ────────────────────────────────────────────

export function generateApiKey(isTest = false): { key: string; hint: string } {
  const randomPart = crypto.randomBytes(24).toString("base64url");
  const prefix = isTest ? "avx_pdf_test_" : "avx_pdf_live_";
  const key = `${prefix}${randomPart}`;
  const hint = key.slice(-4);
  return { key, hint };
}

export function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

// ── Unique request ID ─────────────────────────────────────────

export function generateRequestId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `req_${ts}${rand}`;
}

export function generateJobId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `job_${ts}${rand}`;
}

// ── Validation ────────────────────────────────────────────────

export type ValidatedKey = {
  userId: string;
  keyId: number;
  isTest: boolean;
  planId: string;
  creditsUsed: number;
  credits: number;        // plan limit
  rateLimit: number;      // rpm
  parallel: number;       // concurrent conversions
  maxPdfBytes: number;
};

export type KeyValidationError =
  | "MISSING_KEY"
  | "INVALID_KEY_FORMAT"
  | "KEY_NOT_FOUND"
  | "KEY_REVOKED"
  | "ACCOUNT_SUSPENDED"
  | "QUOTA_EXCEEDED";

export async function validateApiKey(
  authHeader: string | null
): Promise<{ ok: true; data: ValidatedKey } | { ok: false; error: KeyValidationError }> {
  if (!authHeader) return { ok: false, error: "MISSING_KEY" };

  // Accept both "Bearer avx_pdf_live_xxx" and raw key
  const raw = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  const db = supabaseAdmin();
  if (!db) return { ok: false, error: "KEY_NOT_FOUND" };

  if (!raw.startsWith("avx_pdf_live_") && !raw.startsWith("avx_pdf_test_")) {
    // Dashboard Playground: accept a logged-in Supabase session token (JWT)
    if (raw.split(".").length === 3) return validateSessionToken(db, raw);
    return { ok: false, error: "INVALID_KEY_FORMAT" };
  }

  const hash = hashKey(raw);

  // Reset the monthly counter / expire old paid plan before checking quota
  const { data: ownerRow } = await db
    .from("pdfapi_api_keys").select("user_id").eq("key_hash", hash).maybeSingle();
  if (ownerRow?.user_id) await refreshUser(ownerRow.user_id);

  // Join api_key → user → plan in one query
  const { data: keyRow, error } = await db
    .from("pdfapi_api_keys")
    .select(`
      id, user_id, is_test, is_active,
      pdfapi_users!inner (
        plan_id, credits_used, is_active,
        pdfapi_plans!inner (
          credits, rate_limit_rpm, max_pdf_bytes, parallel
        )
      )
    `)
    .eq("key_hash", hash)
    .single();

  if (error || !keyRow) return { ok: false, error: "KEY_NOT_FOUND" };
  if (!keyRow.is_active) return { ok: false, error: "KEY_REVOKED" };

  const user = (keyRow.pdfapi_users as unknown) as Record<string, unknown>;
  if (!user.is_active) return { ok: false, error: "ACCOUNT_SUSPENDED" };

  const plan = (user.pdfapi_plans as unknown) as Record<string, unknown>;
  const creditsUsed = user.credits_used as number;
  const credits = plan.credits as number;

  if (creditsUsed >= credits) return { ok: false, error: "QUOTA_EXCEEDED" };

  // Update last_used_at (fire and forget)
  db.from("pdfapi_api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", keyRow.id)
    .then(() => {});

  return {
    ok: true,
    data: {
      userId: keyRow.user_id,
      keyId: keyRow.id,
      isTest: keyRow.is_test,
      planId: user.plan_id as string,
      creditsUsed,
      credits,
      rateLimit: plan.rate_limit_rpm as number,
      maxPdfBytes: plan.max_pdf_bytes as number,
      parallel: (plan.parallel as number) || 1,
    },
  };
}

// ── Account helpers ──────────────────────────────────────────

/** Resets the monthly credit counter when the period is over and expires old paid plans. */
export async function refreshUser(userId: string): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;
  await db.rpc("pdfapi_refresh_user", { p_user_id: userId });
}

/** Creates the PDF API profile if this auth user does not have one yet. */
export async function ensurePdfUser(userId: string, email: string): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;
  await db.from("pdfapi_users").upsert(
    { id: userId, email, full_name: email.split("@")[0] },
    { onConflict: "id", ignoreDuplicates: true }
  );
}

// ── Session (Playground) validation ───────────────────────────

async function validateSessionToken(
  db: NonNullable<ReturnType<typeof supabaseAdmin>>,
  token: string
): Promise<{ ok: true; data: ValidatedKey } | { ok: false; error: KeyValidationError }> {
  const { data: authData, error: authErr } = await db.auth.getUser(token);
  if (authErr || !authData?.user) return { ok: false, error: "KEY_NOT_FOUND" };
  await ensurePdfUser(authData.user.id, authData.user.email ?? "");
  await refreshUser(authData.user.id);

  const { data: userRow, error } = await db
    .from("pdfapi_users")
    .select(`plan_id, credits_used, is_active, pdfapi_plans!inner ( credits, rate_limit_rpm, max_pdf_bytes, parallel )`)
    .eq("id", authData.user.id)
    .single();

  if (error || !userRow) return { ok: false, error: "KEY_NOT_FOUND" };
  if (!userRow.is_active) return { ok: false, error: "ACCOUNT_SUSPENDED" };

  const plan = (userRow.pdfapi_plans as unknown) as Record<string, unknown>;
  const creditsUsed = userRow.credits_used as number;
  const credits = plan.credits as number;
  if (creditsUsed >= credits) return { ok: false, error: "QUOTA_EXCEEDED" };

  return {
    ok: true,
    data: {
      userId: authData.user.id,
      keyId: 0, // no API key — playground session
      isTest: false,
      planId: userRow.plan_id as string,
      creditsUsed,
      credits,
      rateLimit: plan.rate_limit_rpm as number,
      maxPdfBytes: plan.max_pdf_bytes as number,
      parallel: (plan.parallel as number) || 1,
    },
  };
}

// ── Increment usage ───────────────────────────────────────────

/** 1 credit per started 5 MB of output (a 12 MB PDF = 3 credits). */
export function creditsFor(bytes: number): number {
  return Math.max(1, Math.ceil(bytes / (5 * 1024 * 1024)));
}

export async function incrementUsage(userId: string, credits = 1): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;
  if (credits <= 1) await db.rpc("pdfapi_increment_credits", { p_user_id: userId });
  else await db.rpc("pdfapi_increment_credits_by", { p_user_id: userId, p_n: credits });
}

// ── Log request ───────────────────────────────────────────────

export type RequestLogData = {
  requestId: string;
  userId: string;
  apiKeyId: number;
  endpoint: string;
  isTest: boolean;
  status: "completed" | "failed";
  errorCode?: string;
  errorMessage?: string;
  inputType?: "html" | "url";
  inputSizeBytes?: number;
  outputSizeBytes?: number;
  pdfPages?: number;
  responseMs?: number;
  pdfGenMs?: number;
  creditsUsed?: number;
  ipAddress?: string;
  userAgent?: string;
};

export async function logRequest(data: RequestLogData): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;

  await db.from("pdfapi_requests").insert({
    request_id: data.requestId,
    user_id: data.userId,
    api_key_id: data.apiKeyId || null,
    endpoint: data.endpoint,
    is_test: data.isTest,
    status: data.status,
    error_code: data.errorCode ?? null,
    error_message: data.errorMessage ?? null,
    input_type: data.inputType ?? null,
    input_size_bytes: data.inputSizeBytes ?? null,
    output_size_bytes: data.outputSizeBytes ?? null,
    pdf_pages: data.pdfPages ?? null,
    response_ms: data.responseMs ?? null,
    pdf_gen_ms: data.pdfGenMs ?? null,
    credits_used: data.creditsUsed ?? 1,
    ip_address: data.ipAddress ?? null,
    user_agent: data.userAgent ?? null,
  });
}
