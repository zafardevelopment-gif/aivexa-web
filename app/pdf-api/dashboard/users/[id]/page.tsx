"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Mail, KeyRound, ShieldCheck, Ban, RotateCcw, Gift } from "lucide-react";

type Detail = {
  profile: {
    id: string; email: string; plan_id: string; credits_used: number; credits_reset_at: string | null;
    plan_expires_at: string | null; is_active: boolean; created_at: string;
    billing_name: string | null; billing_company: string | null; billing_gstin: string | null; billing_address: string | null;
    pdfapi_plans: { name: string; credits: number } | null;
  };
  auth: { email_confirmed_at: string | null; last_sign_in_at: string | null; providers: string[] } | null;
  requests: { request_id: string; endpoint: string; status: string; input_type: string | null; output_size_bytes: number | null; response_ms: number | null; error_code: string | null; is_test: boolean; credits_used: number | null; created_at: string }[];
  payments: { id: number; receipt_no: string | null; plan_id: string; cycle: string; amount: number; status: string; payment_id: string | null; paid_at: string | null; created_at: string; rzp_subscription_id: string | null }[];
  keys: { id: number; name: string; key_prefix: string; key_hint: string; is_test: boolean; is_active: boolean; last_used_at: string | null; created_at: string }[];
  subscriptions: { rzp_subscription_id: string; plan_id: string; cycle: string; status: string; current_end: string | null; cancel_at_cycle_end: boolean }[];
};
type Plan = { id: string; name: string };

const dt = (d: string | null) => (d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—");
const day = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");
const inr = (p: number) => `₹${(p / 100).toLocaleString("en-IN")}`;
const kb = (b: number | null) => (b ? `${Math.round(b / 1024)} KB` : "—");

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const supabase = useMemo(() => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!), []);
  const [d, setD] = useState<Detail | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState("");
  const [newPw, setNewPw] = useState("");
  const [grantPlan, setGrantPlan] = useState("starter");
  const [grantDays, setGrantDays] = useState(30);

  const headers = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { Authorization: `Bearer ${session?.access_token ?? ""}`, "Content-Type": "application/json" };
  }, [supabase]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/v1/admin/users/${id}`, { headers: await headers() });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) setError(res.status === 403 ? "This page is only for AIVEXA admins." : j.error ?? "Could not load user.");
    else setD(j);
  }, [id, headers]);

  useEffect(() => {
    load();
    fetch("/api/v1/plans").then((r) => r.json()).then((j) => setPlans(j.plans ?? [])).catch(() => {});
  }, [load]);

  const act = async (action: string, extra: Record<string, unknown> = {}, confirmText?: string) => {
    if (confirmText && !confirm(confirmText)) return;
    setBusy(action); setMsg(null);
    const res = await fetch(`/api/v1/admin/users/${id}`, { method: "POST", headers: await headers(), body: JSON.stringify({ action, ...extra }) });
    const j = await res.json().catch(() => ({}));
    setBusy("");
    setMsg({ ok: res.ok, text: res.ok ? j.message ?? "Done." : j.error ?? "Failed." });
    if (res.ok) { if (action === "set_password") setNewPw(""); load(); }
  };

  if (error) return <div className="pdfapi-card" style={{ color: "var(--pdf-error)" }}>{error}</div>;
  if (!d) return <p style={{ color: "var(--pdf-muted)" }}>Loading…</p>;

  const p = d.profile;
  const plan = p.pdfapi_plans;
  const ok30 = d.requests.filter((r) => r.status === "completed").length;
  const sub = d.subscriptions.find((s) => ["active", "authenticated", "pending"].includes(s.status));

  return (
    <div className="ud">
      <Link href="/pdf-api/dashboard/users" className="ud-back"><ArrowLeft size={14} /> All users</Link>
      <div className="ud-head">
        <div>
          <h1>{p.email}</h1>
          <div className="ud-muted">
            Joined {day(p.created_at)} · Last sign-in {dt(d.auth?.last_sign_in_at ?? null)}
            {" · "}{d.auth?.email_confirmed_at ? <span className="ud-ok">email verified</span> : <span className="ud-warn">email not verified</span>}
            {" · "}{p.is_active ? <span className="ud-ok">active</span> : <span className="ud-bad">suspended</span>}
          </div>
        </div>
      </div>

      {msg && <div className="pdfapi-card" style={{ marginBottom: 16, color: msg.ok ? "var(--pdf-success)" : "var(--pdf-error)", padding: "12px 16px" }}>{msg.text}</div>}

      <div className="ud-grid">
        {/* Plan & billing */}
        <section className="pdfapi-card">
          <h3>Plan &amp; billing</h3>
          <div className="ud-kv"><span>Plan</span><b>{plan?.name ?? p.plan_id}</b></div>
          <div className="ud-kv"><span>Credits this month</span><b>{p.credits_used.toLocaleString("en-IN")} / {(plan?.credits ?? 0).toLocaleString("en-IN")}</b></div>
          <div className="ud-kv"><span>Credits reset on</span><b>{day(p.credits_reset_at)}</b></div>
          <div className="ud-kv"><span>Plan valid until</span><b>{p.plan_expires_at ? day(p.plan_expires_at) : "—"}</b></div>
          <div className="ud-kv"><span>Auto-pay</span><b>{sub ? `${sub.cancel_at_cycle_end ? "cancelled, ends" : "on, next"} ${day(sub.current_end)}` : "off"}</b></div>
          <div className="ud-kv"><span>Billing name / GSTIN</span><b>{p.billing_name || "—"}{p.billing_gstin ? ` · ${p.billing_gstin}` : ""}</b></div>

          <div className="ud-sep" />
          <div className="ud-label"><Gift size={13} /> Give a plan manually (no payment)</div>
          <div className="ud-row">
            <select className="pdfapi-input" value={grantPlan} onChange={(e) => setGrantPlan(e.target.value)}>
              {plans.map((pl) => <option key={pl.id} value={pl.id}>{pl.name}</option>)}
            </select>
            <input className="pdfapi-input" type="number" min={1} max={3660} value={grantDays} onChange={(e) => setGrantDays(Number(e.target.value))} style={{ width: 90 }} />
            <span className="ud-muted">days</span>
            <button className="pdfapi-btn pdfapi-btn-secondary" disabled={!!busy} onClick={() => act("set_plan", { planId: grantPlan, days: grantDays }, `Change ${p.email} to this plan?`)}>Apply</button>
          </div>
          <button className="pdfapi-btn pdfapi-btn-secondary ud-btn" disabled={!!busy} onClick={() => act("reset_credits", {}, "Reset this month's used credits to 0?")}><RotateCcw size={13} /> Reset this month&apos;s credits</button>
        </section>

        {/* Account actions */}
        <section className="pdfapi-card">
          <h3>Password &amp; account</h3>
          <button className="pdfapi-btn pdfapi-btn-secondary ud-btn" disabled={!!busy} onClick={() => act("send_reset", {}, `Email a password reset link to ${p.email}?`)}>
            <Mail size={13} /> {busy === "send_reset" ? "Sending…" : "Send password reset link"}
          </button>

          <div className="ud-label" style={{ marginTop: 14 }}><KeyRound size={13} /> Set a new password</div>
          <div className="ud-row">
            <input className="pdfapi-input" type="text" placeholder="New password (min 8 characters)" value={newPw} onChange={(e) => setNewPw(e.target.value)} autoComplete="off" />
            <button className="pdfapi-btn pdfapi-btn-secondary" disabled={!!busy || newPw.length < 8} onClick={() => act("set_password", { password: newPw }, `Set this new password for ${p.email}?`)}>Set</button>
          </div>
          <p className="ud-muted" style={{ fontSize: 12, margin: "6px 0 0" }}>Share it with the user privately and ask them to change it in Settings.</p>

          {!d.auth?.email_confirmed_at && (
            <button className="pdfapi-btn pdfapi-btn-secondary ud-btn" disabled={!!busy} onClick={() => act("confirm_email", {}, "Mark this email as verified?")}><ShieldCheck size={13} /> Mark email as verified</button>
          )}

          <div className="ud-sep" />
          {p.is_active ? (
            <button className="pdfapi-btn pdfapi-btn-danger ud-btn" disabled={!!busy} onClick={() => act("suspend", {}, "Suspend this account? All API calls will be blocked.")}><Ban size={13} /> Suspend account</button>
          ) : (
            <button className="pdfapi-btn pdfapi-btn-secondary ud-btn" disabled={!!busy} onClick={() => act("unsuspend")}><ShieldCheck size={13} /> Re-activate account</button>
          )}
        </section>
      </div>

      {/* Payments */}
      <section className="pdfapi-card ud-table-card">
        <h3>Payments</h3>
        {d.payments.length === 0 ? <p className="ud-muted">No payments.</p> : (
          <div style={{ overflowX: "auto" }}>
            <table className="ud-table">
              <thead><tr><th>Date</th><th>Receipt</th><th>Plan</th><th>Amount</th><th>Status</th><th>Payment ID</th></tr></thead>
              <tbody>{d.payments.map((x) => (
                <tr key={x.id}>
                  <td>{dt(x.paid_at ?? x.created_at)}</td><td>{x.receipt_no ?? "—"}</td>
                  <td style={{ textTransform: "capitalize" }}>{x.plan_id} · {x.cycle}{x.rzp_subscription_id ? " · auto" : ""}</td>
                  <td>{inr(x.amount)}</td><td>{x.status}</td><td className="ud-mono">{x.payment_id ?? "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>

      {/* Activity */}
      <section className="pdfapi-card ud-table-card">
        <h3>Recent activity <span className="ud-muted" style={{ fontWeight: 400, fontSize: 13 }}>— last {d.requests.length} requests, {ok30} successful</span></h3>
        {d.requests.length === 0 ? <p className="ud-muted">No API requests yet.</p> : (
          <div style={{ overflowX: "auto" }}>
            <table className="ud-table">
              <thead><tr><th>Time</th><th>Endpoint</th><th>Status</th><th>Size</th><th>Time taken</th><th>Credits</th><th>Request ID</th></tr></thead>
              <tbody>{d.requests.map((r) => (
                <tr key={r.request_id}>
                  <td>{dt(r.created_at)}</td>
                  <td>{r.endpoint}{r.is_test ? <span className="ud-muted"> · test</span> : ""}</td>
                  <td>{r.status === "completed" ? <span className="ud-ok">ok</span> : <span className="ud-bad">{r.error_code ?? r.status}</span>}</td>
                  <td>{kb(r.output_size_bytes)}</td><td>{r.response_ms ? `${r.response_ms} ms` : "—"}</td>
                  <td>{r.credits_used ?? 0}</td><td className="ud-mono">{r.request_id}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>

      {/* Keys */}
      <section className="pdfapi-card ud-table-card">
        <h3>API keys</h3>
        {d.keys.length === 0 ? <p className="ud-muted">No keys created.</p> : (
          <table className="ud-table">
            <thead><tr><th>Name</th><th>Key</th><th>Type</th><th>Status</th><th>Last used</th><th>Created</th></tr></thead>
            <tbody>{d.keys.map((k) => (
              <tr key={k.id}>
                <td>{k.name}</td><td className="ud-mono">{k.key_prefix}…{k.key_hint}</td><td>{k.is_test ? "test" : "live"}</td>
                <td>{k.is_active ? <span className="ud-ok">active</span> : <span className="ud-muted">revoked</span>}</td>
                <td>{dt(k.last_used_at)}</td><td>{day(k.created_at)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </section>

      <style>{`
        .ud-back { display: inline-flex; gap: 6px; align-items: center; color: var(--pdf-muted); text-decoration: none; font-size: 13px; margin-bottom: 12px; }
        .ud-head h1 { margin: 0 0 6px; font-size: 22px; word-break: break-all; }
        .ud-head { margin-bottom: 18px; }
        .ud-muted { color: var(--pdf-muted); font-size: 13px; }
        .ud-ok { color: var(--pdf-success); } .ud-warn { color: #f59e0b; } .ud-bad { color: var(--pdf-error); }
        .ud-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .ud h3 { margin: 0 0 12px; font-size: 15px; }
        .ud-kv { display: flex; justify-content: space-between; gap: 12px; font-size: 14px; padding: 6px 0; border-bottom: 1px solid var(--pdf-border); }
        .ud-kv span { color: var(--pdf-muted); }
        .ud-sep { border-top: 1px solid var(--pdf-border); margin: 14px 0; }
        .ud-label { display: flex; gap: 6px; align-items: center; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .ud-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .ud-row .pdfapi-input { flex: 1; min-width: 140px; }
        .ud-btn { display: flex; gap: 6px; align-items: center; margin-top: 10px; }
        .ud-table-card { margin-bottom: 16px; }
        .ud-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 640px; }
        .ud-table th { text-align: left; color: var(--pdf-muted); font-weight: 500; font-size: 12px; padding: 8px 10px; border-bottom: 1px solid var(--pdf-border); white-space: nowrap; }
        .ud-table td { padding: 8px 10px; border-bottom: 1px solid var(--pdf-border); white-space: nowrap; }
        .ud-mono { font-family: ui-monospace, monospace; font-size: 12px; color: var(--pdf-muted); }
        @media (max-width: 900px) { .ud-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
