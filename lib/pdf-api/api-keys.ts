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

  if (!raw.startsWith("avx_pdf_live_") && !raw.startsWith("avx_pdf_test_")) {
    return { ok: false, error: "INVALID_KEY_FORMAT" };
  }

  const db = supabaseAdmin();
  if (!db) return { ok: false, error: "KEY_NOT_FOUND" };

  const hash = hashKey(raw);

  // Join api_key → user → plan in one query
  const { data: keyRow, error } = await db
    .from("pdfapi_api_keys")
    .select(`
      id, user_id, is_test, is_active,
      pdfapi_users!inner (
        plan_id, credits_used, is_active,
        pdfapi_plans!inner (
          credits, rate_limit_rpm, max_pdf_bytes
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
    },
  };
}

// ── Increment usage ───────────────────────────────────────────

export async function incrementUsage(userId: string): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;
  await db.rpc("pdfapi_increment_credits", { p_user_id: userId });
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
    api_key_id: data.apiKeyId,
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
