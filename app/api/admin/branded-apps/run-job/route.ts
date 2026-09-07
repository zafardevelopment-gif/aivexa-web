// Publishing worker: processes one publishing job end-to-end.
// Detailed errors stay server-side (DB error_message); frontend gets generic text.
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";
import { playEdits, uploadBundle } from "@/lib/google-play";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function setJob(jobId: string, patch: Record<string, unknown>) {
  await sb().from("publishing_jobs").update(patch).eq("id", jobId);
}

async function step<T>(jobId: string, name: string, fn: () => Promise<T>): Promise<T> {
  const db = sb();
  const started = Date.now();
  const { data: s } = await db
    .from("publishing_steps")
    .insert({ job_id: jobId, step_name: name, status: "RUNNING", started_at: new Date().toISOString() })
    .select("id")
    .single();
  await setJob(jobId, { current_step: name });
  try {
    const out = await fn();
    await db.from("publishing_steps").update({
      status: "COMPLETED", completed_at: new Date().toISOString(), duration_ms: Date.now() - started,
    }).eq("id", s!.id);
    return out;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    await db.from("publishing_steps").update({
      status: "FAILED", completed_at: new Date().toISOString(), duration_ms: Date.now() - started, error_message: msg,
    }).eq("id", s!.id);
    throw e;
  }
}

export async function POST(req: NextRequest) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await req.json().catch(() => ({}));
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

  const db = sb();
  const { data: job } = await db.from("publishing_jobs").select("*").eq("id", jobId).single();
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (!["DRAFT", "FAILED", "UPLOAD_FAILED"].includes(job.status))
    return NextResponse.json({ error: "Job is not in a runnable state." }, { status: 409 });

  const { data: app } = await db.from("branded_apps").select("*").eq("id", job.branded_app_id).single();
  if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });

  const pkg = app.package_name as string;
  let editId: string | null = null;

  try {
    await setJob(jobId, { status: "VALIDATING", error_message: null });
    await step(jobId, "validate_inputs", async () => {
      if (!process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON) throw new Error("Service account not configured");
      if (!app.aab_path) throw new Error("No AAB uploaded for this app");
      if (!app.app_display_name || !app.short_description || !app.full_description)
        throw new Error("Store listing fields incomplete");
    });

    const aab = await step(jobId, "download_aab", async () => {
      if (String(app.aab_path).startsWith("http")) {
        const res = await fetch(app.aab_path);
        if (!res.ok) throw new Error(`AAB fetch failed: ${res.status}`);
        return Buffer.from(await res.arrayBuffer());
      }
      const { data, error } = await db.storage.from("branded-apps").download(app.aab_path);
      if (error || !data) throw new Error(`AAB download failed: ${error?.message}`);
      return Buffer.from(await data.arrayBuffer());
    });

    await setJob(jobId, { status: "UPLOADING" });
    editId = (await step(jobId, "create_play_edit", () => playEdits.insert(pkg))).id as string;
    await setJob(jobId, { play_edit_id: editId });

    const { versionCode } = await step(jobId, "upload_bundle", () => uploadBundle(pkg, editId!, aab));
    await setJob(jobId, { aab_version_code: versionCode });
    await db.from("branded_apps").update({ aab_version_code: versionCode }).eq("id", app.id);

    await setJob(jobId, { status: "CONFIGURING_LISTING" });
    await step(jobId, "update_listing", () =>
      playEdits.updateListing(pkg, editId!, app.default_language || "en-US", {
        title: app.app_display_name,
        shortDescription: app.short_description,
        fullDescription: app.full_description,
      })
    );

    await step(jobId, "assign_track", () =>
      playEdits.updateTrack(pkg, editId!, app.release_track || "internal", versionCode)
    );

    await setJob(jobId, { status: "VALIDATING_PLAY_EDIT" });
    await step(jobId, "validate_edit", () => playEdits.validate(pkg, editId!));

    await setJob(jobId, { status: "COMMITTING" });
    await step(jobId, "commit_edit", () => playEdits.commit(pkg, editId!));

    await setJob(jobId, {
      status: "SUBMITTED", current_step: null, completed_at: new Date().toISOString(),
    });
    await db.from("branded_apps").update({ status: "SUBMITTED" }).eq("id", app.id);

    return NextResponse.json({ ok: true, status: "SUBMITTED", versionCode });
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : String(e);
    if (editId) await playEdits.delete(pkg, editId);
    await setJob(jobId, { status: "FAILED", error_message: detail });
    await db.from("branded_apps").update({ status: "FAILED" }).eq("id", app.id);
    // Generic message only — details stay server-side.
    return NextResponse.json({ error: "Publishing failed. Check the job log in the admin panel." }, { status: 500 });
  }
}
