/**
 * AIVEXA PDF API — SSRF Protection
 *
 * Blocks requests to:
 *  - localhost / loopback
 *  - Private IP ranges (RFC 1918)
 *  - Link-local (169.254.x.x — AWS/GCP metadata)
 *  - IPv6 private ranges
 *  - Non-HTTP(S) schemes
 *
 * Must be called before any URL-to-PDF or URL-to-screenshot request.
 */

import { createHash } from "crypto";
import dns from "dns/promises";
import net from "net";

// Blocked CIDR ranges
const BLOCKED_CIDRS = [
  { base: "127.0.0.0",   mask: 8  },  // loopback
  { base: "10.0.0.0",    mask: 8  },  // RFC 1918
  { base: "172.16.0.0",  mask: 12 },  // RFC 1918
  { base: "192.168.0.0", mask: 16 },  // RFC 1918
  { base: "169.254.0.0", mask: 16 },  // link-local / metadata
  { base: "0.0.0.0",     mask: 8  },  // invalid
  { base: "100.64.0.0",  mask: 10 },  // shared address space
];

function ipToLong(ip: string): number {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0;
}

function cidrContains(ip: string, base: string, maskBits: number): boolean {
  const ipLong = ipToLong(ip);
  const baseLong = ipToLong(base);
  const mask = (0xffffffff << (32 - maskBits)) >>> 0;
  return (ipLong & mask) === (baseLong & mask);
}

function isPrivateIp(ip: string): boolean {
  if (!net.isIPv4(ip)) {
    // IPv6: block everything except public unicast for simplicity
    // Block ::1 (loopback), fc00::/7 (unique local), fe80::/10 (link-local)
    if (ip === "::1") return true;
    if (ip.toLowerCase().startsWith("fc") || ip.toLowerCase().startsWith("fd")) return true;
    if (ip.toLowerCase().startsWith("fe8") || ip.toLowerCase().startsWith("fe9")
      || ip.toLowerCase().startsWith("fea") || ip.toLowerCase().startsWith("feb")) return true;
    return false;
  }
  return BLOCKED_CIDRS.some(({ base, mask }) => cidrContains(ip, base, mask));
}

export type SSRFCheckResult =
  | { ok: true }
  | { ok: false; error: "INVALID_URL" | "BLOCKED_URL" | "URL_RESOLVE_FAILED" };

export async function checkUrl(rawUrl: string): Promise<SSRFCheckResult> {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false, error: "INVALID_URL" };
  }

  // Only allow HTTP and HTTPS
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "BLOCKED_URL" };
  }

  const hostname = parsed.hostname;

  // Block obvious local hostnames
  const blockedHostnames = [
    "localhost", "local", "internal", "intranet",
    "metadata.google.internal", "169.254.169.254",
  ];
  if (blockedHostnames.includes(hostname.toLowerCase())) {
    return { ok: false, error: "BLOCKED_URL" };
  }

  // Resolve DNS to check actual IP
  try {
    const addresses = await dns.resolve4(hostname).catch(() => []);
    const addresses6 = await dns.resolve6(hostname).catch(() => []);
    const all = [...addresses, ...addresses6];

    if (all.length === 0) {
      return { ok: false, error: "URL_RESOLVE_FAILED" };
    }

    for (const ip of all) {
      if (isPrivateIp(ip)) {
        return { ok: false, error: "BLOCKED_URL" };
      }
    }
  } catch {
    return { ok: false, error: "URL_RESOLVE_FAILED" };
  }

  return { ok: true };
}

// Input size limit (10 MB for HTML string)
export const MAX_HTML_BYTES = 10 * 1024 * 1024;

export function checkHtmlSize(html: string): boolean {
  return Buffer.byteLength(html, "utf8") <= MAX_HTML_BYTES;
}

// Fingerprint for dedup / idempotency (not security-sensitive)
export function inputFingerprint(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 16);
}
