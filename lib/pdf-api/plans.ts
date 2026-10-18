/**
 * PDF API plans — read from the database (edited in Admin → PDF API Plans).
 * Falls back to the launch prices if the database is unreachable.
 */
import { supabaseAdmin } from "@/lib/supabase-admin";

export type PdfPlan = {
  id: string; name: string; price_monthly: number; price_yearly: number;
  credits: number; max_pdf_bytes: number; rate_limit_rpm: number; features: string[];
  parallel?: number; sort_order?: number;
};

export const FALLBACK_PLANS: PdfPlan[] = [
  { id: "free", name: "Free", price_monthly: 0, price_yearly: 0, credits: 100, max_pdf_bytes: 1048576, rate_limit_rpm: 10, parallel: 1, sort_order: 0, features: ["1 parallel conversion", "All customization options", "1 MB max PDF size"] },
  { id: "starter", name: "Startup", price_monthly: 74900, price_yearly: 749000, credits: 1000, max_pdf_bytes: 52428800, rate_limit_rpm: 60, parallel: 3, sort_order: 1, features: ["3 parallel conversions", "All customization options", "Up to 50 MB PDF size"] },
  { id: "growth", name: "Standard", price_monthly: 209900, price_yearly: 2099000, credits: 5000, max_pdf_bytes: 52428800, rate_limit_rpm: 120, parallel: 10, sort_order: 2, features: ["10 parallel conversions", "All customization options", "Up to 50 MB PDF size"] },
  { id: "pro", name: "Scale", price_monthly: 324900, price_yearly: 3249000, credits: 10000, max_pdf_bytes: 52428800, rate_limit_rpm: 240, parallel: 20, sort_order: 3, features: ["20 parallel conversions", "All customization options", "Up to 50 MB PDF size"] },
];

export async function getPdfPlans(): Promise<PdfPlan[]> {
  const db = supabaseAdmin();
  if (!db) return FALLBACK_PLANS;
  const { data } = await db
    .from("pdfapi_plans")
    .select("id, name, price_monthly, price_yearly, credits, max_pdf_bytes, rate_limit_rpm, features, parallel, sort_order")
    .eq("is_active", true)
    .order("sort_order");
  return data && data.length ? (data as PdfPlan[]) : FALLBACK_PLANS;
}

/** ₹ amount from paise, e.g. 99900 → "₹999" */
export const inrFromPaise = (paise: number) =>
  paise === 0 ? "₹0" : `₹${(paise / 100).toLocaleString("en-IN")}`;
