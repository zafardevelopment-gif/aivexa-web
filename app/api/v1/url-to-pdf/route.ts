/**
 * AIVEXA PDF API — POST /api/v1/url-to-pdf
 * Converts a public URL to PDF with SSRF protection.
 */

import { NextRequest } from "next/server";
import { validateApiKey, generateRequestId, logRequest, incrementUsage } from "@/lib/pdf-api/api-keys";
import { checkRateLimit } from "@/lib/pdf-api/rate-limit";
import { checkUrl } from "@/lib/pdf-api/ssrf-guard";
import { generatePdf, PdfRequestOptions } from "@/lib/pdf-api/pdf-engine";
import { apiError } from "@/lib/pdf-api/errors";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const startMs = Date.now();

  // ── Auth ───────────────────────────────────────────────────
  const auth = req.headers.get("authorization");
  const keyResult = await validateApiKey(auth);

  if (!keyResult.ok) {
    const codeMap: Record<string, string> = {
      MISSING_KEY: "MISSING_API_KEY",
      INVALID_KEY_FORMAT: "INVALID_API_KEY_FORMAT",
      KEY_NOT_FOUND: "INVALID_API_KEY",
      KEY_REVOKED: "API_KEY_REVOKED",
      ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED",
      QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
    };
    return apiError(codeMap[keyResult.error] as never ?? "INVALID_API_KEY", requestId);
  }

  const { userId, keyId, isTest, rateLimit, maxPdfBytes } = keyResult.data;

  // ── Rate limit ─────────────────────────────────────────────
  const rl = checkRateLimit(`key_${keyId}`, rateLimit);
  if (!rl.ok) {
    return apiError("RATE_LIMIT_EXCEEDED", requestId, { retry_after_ms: rl.retryAfterMs });
  }

  // ── Parse body ─────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return apiError("INVALID_REQUEST", requestId);
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return apiError("INVALID_REQUEST", requestId);
  }

  // ── SSRF check ─────────────────────────────────────────────
  const ssrf = await checkUrl(url);
  if (!ssrf.ok) {
    const codeMap: Record<string, string> = {
      INVALID_URL: "INVALID_URL",
      BLOCKED_URL: "BLOCKED_URL",
      URL_RESOLVE_FAILED: "URL_RESOLVE_FAILED",
    };
    return apiError(codeMap[ssrf.error] as never ?? "INVALID_URL", requestId);
  }

  // ── Generate PDF ───────────────────────────────────────────
  const opts: PdfRequestOptions = {
    url,
    format: (body.format as PdfRequestOptions["format"]) ?? "A4",
    orientation: (body.orientation as PdfRequestOptions["orientation"]) ?? "portrait",
    margin: (body.margin as PdfRequestOptions["margin"]) ?? {
      top: "10mm", right: "10mm", bottom: "10mm", left: "10mm",
    },
    printBackground: body.printBackground !== false,
    scale: typeof body.scale === "number" ? Math.min(Math.max(body.scale, 0.1), 2) : 1,
    displayHeaderFooter: !!body.displayHeaderFooter,
    headerTemplate: typeof body.headerTemplate === "string" ? body.headerTemplate : undefined,
    footerTemplate: typeof body.footerTemplate === "string" ? body.footerTemplate : undefined,
    waitForSelector: typeof body.waitForSelector === "string" ? body.waitForSelector : undefined,
    waitUntil: (body.waitUntil as PdfRequestOptions["waitUntil"]) ?? "networkidle0",
    delay: typeof body.delay === "number" ? Math.min(body.delay, 10_000) : 0,
  };

  const genStart = Date.now();
  const result = await generatePdf(opts);
  const pdfGenMs = Date.now() - genStart;
  const responseMs = Date.now() - startMs;

  if (!result.ok) {
    const codeMap: Record<string, string> = {
      RENDERING_TIMEOUT: "RENDERING_TIMEOUT",
      BROWSER_ERROR: "BROWSER_ERROR",
      URL_INACCESSIBLE: "URL_INACCESSIBLE",
    };
    await logRequest({
      requestId, userId, apiKeyId: keyId, endpoint: "/v1/url-to-pdf", isTest,
      status: "failed",
      errorCode: codeMap[result.error] ?? "BROWSER_ERROR",
      inputType: "url", responseMs, pdfGenMs,
    });
    return apiError(codeMap[result.error] as never ?? "BROWSER_ERROR", requestId);
  }

  if (result.buffer.length > maxPdfBytes) {
    return apiError("PDF_TOO_LARGE", requestId, {
      size_bytes: result.buffer.length,
      max_bytes: maxPdfBytes,
    });
  }

  if (!isTest) await incrementUsage(userId);

  await logRequest({
    requestId, userId, apiKeyId: keyId, endpoint: "/v1/url-to-pdf", isTest,
    status: "completed",
    inputType: "url",
    outputSizeBytes: result.buffer.length,
    responseMs, pdfGenMs, creditsUsed: 1,
    ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  const filename = typeof body.filename === "string"
    ? body.filename.replace(/[^a-zA-Z0-9._-]/g, "_")
    : "page.pdf";

  return new Response(new Uint8Array(result.buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(result.buffer.length),
      "X-Request-ID": requestId,
      "X-PDF-Generation-Ms": String(pdfGenMs),
      "X-RateLimit-Limit": String(rateLimit),
      "X-RateLimit-Remaining": String(rl.remaining),
    },
  });
}
