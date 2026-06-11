import { supabase } from "./supabase";
import {
  fallbackPages,
  fallbackProducts,
  fallbackSettings,
  fallbackStats,
  fallbackSteps,
  fallbackTestimonials,
  fallbackWhy,
} from "./fallback-content";
import type { Page, Product, Settings, Stat, Step, Testimonial, WhyCard } from "./types";

// Every getter is Supabase-first with built-in fallback content,
// so the site renders even before the database is configured.

export async function getSettings(): Promise<Settings> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_settings")
      .select("setting_key, setting_value");
    if (data && data.length) {
      const merged: Settings = { ...fallbackSettings };
      for (const row of data) merged[row.setting_key] = row.setting_value;
      return merged;
    }
  }
  return fallbackSettings;
}

export async function getProducts(): Promise<Product[]> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_products")
      .select("slug, name, tagline, badge, description, icon, features, sort_order")
      .eq("is_active", true)
      .order("sort_order");
    if (data && data.length) {
      return data.map((row) => ({
        ...row,
        features: Array.isArray(row.features) ? row.features : [],
      }));
    }
  }
  return fallbackProducts;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getSteps(): Promise<Step[]> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_steps")
      .select("step_no, title, description, icon")
      .order("step_no");
    if (data && data.length) return data;
  }
  return fallbackSteps;
}

export async function getWhyCards(): Promise<WhyCard[]> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_why")
      .select("title, description, icon, sort_order")
      .order("sort_order");
    if (data && data.length) return data;
  }
  return fallbackWhy;
}

export async function getStats(): Promise<Stat[]> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_stats")
      .select("value, label, description, sort_order")
      .order("sort_order");
    if (data && data.length) return data;
  }
  return fallbackStats;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_testimonials")
      .select("name, role, company, quote, sort_order")
      .order("sort_order");
    if (data && data.length) return data;
  }
  return fallbackTestimonials;
}

export async function getPage(slug: string): Promise<Page | null> {
  const db = supabase();
  if (db) {
    const { data } = await db
      .from("aivexa_pages")
      .select("slug, title, subtitle, content")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data;
  }
  return fallbackPages[slug] ?? null;
}
