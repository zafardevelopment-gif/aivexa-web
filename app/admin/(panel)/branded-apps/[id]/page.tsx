"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBrandedApp, createPublishingJob, type BrandedApp, type PublishingJob } from "../actions";
import {
  ArrowLeft, Send, RefreshCw, CheckCircle2, Clock, AlertCircle,
  Loader2, Package, Edit2, Globe, Palette, FileText, ShieldCheck,
  ExternalLink, Info
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  DRAFT:                    { label: "Draft",            color: "#94a3b8", desc: "App created. Ready to publish when Play Console is set up." },
  PUBLISHING:               { label: "Publishing",       color: "#f59e0b", desc: "A publishing job is running." },
  SUBMITTED:                { label: "Submitted",        color: "#6366f1", desc: "App submitted to Google Play. Awaiting processing." },
  PROCESSING:               { label: "Processing",       color: "#8b5cf6", desc: "Google Play is processing the submission." },
  PUBLISHED:                { label: "Published ✓",      color: "#10b981", desc: "Live on Google Play Store." },
  FAILED:                   { label: "Failed",           color: "#ef4444", desc: "Publishing failed. Check the job log for details." },
  MANUAL_ACTION_REQUIRED:   { label: "Action Needed",   color: "#f97316", desc: "A manual step in Play Console is required to proceed." },
};

const JOB_STATUS_COLORS: Record<string, string> = {
  DRAFT:"#94a3b8", VALIDATING:"#6366f1", BUILDING:"#f59e0b", BUILT:"#10b981",
  UPLOADING:"#8b5cf6", CONFIGURING_LISTING:"#6366f1", VALIDATING_PLAY_EDIT:"#8b5cf6",
  READY_TO_COMMIT:"#0ea5e9", COMMITTING:"#f59e0b", SUBMITTED:"#6366f1",
  PROCESSING:"#8b5cf6", PUBLISHED:"#10b981", BUILD_FAILED:"#ef4444",
  UPLOAD_FAILED:"#ef4444", FAILED:"#ef4444", MANUAL_ACTION_REQUIRED:"#f97316",
};

function Badge({ status, label, color }: { status?: string; label?: string; color?: string }) {
  const c = color || JOB_STATUS_COLORS[status || ""] || "#94a3b8";
  const l = label || status || "";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: c + "18", color: c, border: `1px solid ${c}40`,
      borderRadius: 50, padding: "3px 10px", fontSize: ".73rem", fontWeight: 600,
    }}>
      {l}
    </span>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "1.4rem 1.6rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", fontWeight: 700, fontSize: ".88rem", color: "var(--text)" }}>
        <Icon size={15} style={{ color: "var(--indigo)" }} /> {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem 0", borderBottom: "1px solid var(--border)", fontSize: ".86rem" }}>
      <span style={{ color: "var(--muted-2)", fontWeight: 500 }}>{label}</span>
      <span style={{ color: "var(--text)", fontWeight: 600, maxWidth: "65%", textAlign: "right", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

export default function BrandedAppDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<BrandedApp | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const load = async () => {
    setLoading(true);
    const { app: data } = await getBrandedApp(id);
    setApp(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handlePublish = async () => {
    if (!confirm("Start a new publishing job for this app?")) return;
    setPublishing(true);
    const { error } = await createPublishingJob(id);
    setPublishing(false);
    if (error) setMsg({ text: error, ok: false });
    else { setMsg({ text: "Publishing job created! The build pipeline will start shortly.", ok: true }); load(); }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "3rem 0", color: "var(--muted)" }}>
      <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…
    </div>
  );
  if (!app) return <div className="form-alert err">App not found.</div>;

  const statusCfg = STATUS_CONFIG[app.status] ?? { label: app.status, color: "#94a3b8", desc: "" };
  const jobs = (app.publishing_jobs || []) as PublishingJob[];
  const latestJob = jobs[0];
  const canPublish = app.status === "DRAFT" || app.status === "FAILED";

  return (
    <div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => router.push("/admin/branded-apps")} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 9, padding: ".4rem .8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: ".84rem", color: "var(--muted)" }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: app.primary_color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "1rem" }}>
            {app.app_display_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="admin-title" style={{ margin: 0, fontSize: "1.25rem" }}>{app.app_display_name}</h1>
            <span style={{ fontFamily: "monospace", fontSize: ".76rem", color: "var(--muted-2)" }}>{app.package_name}</span>
          </div>
        </div>
        <Badge label={statusCfg.label} color={statusCfg.color} />
        {canPublish && (
          <button className="btn-primary" onClick={handlePublish} disabled={publishing} style={{ fontSize: ".86rem", padding: ".55rem 1.2rem", gap: 7 }}>
            {publishing ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={14} />}
            {publishing ? "Starting…" : "Publish Now"}
          </button>
        )}
        <button className="btn-secondary" onClick={load} style={{ fontSize: ".86rem", padding: ".55rem .9rem" }}>
          <RefreshCw size={14} />
        </button>
      </div>

      {msg && (
        <div className={`form-alert ${msg.ok ? "ok" : "err"}`} style={{ marginBottom: "1rem" }}>
          {msg.text}
          <button onClick={() => setMsg(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontWeight: 700, opacity: .6 }}>✕</button>
        </div>
      )}

      {statusCfg.desc && (
        <div style={{ background: statusCfg.color + "12", border: `1px solid ${statusCfg.color}30`, borderRadius: 10, padding: ".7rem 1rem", fontSize: ".84rem", color: statusCfg.color, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <Info size={14} /> {statusCfg.desc}
        </div>
      )}

      {app.status === "DRAFT" && (
        <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 12, padding: "1rem 1.2rem", fontSize: ".83rem", color: "#92400e", marginBottom: "1rem" }}>
          <strong>📋 Before publishing, complete these steps in Play Console:</strong>
          <ol style={{ paddingLeft: "1.2rem", marginTop: ".5rem", lineHeight: 2 }}>
            <li>Create a new app in <a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer" style={{ color: "#92400e", textDecoration: "underline" }}>Google Play Console ↗</a> with package name: <code style={{ background: "#fff7", padding: "1px 5px", borderRadius: 4 }}>{app.package_name}</code></li>
            <li>Complete the IARC content rating questionnaire</li>
            <li>Accept Play App Signing enrollment (recommended: upload key model)</li>
            <li>Complete all required store listing fields in Play Console</li>
            <li>Then return here and click "Publish Now" to start the automated pipeline</li>
          </ol>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <Section title="Identity" icon={Package}>
            <Row label="Tenant" value={app.tenant_name} />
            <Row label="Package Name" value={<code style={{ fontFamily: "monospace", fontSize: ".82rem" }}>{app.package_name}</code>} />
            <Row label="Created" value={new Date(app.created_at).toLocaleDateString()} />
            <Row label="Updated" value={new Date(app.updated_at).toLocaleDateString()} />
          </Section>

          <Section title="Branding" icon={Palette}>
            <Row label="Primary Color" value={
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 16, height: 16, borderRadius: 4, background: app.primary_color, border: "1px solid rgba(0,0,0,.1)" }} />
                {app.primary_color}
              </span>
            } />
            <Row label="Secondary Color" value={
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 16, height: 16, borderRadius: 4, background: app.secondary_color, border: "1px solid rgba(0,0,0,.1)" }} />
                {app.secondary_color}
              </span>
            } />
            <Row label="Language" value={app.default_language} />
          </Section>

          <Section title="Contact & Legal" icon={ShieldCheck}>
            <Row label="Email" value={app.email || "—"} />
            <Row label="Phone" value={app.phone || "—"} />
            <Row label="Website" value={app.website_url
              ? <a href={app.website_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--indigo)", display: "flex", alignItems: "center", gap: 4 }}>{new URL(app.website_url).hostname} <ExternalLink size={11} /></a>
              : "—"} />
            <Row label="Privacy Policy" value={app.privacy_policy_url
              ? <a href={app.privacy_policy_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--indigo)", display: "flex", alignItems: "center", gap: 4 }}>View ↗ <ExternalLink size={11} /></a>
              : "—"} />
          </Section>
        </div>

        <div>
          <Section title="Store Listing" icon={FileText}>
            <Row label="Category" value={app.category?.replace(/_/g, " ")} />
            <Row label="Content Rating" value={app.content_rating} />
            <Row label="Release Track" value={<Badge label={app.release_track} color={app.release_track === "production" ? "#10b981" : "#6366f1"} />} />
            {app.short_description && (
              <div style={{ padding: ".6rem 0", fontSize: ".84rem", color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 600, color: "var(--muted-2)", fontSize: ".76rem", marginBottom: ".3rem" }}>SHORT DESCRIPTION</div>
                {app.short_description}
              </div>
            )}
          </Section>

          <Section title="Publishing Jobs" icon={Globe}>
            {jobs.length === 0 ? (
              <p style={{ fontSize: ".86rem", color: "var(--muted-2)", textAlign: "center", padding: "1rem 0" }}>
                No publishing jobs yet. Click "Publish Now" to start.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                {jobs.slice(0, 5).map((job, i) => (
                  <div key={job.id} style={{
                    background: i === 0 ? "var(--bg-2)" : "#fff",
                    border: "1px solid var(--border)", borderRadius: 10, padding: ".75rem 1rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".3rem" }}>
                      <Badge status={job.status} />
                      <span style={{ fontSize: ".72rem", color: "var(--muted-2)" }}>
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {job.current_step && (
                      <div style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: ".25rem" }}>
                        Step: <strong>{job.current_step}</strong>
                      </div>
                    )}
                    {job.error_message && i === 0 && (
                      <div style={{ fontSize: ".76rem", color: "#b91c1c", background: "#fef2f2", borderRadius: 7, padding: ".4rem .7rem", marginTop: ".4rem" }}>
                        ⚠ Error details logged server-side.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
