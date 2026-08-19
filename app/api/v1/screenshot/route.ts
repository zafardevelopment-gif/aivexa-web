/**
 * AIVEXA PDF API — POST /api/v1/screenshot
 * Captures PNG or JPEG screenshot of HTML or URL.
 */

import { NextRequest } from "next/server";
import { validateApiKey, generateRequestId, logRequest, incrementUsage } from "@/lib/pdf-api/api-keys";
import { checkRateLimit } from "@/lib/pdf-api/rate-limit";
import { checkUrl, checkHtmlSize } from "@/lib/pdf-api/ssrf-guard";
import { generateScreenshot, ScreenshotRequestOptions } from "@/lib/pdf-api/pdf-engine";
import { apiError } from "@/lib/pdf-api/errors";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const startMs = Date.now();

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

  const { userId, keyId, isTest, rateLimit } = keyResult.data;

  const rl = checkRateLimit(`key_${keyId}`, rateLimit);
  if (!rl.ok) {
    return apiError("RATE_LIMIT_EXCEEDED", requestId, { retry_after_ms: rl.retryAfterMs });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return apiError("INVALID_REQUEST", requestId);
  }

  const { html, url } = body;

  if (!html && !url) return apiError("INVALID_REQUEST", requestId);

  if (html && typeof html === "string" && !checkHtmlSize(html)) {
    return apiError("HTML_TOO_LARGE", requestId);
  }

  if (url && typeof url === "string") {
    const ssrf = await checkUrl(url);
    if (!ssrf.ok) {
      const codeMap: Record<string, string> = {
        INVALID_URL: "INVALID_URL",
        BLOCKED_URL: "BLOCKED_URL",
        URL_RESOLVE_FAILED: "URL_RESOLVE_FAILED",
      };
      return apiError(codeMap[ssrf.error] as never ?? "INVALID_URL", requestId);
    }
  }

  const format = (body.format as "png" | "jpeg") ?? "png";

  const opts: ScreenshotRequestOptions = {
    html: typeof html === "string" ? html : undefined,
    url: typeof url === "string" ? url : undefined,
    format,
    fullPage: body.fullPage === true,
    viewportWidth: typeof body.viewportWidth === "number" ? body.viewportWidth : 1280,
    viewportHeight: typeof body.viewportHeight === "number" ? body.viewportHeight : 800,
    quality: typeof body.quality === "number" ? Math.min(Math.max(body.quality, 1), 100) : 90,
    waitUntil: (body.waitUntil as ScreenshotRequestOptions["waitUntil"]) ?? "networkidle0",
    delay: typeof body.delay === "number" ? Math.min(body.delay, 10_000) : 0,
    waitForSelector: typeof body.waitForSelector === "string" ? body.waitForSelector : undefined,
  };

  const genStart = Date.now();
  const result = await generateScreenshot(opts);
  const genMs = Date.now() - genStart;
  const responseMs = Date.now() - startMs;

  if (!result.ok) {
    await logRequest({
      requestId, userId, apiKeyId: keyId, endpoint: "/v1/screenshot", isTest,
      status: "failed",
      errorCode: result.error,
      inputType: url ? "url" : "html",
      responseMs, pdfGenMs: genMs,
    });
    const codeMap: Record<string, string> = {
      RENDERING_TIMEOUT: "RENDERING_TIMEOUT",
      BROWSER_ERROR: "BROWSER_ERROR",
      URL_INACCESSIBLE: "URL_INACCESSIBLE",
    };
    return apiError(codeMap[result.error] as never ?? "BROWSER_ERROR", requestId);
  }

  if (!isTest) await incrementUsage(userId);

  await logRequest({
    requestId, userId, apiKeyId: keyId, endpoint: "/v1/screenshot", isTest,
    status: "completed",
    inputType: url ? "url" : "html",
    outputSizeBytes: result.buffer.length,
    responseMs, pdfGenMs: genMs, creditsUsed: 1,
    ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";

  return new Response(result.buffer, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(result.buffer.length),
      "X-Request-ID": requestId,
      "X-Screenshot-Ms": String(genMs),
      "X-RateLimit-Limit": String(rateLimit),
      "X-RateLimit-Remaining": String(rl.remaining),
    },
  });
}
