"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrandedApps, deleteBrandedApp, createPublishingJob, type BrandedApp } from "./actions";
import {
  Smartphone, Plus, Trash2, Send, Eye, RefreshCw,
  CheckCircle2, Clock, AlertCircle, Loader2, Package
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  DRAFT:             { label: "Draft",         color: "#94a3b8", icon: <Clock size={13} /> },
  PUBLISHING:        { label: "Publishing",    color: "#f59e0b", icon: <Loader2 size={13} className="spin" /> },
  SUBMITTED:         { label: "Submitted",     color: "#6366f1", icon: <Send size={13} /> },
  PROCESSING:        { label: "Processing",    color: "#8b5cf6", icon: <RefreshCw size={13} /> },
  PUBLISHED:         { label: "Published",     color: "#10b981", icon: <CheckCircle2 size={13} /> },
  FAILED:            { label: "Failed",        color: "#ef4444", icon: <AlertCircle size={13} /> },
  MANUAL_ACTION_REQUIRED: { label: "Action Needed", color: "#f97316", icon: <AlertCircle size={13} /> },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "#94a3b8", icon: null };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.color + "18", color: cfg.color,
      border: `1px solid ${cfg.color}40`,
      borderRadius: 50, padding: "3px 10px",
      fontSize: ".74rem", fontWeight: 600,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export default function BrandedAppsPage() {
  const [apps, setApps] = useState<BrandedApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const load = async () => {
    setLoading(true);
    const { apps: data, error: err } = await getBrandedApps();
    setApps(data);
    setError(err);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setActionLoading(id + "_del");
    const { error: err } = await deleteBrandedApp(id);
    if (err) setMsg({ text: err, ok: false });
    else { setMsg({ text: "App deleted.", ok: true }); load(); }
    setActionLoading(null);
  };

  const handlePublish = async (id: string) => {
    setActionLoading(id + "_pub");
    const { error: err } = await createPublishingJob(id);
    if (err) setMsg({ text: err, ok: false });
    else { setMsg({ text: "Publishing job started! Check status for progress.", ok: true }); load(); }
    setActionLoading(null);
  };

  return (
    <div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .app-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.1rem; margin-top: 1.5rem; }
        .app-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 1.4rem; display: flex; flex-direction: column; gap: .75rem; transition: all .2s; }
        .app-card:hover { border-color: #c7d2fe; box-shadow: var(--shadow-md); }
        .app-card-top { display: flex; align-items: center; gap: 12px; }
        .app-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; font-size: 1.2rem; font-weight: 800; }
        .app-card-info h3 { font-size: .97rem; font-weight: 700; letter-spacing: -.01em; color: var(--text); }
        .app-card-info p { font-size: .77rem; color: var(--muted-2); font-family: monospace; margin-top: 2px; }
        .app-card-desc { font-size: .83rem; color: var(--muted); line-height: 1.55; }
        .app-card-actions { display: flex; gap: .5rem; margin-top: .25rem; }
        .act-btn { display: inline-flex; align-items: center; gap: 6px; padding: .42rem .85rem; border-radius: 9px; font-size: .8rem; font-weight: 600; cursor: pointer; border: none; transition: all .15s; }
        .act-view { background: var(--indigo-light); color: var(--indigo); }
        .act-view:hover { background: #e0e7ff; }
        .act-pub { background: #ecfdf5; color: #047857; }
        .act-pub:hover { background: #d1fae5; }
        .act-del { background: #fef2f2; color: #b91c1c; margin-left: auto; }
        .act-del:hover { background: #fee2e2; }
        .empty-state { text-align: center; padding: 4rem 2rem; background: #fff; border: 1px dashed var(--border-2); border-radius: 16px; margin-top: 1.5rem; }
        .empty-icon { width: 64px; height: 64px; background: var(--indigo-light); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--indigo); margin: 0 auto 1rem; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".5rem" }}>
        <div>
          <h1 className="admin-title" style={{ marginBottom: ".2rem", display: "flex", alignItems: "center", gap: 10 }}>
            <Smartphone size={22} style={{ color: "var(--indigo)" }} /> Branded Apps
          </h1>
          <p className="admin-muted" style={{ marginBottom: 0 }}>
            Manage and publish white-label Android apps for your clients.
          </p>
        </div>
        <Link href="/admin/branded-apps/new" className="btn-primary" style={{ gap: 7, fontSize: ".88rem", padding: ".65rem 1.3rem" }}>
          <Plus size={16} /> New App
        </Link>
      </div>

      {msg && (
        <div className={`form-alert ${msg.ok ? "ok" : "err"}`} style={{ marginTop: "1rem" }}>
          {msg.text}
          <button onClick={() => setMsg(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", opacity: .6, fontWeight: 700 }}>✕</button>
        </div>
      )}
      {error && <div className="form-alert err" style={{ marginTop: "1rem" }}>{error}</div>}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "3rem 0", color: "var(--muted)" }}>
          <Loader2 size={18} className="spin" /> Loading apps…
        </div>
      ) : apps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Package size={28} /></div>
          <h3 style={{ fontWeight: 700, marginBottom: ".4rem" }}>No branded apps yet</h3>
          <p style={{ color: "var(--muted)", fontSize: ".9rem", marginBottom: "1.4rem" }}>
            Create your first white-label Android app to get started.
          </p>
          <Link href="/admin/branded-apps/new" className="btn-primary" style={{ fontSize: ".88rem" }}>
            <Plus size={15} /> Create First App
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
            {["DRAFT", "PUBLISHING", "PUBLISHED", "FAILED"].map(s => {
              const count = apps.filter(a => a.status === s).length;
              if (!count) return null;
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s} className="admin-card" style={{ minWidth: 120, flex: "0 0 auto" }}>
                  <b style={{ fontSize: "1.6rem", color: cfg.color }}>{count}</b>
                  <span>{cfg.label}</span>
                </div>
              );
            })}
          </div>

          <div className="app-grid">
            {apps.map(app => {
              const initials = app.app_display_name.slice(0, 2).toUpperCase();
              const latestJob = app.publishing_jobs?.[0];
              return (
                <div key={app.id} className="app-card">
                  <div className="app-card-top">
                    <div className="app-icon" style={{ background: app.primary_color || "var(--indigo)" }}>
                      {app.icon_url
                        ? <img src={app.icon_url} alt="" style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover" }} />
                        : initials}
                    </div>
                    <div className="app-card-info" style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.app_display_name}</h3>
                      <p>{app.package_name}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  {app.short_description && (
                    <p className="app-card-desc">{app.short_description.slice(0, 100)}{app.short_description.length > 100 ? "…" : ""}</p>
                  )}

                  {latestJob && (
                    <div style={{ fontSize: ".76rem", color: "var(--muted-2)", display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={11} />
                      Last job: <StatusBadge status={latestJob.status} />
                      {latestJob.current_step && <span style={{ opacity: .7 }}>— {latestJob.current_step}</span>}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: ".75rem", color: "var(--muted-2)" }}>
                    <span style={{ background: "var(--bg-3)", padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>{app.release_track}</span>
                    <span style={{ background: app.primary_color + "22", color: app.primary_color, padding: "2px 8px", borderRadius: 20, fontWeight: 600, fontSize: ".7rem" }}>●&nbsp;Primary</span>
                    <span style={{ background: app.secondary_color + "22", color: app.secondary_color, padding: "2px 8px", borderRadius: 20, fontWeight: 600, fontSize: ".7rem" }}>●&nbsp;Secondary</span>
                  </div>

                  <div className="app-card-actions">
                    <Link href={`/admin/branded-apps/${app.id}`} className="act-btn act-view">
                      <Eye size={13} /> View
                    </Link>
                    {(app.status === "DRAFT" || app.status === "FAILED") && (
                      <button
                        className="act-btn act-pub"
                        onClick={() => handlePublish(app.id)}
                        disabled={actionLoading === app.id + "_pub"}
                      >
                        {actionLoading === app.id + "_pub"
                          ? <Loader2 size={13} className="spin" />
                          : <Send size={13} />}
                        Publish
                      </button>
                    )}
                    <button
                      className="act-btn act-del"
                      onClick={() => handleDelete(app.id, app.app_display_name)}
                      disabled={actionLoading === app.id + "_del"}
                    >
                      {actionLoading === app.id + "_del" ? <Loader2 size={13} className="spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
