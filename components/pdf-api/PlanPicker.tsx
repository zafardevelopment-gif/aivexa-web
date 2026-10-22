"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";

export type PickerPlan = {
  id: string; name: string; price_monthly: number; price_yearly: number;
  credits: number; features: string[]; sort_order?: number;
};

const inr = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
const HIGHER_FROM = 10; // sort_order >= 10 → shown with "Show higher plans"

export default function PlanPicker({
  plans,
  currentPlanId,
  currentCredits,
  onChoose,
  busyPlanId,
}: {
  plans: PickerPlan[];
  /** Dashboard: the signed-in user's plan. Public page: leave empty. */
  currentPlanId?: string;
  currentCredits?: number;
  /** Dashboard: start payment. Public page: leave empty to link to signup. */
  onChoose?: (plan: PickerPlan, cycle: "monthly" | "yearly", autoRenew: boolean) => void;
  busyPlanId?: string | null;
}) {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [autoRenew, setAutoRenew] = useState(true);
  const currentIsHigher = (plans.find((p) => p.id === currentPlanId)?.sort_order ?? 0) >= HIGHER_FROM;
  const [higher, setHigher] = useState(currentIsHigher);
  const hasHigher = plans.some((p) => (p.sort_order ?? 0) >= HIGHER_FROM);

  const base = plans.filter((p) => (p.sort_order ?? 0) < HIGHER_FROM);
  const shown = higher
    ? [base[base.length - 1], ...plans.filter((p) => (p.sort_order ?? 0) >= HIGHER_FROM)].filter(Boolean)
    : base;
  const current = plans.find((p) => p.id === currentPlanId);

  return (
    <div className="pp">
      <div className="pp-head">
        <h2>Choose your plan</h2>
        <p>
          {current
            ? <>You&apos;re on the <b>{current.name}</b> plan with {(currentCredits ?? current.credits).toLocaleString("en-IN")} credits a month. Switch whenever your volume changes.</>
            : <>Start free with 100 credits a month. Upgrade whenever your volume grows.</>}
        </p>
        <div className="pp-toggle" role="tablist">
          <button className={cycle === "monthly" ? "on" : ""} onClick={() => setCycle("monthly")}>Monthly</button>
          <button className={cycle === "yearly" ? "on" : ""} onClick={() => setCycle("yearly")}>
            Yearly <span className="pp-pill">2 months free</span>
          </button>
        </div>
      </div>

      <div className="pp-opts">
      {onChoose && (
        <label className="pp-switch">
          <input type="checkbox" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} />
          <span className="pp-track"><span /></span>
          Auto-renew with UPI Autopay / card (cancel anytime)
        </label>
      )}
      {hasHigher && (
        <label className="pp-switch">
          <input type="checkbox" checked={higher} onChange={(e) => setHigher(e.target.checked)} />
          <span className="pp-track"><span /></span>
          Show higher plans
        </label>
      )}
      </div>

      <div className="pp-grid">
        {shown.map((p) => {
          const free = p.price_monthly === 0;
          const isCurrent = p.id === currentPlanId;
          const price = free ? 0 : cycle === "yearly" ? p.price_yearly : p.price_monthly;
          const per = free || cycle === "monthly" ? "month" : "year";
          let action: React.ReactNode;
          if (isCurrent && free) action = <div className="pp-btn is-current">Current</div>;
          else if (onChoose) {
            action = free
              ? <div className="pp-btn is-muted">Included</div>
              : <button className="pp-btn" disabled={!!busyPlanId} onClick={() => onChoose(p, cycle, autoRenew)}>
                  {busyPlanId === p.id ? "Opening…" : isCurrent ? "Renew" : "Change Plan"}
                </button>;
          } else {
            action = <Link className="pp-btn" href={free ? "/pdf-api/login?mode=signup" : "/pdf-api/dashboard/billing"}>{free ? "Start free" : "Choose plan"}</Link>;
          }
          return (
            <div key={p.id} className={`pp-card${isCurrent ? " is-cur" : ""}`}>
              <div className="pp-top">
                <h3>{p.name}</h3>
                {isCurrent && <span className="pp-badge">Current plan</span>}
              </div>
              <div className="pp-price">{inr(price)}<span> / {per}</span></div>
              {!free && <div className="pp-gst">+ 18% GST{cycle === "yearly" ? ` · ${inr(Math.round(p.price_yearly / 12))}/month` : ""}</div>}
              <div className="pp-credits">{p.credits.toLocaleString("en-IN")} credits / month</div>
              <hr />
              <ul>
                {(Array.isArray(p.features) ? p.features : []).map((f) => (
                  <li key={f}><span className="pp-tick"><Check size={11} /></span>{f}</li>
                ))}
              </ul>
              {action}
            </div>
          );
        })}
      </div>

      <div className="pp-notes">
        <div><b>Credits</b><p>Each started 5 MB of a generated PDF uses 1 credit, so most documents use exactly 1. Test keys and failed requests use none.</p></div>
        <div><b>GST</b><p>Prices exclude GST. 18% GST is added at checkout (CGST + SGST for Bihar, IGST for other states). Add your GSTIN under Billing details to get it on the invoice.</p></div>
      </div>

      <div className="pp-more">
        <div><b>Need more than these plans offer?</b><p>Contact us for a custom plan or pricing.</p></div>
        <a className="pp-btn pp-chat" href="https://wa.me/919204298771?text=Hi%2C%20I%20need%20a%20custom%20AIVEXA%20PDF%20API%20plan" target="_blank" rel="noopener noreferrer">
          <MessageCircle size={14} /> Start chat
        </a>
      </div>

      <style>{`
        .pp-head { text-align: center; margin-bottom: 18px; }
        .pp-head h2 { font-size: 26px; margin: 0 0 6px; letter-spacing: -0.01em; }
        .pp-head p { color: var(--pdf-muted); font-size: 14px; margin: 0 0 16px; }
        .pp-toggle { display: inline-flex; gap: 4px; padding: 4px; border-radius: 10px; background: var(--pdf-surface); border: 1px solid var(--pdf-border); }
        .pp-toggle button { border: 0; background: transparent; color: var(--pdf-muted); padding: 7px 16px; border-radius: 8px; font: inherit; font-size: 14px; cursor: pointer; display: inline-flex; gap: 8px; align-items: center; }
        .pp-toggle button.on { background: var(--pdf-text); color: var(--pdf-bg, #0b0d12); font-weight: 600; }
        .pp-pill { background: rgba(34,197,94,0.15); color: var(--pdf-success); font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
        .pp-opts { display: flex; gap: 24px; flex-wrap: wrap; }
        .pp-switch { display: inline-flex; align-items: center; gap: 10px; font-size: 14px; color: var(--pdf-muted); cursor: pointer; margin: 6px 0 16px; user-select: none; }
        .pp-switch input { display: none; }
        .pp-track { width: 32px; height: 18px; border-radius: 999px; background: var(--pdf-border); position: relative; transition: background .2s; }
        .pp-track span { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: left .2s; }
        .pp-switch input:checked + .pp-track { background: var(--pdf-accent); }
        .pp-switch input:checked + .pp-track span { left: 16px; }
        .pp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; }
        .pp-card { background: var(--pdf-surface); border: 1px solid var(--pdf-border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; }
        .pp-card.is-cur { border-color: var(--pdf-accent); }
        .pp-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 14px; }
        .pp-top h3 { margin: 0; font-size: 16px; }
        .pp-badge { font-size: 11px; padding: 3px 9px; border-radius: 999px; background: rgba(99,102,241,0.15); color: var(--pdf-accent-light, #a5b4fc); }
        .pp-price { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; }
        .pp-price span { font-size: 13px; font-weight: 400; color: var(--pdf-muted); }
        .pp-gst { font-size: 12px; color: var(--pdf-muted); margin-top: 2px; }
        .pp-credits { font-weight: 700; font-size: 14px; margin-top: 6px; }
        .pp-card hr { border: 0; border-top: 1px solid var(--pdf-border); margin: 16px 0; }
        .pp-card ul { list-style: none; margin: 0 0 18px; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--pdf-muted); flex: 1; }
        .pp-card li { display: flex; gap: 10px; align-items: flex-start; }
        .pp-tick { flex-shrink: 0; width: 18px; height: 18px; border-radius: 50%; background: rgba(99,102,241,0.15); color: var(--pdf-accent-light, #a5b4fc); display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
        .pp-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 10px 0; border-radius: 8px; border: 1px solid var(--pdf-accent); color: var(--pdf-accent-light, #a5b4fc); background: transparent; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; }
        .pp-btn:hover:not(:disabled) { background: rgba(99,102,241,0.1); }
        .pp-btn:disabled { opacity: .6; cursor: default; }
        .pp-btn.is-current, .pp-btn.is-muted { border-color: var(--pdf-border); color: var(--pdf-muted); background: rgba(255,255,255,0.03); cursor: default; }
        .pp-notes { display: grid; grid-template-columns: 1fr 1.6fr; gap: 24px; margin: 22px 0; font-size: 13px; }
        .pp-notes p { color: var(--pdf-muted); margin: 4px 0 0; line-height: 1.55; }
        .pp-more { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding: 18px 22px; border-radius: 12px; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); }
        .pp-more p { margin: 3px 0 0; color: var(--pdf-muted); font-size: 14px; }
        .pp-chat { width: auto; padding: 9px 16px; }
        @media (max-width: 640px) { .pp-notes { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
