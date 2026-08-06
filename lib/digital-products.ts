import { supabase } from "./supabase";
import type { DigitalProduct } from "./types";

const fallbackProducts: DigitalProduct[] = [];

export async function getDigitalProducts(): Promise<DigitalProduct[]> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_digital_products")
      .select("id, slug, name, tagline, description, price, original_price, category, preview_image, file_url, is_featured, sort_order")
      .eq("is_active", true)
      .order("sort_order");
    if (data && data.length) return data as DigitalProduct[];
  }
  return fallbackProducts;
}

export async function getFeaturedDigitalProducts(): Promise<DigitalProduct[]> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_digital_products")
      .select("id, slug, name, tagline, description, price, original_price, category, preview_image, file_url, is_featured, sort_order")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order");
    if (data && data.length) return data as DigitalProduct[];
  }
  return fallbackProducts;
}

export async function getDigitalProduct(slug: string): Promise<DigitalProduct | null> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_digital_products")
      .select("id, slug, name, tagline, description, price, original_price, category, preview_image, file_url, is_featured, sort_order")
      .eq("is_active", true)
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as DigitalProduct;
  }
  return null;
}

/** Format paise → ₹ string */
export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
