"use server";

import { supabase } from "@/lib/supabase";

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
