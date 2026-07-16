"use server";

import { supabase } from "@/lib/supabase";
import { classifyPath } from "@/lib/analytics";

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
}): Promise<void> {
  const db = supabase();
  if (!db) return;

  const { pageType, pageKey } = classifyPath(input.path);

  await db.from("aivexa_pageviews").insert({
    path: input.path,
    page_type: pageType,
    page_key: pageKey,
    referrer: input.referrer.slice(0, 500),
    visitor_id: input.visitorId.slice(0, 100),
  });
}
