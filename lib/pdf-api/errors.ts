/**
 * AIVEXA PDF API — Consistent Error Responses
 */

export type ApiErrorCode =
  | "MISSING_API_KEY"
  | "INVALID_API_KEY_FORMAT"
  | "INVALID_API_KEY"
  | "API_KEY_REVOKED"
  | "ACCOUNT_SUSPENDED"
  | "QUOTA_EXCEEDED"
  | "RATE_LIMIT_EXCEEDED"
  | "INVALID_HTML"
  | "INVALID_URL"
  | "BLOCKED_URL"
  | "URL_INACCESSIBLE"
  | "URL_RESOLVE_FAILED"
  | "HTML_TOO_LARGE"
  | "RENDERING_TIMEOUT"
  | "PDF_TOO_LARGE"
  | "BROWSER_ERROR"
  | "INVALID_REQUEST"
  | "INTERNAL_ERROR";

const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  MISSING_API_KEY: "No API key provided. Include Authorization: Bearer avx_pdf_live_xxx header.",
  INVALID_API_KEY_FORMAT: "API key format is invalid. Keys start with avx_pdf_live_ or avx_pdf_test_.",
  INVALID_API_KEY: "The API key is invalid or does not exist.",
  API_KEY_REVOKED: "This API key has been revoked. Create a new key in your dashboard.",
  ACCOUNT_SUSPENDED: "Your account has been suspended. Please contact support.",
  QUOTA_EXCEEDED: "Monthly PDF quota exceeded. Upgrade your plan to continue.",
  RATE_LIMIT_EXCEEDED: "Too many requests. Slow down and retry after the indicated time.",
  INVALID_HTML: "The provided HTML could not be parsed or rendered.",
  INVALID_URL: "The provided URL is not a valid HTTP or HTTPS URL.",
  BLOCKED_URL: "The URL points to a private or blocked address.",
  URL_INACCESSIBLE: "The URL could not be accessed by the renderer.",
  URL_RESOLVE_FAILED: "The URL hostname could not be resolved via DNS.",
  HTML_TOO_LARGE: "HTML payload exceeds the 10 MB limit.",
  RENDERING_TIMEOUT: "PDF rendering timed out. The page may be too complex.",
  PDF_TOO_LARGE: "Generated PDF exceeds the size limit for your plan.",
  BROWSER_ERROR: "The headless browser encountered an unexpected error.",
  INVALID_REQUEST: "The request body is missing required fields or contains invalid values.",
  INTERNAL_ERROR: "An unexpected server error occurred. Please try again.",
};

export function apiError(
  code: ApiErrorCode,
  requestId: string,
  extra?: Record<string, unknown>
): Response {
  const status = getHttpStatus(code);
  const body = {
    error: {
      code,
      message: ERROR_MESSAGES[code],
      request_id: requestId,
      ...extra,
    },
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Request-ID": requestId,
    },
  });
}

function getHttpStatus(code: ApiErrorCode): number {
  switch (code) {
    case "MISSING_API_KEY":
    case "INVALID_API_KEY_FORMAT":
    case "INVALID_API_KEY":
    case "API_KEY_REVOKED":
    case "ACCOUNT_SUSPENDED":
      return 401;
    case "QUOTA_EXCEEDED":
    case "RATE_LIMIT_EXCEEDED":
      return 429;
    case "INVALID_HTML":
    case "INVALID_URL":
    case "BLOCKED_URL":
    case "URL_INACCESSIBLE":
    case "URL_RESOLVE_FAILED":
    case "HTML_TOO_LARGE":
    case "INVALID_REQUEST":
      return 400;
    case "PDF_TOO_LARGE":
      return 413;
    case "RENDERING_TIMEOUT":
    case "BROWSER_ERROR":
    case "INTERNAL_ERROR":
      return 500;
    default:
      return 500;
  }
}
