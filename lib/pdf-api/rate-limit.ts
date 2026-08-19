/**
 * AIVEXA PDF API — In-Memory Rate Limiter
 *
 * Simple sliding-window rate limiter using a Map.
 * Per API key, per minute.
 *
 * For production scale, replace with Redis-based limiter.
 * The interface is identical so swapping is a one-line change.
 */

type WindowEntry = {
  count: number;
  windowStart: number;
};

const store = new Map<string, WindowEntry>();

const WINDOW_MS = 60_000; // 1 minute

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > WINDOW_MS * 2) {
      store.delete(key);
    }
  }
}, 5 * 60_000);

export type RateLimitResult =
  | { ok: true; remaining: number; limit: number }
  | { ok: false; retryAfterMs: number; limit: number };

/**
 * Check and increment rate limit for a given key.
 * @param identifier - usually the API key ID or user ID
 * @param limitRpm   - max requests per minute for the user's plan
 */
export function checkRateLimit(
  identifier: string,
  limitRpm: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New window
    store.set(identifier, { count: 1, windowStart: now });
    return { ok: true, remaining: limitRpm - 1, limit: limitRpm };
  }

  if (entry.count >= limitRpm) {
    const retryAfterMs = WINDOW_MS - (now - entry.windowStart);
    return { ok: false, retryAfterMs, limit: limitRpm };
  }

  entry.count++;
  return { ok: true, remaining: limitRpm - entry.count, limit: limitRpm };
}
