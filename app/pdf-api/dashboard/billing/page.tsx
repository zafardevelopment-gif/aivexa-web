"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Check, Zap, Download, ShieldCheck, Pencil } from "lucide-react";

type Plan = {
  id: string; name: string; price_monthly: number; price_yearly: number;
  credits: number; parallel: number; max_pdf_bytes: number; rate_limit_rpm: number; features: string[];
};
type Summary = {
  plan: { id: string; name: string; credits: number; credits_used: number; credits_reset_at: string | null; expires_at: string | null; cycle: string | null; price: number };
  payments: { id: number; receipt_no: string; plan_id: string; cycle: string; amount: number; paid_at: string; payment_id: string }[];
  billing: { name: string; company: string; gstin: string; address: string; email: string };
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const inr = (paise: number) => (paise === 0 ? "₹0" : `₹${(paise / 100).toLocaleString("en-IN")}`);
const day = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", gstin: "", address: "" });
  const [formMsg, setFormMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
  const plansRef = useRef<HTMLDivElement>(null);

  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const authHeader = useCallback(async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession();
    return { Authorization: session ? `Bearer ${session.access_token}` : "" };
  }, [supabase]);

  const load = useCallback(async () => {
    const headers = await authHeader();
    const [p, s] = await Promise.all([
      fetch("/api/v1/plans").then((r) => r.json()).catch(() => ({ plans: [] })),
      fetch("/api/v1/billing", { headers }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]);
    setPlans(p.plans ?? []);
    if (s) {
      setSummary(s);
      setForm({ name: s.billing.name, company: s.billing.company, gstin: s.billing.gstin, address: s.billing.address });
    }
  }, [authHeader]);

  useEffect(() => { load(); }, [load]);

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const buy = async (plan: Plan, buyCycle: "monthly" | "yearly") => {
    if (loadingPlan) return;
    setLoadingPlan(plan.id);
    try {
      if (!(await loadRazorpay())) { alert("Could not load the payment window. Please check your internet connection."); setLoadingPlan(null); return; }
      const headers = await authHeader();
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ planId: plan.id, cycle: buyCycle }),
      });
      const order = await res.json().catch(() => ({}));
      if (!res.ok) { alert(order.error ?? "Could not start payment. Please try again."); setLoadingPlan(null); return; }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "AIVEXA PDF API",
        description: `${plan.name} plan — ${buyCycle}`,
        order_id: order.orderId,
        prefill: { email: order.userEmail ?? "", name: summary?.billing.name || order.userName || "" },
        theme: { color: "#6366f1" },
        handler: async (r: Record<string, string>) => {
          const vh = await authHeader();
          const v = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...vh },
            body: JSON.stringify({ orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature }),
          });
          setLoadingPlan(null);
          if (v.ok) { alert(`Payment successful. You are now on the ${plan.name} plan.`); load(); }
          else alert("Payment received but the plan could not be updated. Please contact support with your payment ID: " + r.razorpay_payment_id);
        },
        modal: { ondismiss: () => setLoadingPlan(null) },
      });
      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  const downloadReceipt = async (id: number, no: string) => {
    setDownloading(id);
    try {
      const res = await fetch(`/api/v1/billing/receipt?id=${id}`, { headers: await authHeader() });
      if (!res.ok) { alert("Could not download the receipt. Please try again."); return; }
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url; a.download = `${no}.pdf`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally { setDownloading(null); }
  };

  const saveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    const res = await fetch("/api/v1/billing", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify(form),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setFormMsg({ ok: false, text: d.error ?? "Could not save." }); return; }
    setEditing(false);
    load();
  };

  const p = summary?.plan;
  const currentPlan = plans.find((x) => x.id === p?.id);
  const isPaid = !!p && p.id !== "free";
  const usedPct = p ? Math.min(100, Math.round((p.credits_used / Math.max(p.credits, 1)) * 100)) : 0;
  const daysLeft = p?.expires_at ? Math.ceil((new Date(p.expires_at).getTime() - Date.now()) / 86400000) : null;

  return (
    <div className="bill">
      <h1 className="bill-h1">Billing</h1>

      <div className="bill-top">
        {/* Current plan */}
        <section className="pdfapi-card bill-card">
          <div className="bill-card-head">Current plan</div>
          {!summary ? <p className="bill-muted">Loading…</p> : (
            <>
              <div className="bill-plan">
                <div>
                  <div className="bill-plan-name">{p!.name} <span className="pdfapi-badge pdfapi-badge-success">Active</span></div>
                  <div className="bill-price">
                    {isPaid ? inr(p!.price) : "₹0"}
                    <span>/ {p!.cycle === "yearly" ? "year" : "month"}</span>
                  </div>
                </div>
                <div>
                  <div className="bill-credits">{p!.credits.toLocaleString("en-IN")} PDFs / month</div>
                  <div className="bill-muted">
                    {isPaid
                      ? <>Valid until <b>{day(p!.expires_at)}</b>{daysLeft !== null && daysLeft <= 7 ? ` — ${Math.max(daysLeft, 0)} day(s) left` : ""}. No auto-renewal.</>
                      : <>Free forever. Credits reset on {day(p!.credits_reset_at)}.</>}
                  </div>
                </div>
              </div>

              <div className="bill-usage">
                <div className="bill-usage-row"><span>{p!.credits_used.toLocaleString("en-IN")} of {p!.credits.toLocaleString("en-IN")} PDFs used this month</span><span>{usedPct}%</span></div>
                <div className="bill-bar"><div style={{ width: `${usedPct}%`, background: usedPct >= 90 ? "var(--pdf-error)" : "var(--pdf-accent)" }} /></div>
              </div>

              <div className="bill-actions">
                <button className="pdfapi-btn pdfapi-btn-primary" onClick={() => plansRef.current?.scrollIntoView({ behavior: "smooth" })}>
                  {isPaid ? "Change plan" : "Upgrade plan"}
                </button>
                {isPaid && currentPlan && (
                  <button className="pdfapi-btn pdfapi-btn-secondary" disabled={!!loadingPlan}
                    onClick={() => buy(currentPlan, p!.cycle === "yearly" ? "yearly" : "monthly")}>
                    {loadingPlan === currentPlan.id ? "Opening…" : "Renew now"}
                  </button>
                )}
              </div>
            </>
          )}
        </section>

        <div className="bill-side">
          {/* Payment method */}
          <section className="pdfapi-card bill-card">
            <div className="bill-card-head">Payment method</div>
            <div className="bill-pm">
              <ShieldCheck size={22} color="var(--pdf-success)" />
              <div>
                <div style={{ fontWeight: 600 }}>Razorpay secure checkout</div>
                <div className="bill-muted">UPI, cards, net banking and wallets. We never store your card details.</div>
              </div>
            </div>
          </section>

          {/* Billing details */}
          <section className="pdfapi-card bill-card">
            <div className="bill-card-head">
              Billing details
              {!editing && <button className="bill-link" onClick={() => setEditing(true)}><Pencil size={12} /> Edit</button>}
            </div>
            {!summary ? <p className="bill-muted">Loading…</p> : !editing ? (
              <div className="bill-details">
                <div><div className="bill-label">Name</div>{summary.billing.name || <span className="bill-muted">Not added</span>}</div>
                <div><div className="bill-label">Company / GSTIN</div>{summary.billing.company || "—"}{summary.billing.gstin ? <><br />{summary.billing.gstin}</> : null}</div>
                <div><div className="bill-label">Billing email</div>{summary.billing.email}</div>
                <div><div className="bill-label">Address</div><span style={{ whiteSpace: "pre-line" }}>{summary.billing.address || "—"}</span></div>
              </div>
            ) : (
              <form onSubmit={saveDetails} className="bill-form">
                <input className="pdfapi-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="pdfapi-input" placeholder="Company (optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <input className="pdfapi-input" placeholder="GSTIN (optional)" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })} maxLength={15} />
                <textarea className="pdfapi-input" placeholder="Billing address (optional)" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                {formMsg && <div style={{ fontSize: 13, color: formMsg.ok ? "var(--pdf-success)" : "var(--pdf-error)" }}>{formMsg.text}</div>}
                <div className="bill-actions">
                  <button type="submit" className="pdfapi-btn pdfapi-btn-primary">Save</button>
                  <button type="button" className="pdfapi-btn pdfapi-btn-secondary" onClick={() => { setEditing(false); setFormMsg(null); }}>Cancel</button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>

      {/* Payments / receipts */}
      <section className="pdfapi-card bill-card" style={{ padding: 0, marginBottom: 32 }}>
        <div className="bill-card-head" style={{ padding: "18px 20px 0" }}>Payments</div>
        {!summary ? <p className="bill-muted" style={{ padding: 20 }}>Loading…</p> : summary.payments.length === 0 ? (
          <p className="bill-muted" style={{ padding: "8px 20px 20px" }}>No payments yet. Your receipts will appear here after you upgrade.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="bill-table">
              <thead><tr><th>Receipt</th><th>Date</th><th>Plan</th><th style={{ textAlign: "right" }}>Amount</th><th /></tr></thead>
              <tbody>
                {summary.payments.map((x) => (
                  <tr key={x.id}>
                    <td style={{ fontWeight: 600 }}>{x.receipt_no}</td>
                    <td>{day(x.paid_at)}</td>
                    <td style={{ textTransform: "capitalize" }}>{plans.find((pl) => pl.id === x.plan_id)?.name ?? x.plan_id} · {x.cycle}</td>
                    <td style={{ textAlign: "right" }}>{inr(x.amount)}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="pdfapi-btn pdfapi-btn-secondary bill-pdf" disabled={downloading === x.id} onClick={() => downloadReceipt(x.id, x.receipt_no)}>
                        <Download size={13} /> {downloading === x.id ? "…" : "PDF"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Plans */}
      <div ref={plansRef} className="bill-plans-head">
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>Plans</h2>
          <p className="bill-muted" style={{ margin: "4px 0 0" }}>Prices in INR. Pay once for a month or a year — no auto-renewal.</p>
        </div>
        <div className="bill-toggle">
          {(["monthly", "yearly"] as const).map((c) => (
            <button key={c} onClick={() => setCycle(c)} className={cycle === c ? "is-on" : ""}>{c === "monthly" ? "Monthly" : "Yearly · 2 months free"}</button>
          ))}
        </div>
      </div>

      <div className="bill-grid">
        {plans.map((plan) => {
          const price = cycle === "monthly" ? plan.price_monthly : plan.price_yearly;
          const isCurrent = plan.id === p?.id;
          const isFree = plan.price_monthly === 0;
          const isPro = plan.id === "pro";
          return (
            <div key={plan.id} className="pdfapi-card" style={{ position: "relative", borderColor: isCurrent ? "var(--pdf-success)" : isPro ? "var(--pdf-accent)" : undefined }}>
              {isPro && <div className="bill-ribbon">MOST POPULAR</div>}
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                {plan.name} {isCurrent && <span className="pdfapi-badge pdfapi-badge-success" style={{ fontSize: 10 }}>Current</span>}
              </div>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 28, fontWeight: 800 }}>{inr(price)}</span>
                {price > 0 && <span className="bill-muted"> / {cycle === "monthly" ? "month" : "year"}</span>}
              </div>
              <ul className="bill-feat">
                {(Array.isArray(plan.features) ? plan.features : []).map((f) => (
                  <li key={f}><Check size={13} color="var(--pdf-success)" style={{ flexShrink: 0, marginTop: 2 }} />{f}</li>
                ))}
              </ul>
              <button
                className={`pdfapi-btn ${isPro && !isCurrent ? "pdfapi-btn-primary" : "pdfapi-btn-secondary"}`}
                style={{ width: "100%", justifyContent: "center" }}
                disabled={isFree || loadingPlan !== null}
                onClick={() => !isFree && buy(plan, cycle)}
              >
                {loadingPlan === plan.id ? "Opening…" : isFree ? (isCurrent ? "Current plan" : "Free") : isCurrent ? `Renew ${plan.name}` : `Get ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="pdfapi-card bill-ent">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="bill-ent-icon"><Zap size={20} color="var(--pdf-accent)" /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Need more than 5,000 PDFs a month?</div>
            <div className="bill-muted">Custom volume, GST invoice billing and a dedicated support line.</div>
          </div>
        </div>
        <a href="https://wa.me/919204298771?text=Hi%2C%20I%20need%20a%20custom%20AIVEXA%20PDF%20API%20plan" target="_blank" rel="noopener noreferrer" className="pdfapi-btn pdfapi-btn-primary">Talk to us</a>
      </div>

      <style>{`
        .bill-h1 { font-size: 24px; font-weight: 700; margin: 0 0 22px; letter-spacing: -0.02em; }
        .bill-muted { color: var(--pdf-muted); font-size: 13px; line-height: 1.6; }
        .bill-top { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 20px; margin-bottom: 20px; align-items: start; }
        .bill-side { display: flex; flex-direction: column; gap: 20px; }
        .bill-card-head { font-size: 15px; font-weight: 600; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--pdf-border); display: flex; justify-content: space-between; align-items: center; }
        .bill-plan { display: flex; gap: 28px; flex-wrap: wrap; align-items: flex-start; }
        .bill-plan-name { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .bill-price { font-size: 32px; font-weight: 800; margin-top: 4px; letter-spacing: -0.02em; }
        .bill-price span { font-size: 13px; font-weight: 400; color: var(--pdf-muted); margin-left: 6px; }
        .bill-credits { font-size: 15px; font-weight: 600; margin: 4px 0 4px; }
        .bill-usage { margin: 18px 0 16px; }
        .bill-usage-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--pdf-muted); margin-bottom: 6px; }
        .bill-bar { height: 8px; border-radius: 999px; background: var(--pdf-border); overflow: hidden; }
        .bill-bar > div { height: 100%; border-radius: 999px; transition: width .3s; }
        .bill-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .bill-pm { display: flex; gap: 12px; align-items: flex-start; font-size: 14px; }
        .bill-link { background: none; border: 0; color: var(--pdf-accent); cursor: pointer; font-size: 13px; display: inline-flex; gap: 4px; align-items: center; }
        .bill-details { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; font-size: 14px; }
        .bill-label { font-size: 11px; color: var(--pdf-muted); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 3px; }
        .bill-form { display: flex; flex-direction: column; gap: 10px; }
        .bill-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .bill-table th { text-align: left; font-size: 12px; font-weight: 500; color: var(--pdf-muted); padding: 10px 20px; border-bottom: 1px solid var(--pdf-border); }
        .bill-table td { padding: 12px 20px; border-bottom: 1px solid var(--pdf-border); white-space: nowrap; }
        .bill-table tr:last-child td { border-bottom: 0; }
        .bill-pdf { padding: 5px 12px; font-size: 12px; display: inline-flex; gap: 6px; align-items: center; }
        .bill-plans-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
        .bill-toggle { display: flex; gap: 4px; background: var(--pdf-surface); border: 1px solid var(--pdf-border); border-radius: 10px; padding: 4px; }
        .bill-toggle button { border: 0; background: transparent; color: var(--pdf-muted); padding: 6px 14px; border-radius: 7px; font-size: 13px; cursor: pointer; font-family: inherit; }
        .bill-toggle button.is-on { background: var(--pdf-accent); color: #fff; }
        .bill-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .bill-feat { list-style: none; padding: 0; margin: 0 0 18px; display: flex; flex-direction: column; gap: 8px; font-size: 13px; }
        .bill-feat li { display: flex; gap: 8px; align-items: flex-start; }
        .bill-ribbon { position: absolute; top: -1px; right: 16px; background: var(--pdf-accent); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: .08em; padding: 3px 10px; border-radius: 0 0 8px 8px; }
        .bill-ent { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .bill-ent-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(99,102,241,0.15); display: flex; align-items: center; justify-content: center; }
        @media (max-width: 900px) { .bill-top { grid-template-columns: 1fr; } }
        @media (max-width: 520px) { .bill-details { grid-template-columns: 1fr; } .bill-price { font-size: 26px; } }
      `}</style>
    </div>
  );
}
