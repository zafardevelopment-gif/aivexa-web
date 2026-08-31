"use server";

import { createClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export type BrandedApp = {
  id: string;
  tenant_name: string;
  package_name: string;
  app_display_name: string;
  status: string;
  primary_color: string;
  secondary_color: string;
  icon_url: string | null;
  feature_graphic_url: string | null;
  short_description: string;
  full_description: string;
  release_track: string;
  created_at: string;
  updated_at: string;
  publishing_jobs?: PublishingJob[];
};

export type PublishingJob = {
  id: string;
  branded_app_id: string;
  status: string;
  current_step: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export async function getBrandedApps(): Promise<{ apps: BrandedApp[]; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("branded_apps")
    .select("*, publishing_jobs(id, status, current_step, created_at, updated_at)")
    .order("created_at", { ascending: false });

  if (error) return { apps: [], error: error.message };
  return { apps: data as BrandedApp[], error: null };
}

export async function getBrandedApp(id: string): Promise<{ app: BrandedApp | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("branded_apps")
    .select("*, publishing_jobs(*)")
    .eq("id", id)
    .single();

  if (error) return { app: null, error: error.message };
  return { app: data as BrandedApp, error: null };
}

export async function createBrandedApp(formData: FormData): Promise<{ id: string | null; error: string | null }> {
  const supabase = createClient();

  const payload = {
    tenant_name: formData.get("tenant_name") as string,
    package_name: formData.get("package_name") as string,
    app_display_name: formData.get("app_display_name") as string,
    short_description: formData.get("short_description") as string,
    full_description: formData.get("full_description") as string,
    primary_color: formData.get("primary_color") as string || "#4f46e5",
    secondary_color: formData.get("secondary_color") as string || "#10b981",
    release_track: formData.get("release_track") as string || "internal",
    category: formData.get("category") as string || "PRODUCTIVITY",
    content_rating: formData.get("content_rating") as string || "EVERYONE",
    default_language: formData.get("default_language") as string || "en-US",
    website_url: formData.get("website_url") as string || null,
    email: formData.get("email") as string || null,
    phone: formData.get("phone") as string || null,
    privacy_policy_url: formData.get("privacy_policy_url") as string || null,
    status: "DRAFT",
  };

  // Validate required fields
  if (!payload.tenant_name || !payload.package_name || !payload.app_display_name) {
    return { id: null, error: "Tenant name, package name, and app display name are required." };
  }

  const pkgRegex = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){2,}$/;
  if (!pkgRegex.test(payload.package_name)) {
    return { id: null, error: "Invalid package name. Use format: com.company.appname" };
  }

  const { data, error } = await supabase
    .from("branded_apps")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { id: null, error: "Package name already exists. Each app must have a unique package name." };
    return { id: null, error: error.message };
  }

  revalidatePath("/admin/branded-apps");
  return { id: data.id, error: null };
}

export async function updateBrandedApp(
  id: string,
  updates: Partial<BrandedApp>
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("branded_apps")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/branded-apps");
  revalidatePath(`/admin/branded-apps/${id}`);
  return { error: null };
}

export async function deleteBrandedApp(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("branded_apps").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/branded-apps");
  return { error: null };
}

export async function createPublishingJob(brandedAppId: string): Promise<{ jobId: string | null; error: string | null }> {
  const supabase = createClient();

  // Check no active job exists
  const { data: existing } = await supabase
    .from("publishing_jobs")
    .select("id, status")
    .eq("branded_app_id", brandedAppId)
    .in("status", ["DRAFT", "VALIDATING", "BUILDING", "BUILT", "UPLOADING", "CONFIGURING_LISTING", "VALIDATING_PLAY_EDIT", "READY_TO_COMMIT", "COMMITTING"])
    .maybeSingle();

  if (existing) {
    return { jobId: null, error: `An active publishing job already exists (status: ${existing.status}).` };
  }

  const { data, error } = await supabase
    .from("publishing_jobs")
    .insert({ branded_app_id: brandedAppId, status: "DRAFT", current_step: null })
    .select("id")
    .single();

  if (error) return { jobId: null, error: error.message };

  // Update app status
  await supabase.from("branded_apps").update({ status: "PUBLISHING" }).eq("id", brandedAppId);

  revalidatePath("/admin/branded-apps");
  revalidatePath(`/admin/branded-apps/${brandedAppId}`);
  return { jobId: data.id, error: null };
}
