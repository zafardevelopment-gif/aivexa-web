/**
 * PDF API plans — read from the database (edited in Admin → PDF API Plans).
 * Falls back to the launch prices if the database is unreachable.
 */
import { supabaseAdmin } from "@/lib/supabase-admin";

export type PdfPlan = {
  id: string; name: string; price_monthly: number; price_yearly: number;
  credits: number; max_pdf_bytes: number; rate_limit_rpm: number; features: string[];
};

export const FALLBACK_PLANS: PdfPlan[] = [
  { id: "free", name: "Free", price_monthly: 0, price_yearly: 0, credits: 100, max_pdf_bytes: 2097152, rate_limit_rpm: 5, features: [] },
  { id: "starter", name: "Starter", price_monthly: 99900, price_yearly: 999000, credits: 1000, max_pdf_bytes: 5242880, rate_limit_rpm: 20, features: [] },
  { id: "growth", name: "Growth", price_monthly: 199900, price_yearly: 1999000, credits: 2000, max_pdf_bytes: 10485760, rate_limit_rpm: 50, features: [] },
  { id: "pro", name: "Pro", price_monthly: 399900, price_yearly: 3999000, credits: 5000, max_pdf_bytes: 26214400, rate_limit_rpm: 150, features: [] },
];

export async function getPdfPlans(): Promise<PdfPlan[]> {
  const db = supabaseAdmin();
  if (!db) return FALLBACK_PLANS;
  const { data } = await db
    .from("pdfapi_plans")
    .select("id, name, price_monthly, price_yearly, credits, max_pdf_bytes, rate_limit_rpm, features")
    .eq("is_active", true)
    .order("sort_order");
  return data && data.length ? (data as PdfPlan[]) : FALLBACK_PLANS;
}

/** ₹ amount from paise, e.g. 99900 → "₹999" */
export const inrFromPaise = (paise: number) =>
  paise === 0 ? "₹0" : `₹${(paise / 100).toLocaleString("en-IN")}`;
