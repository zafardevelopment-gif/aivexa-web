/**
 * AIVEXA PDF API — admin access.
 * Admins are the emails in PDFAPI_ADMIN_EMAILS (comma separated, server-side env);
 * default is the AIVEXA account.
 */
import { NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import { getSessionUser } from "@/lib/pdf-api/session";

export function adminEmails(): string[] {
  return (process.env.PDFAPI_ADMIN_EMAILS || "aivexallp@gmail.com")
    .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  return !!email && adminEmails().includes(email.toLowerCase());
}

/** Returns the signed-in admin, or null if the caller is not an admin. */
export async function requireAdmin(req: NextRequest): Promise<User | null> {
  const user = await getSessionUser(req);
  return user && isAdminEmail(user.email) ? user : null;
}
