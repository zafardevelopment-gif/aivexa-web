"use server";

import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";
import { classifyPath, parseUserAgent } from "@/lib/analytics";

export interface ContactState {
  ok: boolean;
  error: string;
}

export async function submitMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in your name, email and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const db = supabase();
  if (!db) {
    return {
      ok: false,
      error: "Messaging is not configured yet — please email us directly.",
    };
  }

  const { error } = await db
    .from("aivexa_messages")
    .insert({ name, email, phone, message });

  if (error) {
    return { ok: false, error: "Something went wrong — please try again." };
  }
  return { ok: true, error: "" };
}

/**
 * Logs one pageview. Called from components/Analytics.tsx on every route
 * change. Fails silently — analytics must never break page rendering.
 */
export async function logPageview(input: {
  path: string;
  referrer: string;
  visitorId: string;
  userAgent: string;
}): Promise<void> {
  const db = supabase();
  if (!db) return;

  const { pageType, pageKey } = classifyPath(input.path);
  const { deviceType, browser, os } = parseUserAgent(input.userAgent);

  // On Vercel the geo headers come for free. On the Hostinger VPS (nginx)
  // they don't exist, so fall back to an IP lookup of the visitor's IP.
  const h = await headers();
  let country = h.get("x-vercel-ip-country") ?? "";
  let region = h.get("x-vercel-ip-country-region") ?? "";
  let city = decodeCity(h.get("x-vercel-ip-city"));

  if (!country) {
    const geo = await lookupGeo(clientIp(h));
    if (geo) ({ country, region, city } = geo);
  }

  await db.from("aivexa_pageviews").insert({
    path: input.path,
    page_type: pageType,
    page_key: pageKey,
    referrer: input.referrer.slice(0, 500),
    visitor_id: input.visitorId.slice(0, 100),
    device_type: deviceType,
    browser,
    os,
    country,
    region,
    city,
  });
}

function decodeCity(raw: string | null): string {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

type Geo = { country: string; region: string; city: string };

const geoCache = new Map<string, { geo: Geo | null; at: number }>();
const GEO_TTL_MS = 24 * 60 * 60 * 1000;

function clientIp(h: Headers): string {
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (h.get("cf-connecting-ip") || h.get("x-real-ip") || fwd || "").trim();
}

function isPrivateIp(ip: string): boolean {
  return (
    !ip ||
    ip === "::1" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith("fc") ||
    ip.startsWith("fd") ||
    ip.startsWith("fe80")
  );
}

/** Free IP → location lookup (ipwho.is), cached in memory, 2s timeout. */
async function lookupGeo(rawIp: string): Promise<Geo | null> {
  const ip = rawIp.replace(/^::ffff:/, "");
  if (isPrivateIp(ip)) return null;

  const hit = geoCache.get(ip);
  if (hit && Date.now() - hit.at < GEO_TTL_MS) return hit.geo;

  let geo: Geo | null = null;
  try {
    const res = await fetch(
      `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code,region_code,region,city`,
      { signal: AbortSignal.timeout(2000), cache: "no-store" }
    );
    const j = await res.json();
    if (j?.success) {
      geo = {
        country: String(j.country_code ?? ""),
        region: String(j.region_code || j.region || ""),
        city: String(j.city ?? ""),
      };
    }
  } catch {
    // lookup failed — store nothing, analytics must never break
  }

  if (geoCache.size > 5000) geoCache.clear();
  geoCache.set(ip, { geo, at: Date.now() });
  return geo;
}
