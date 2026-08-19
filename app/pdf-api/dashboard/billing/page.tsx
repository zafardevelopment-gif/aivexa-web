"use client";

import { useEffect, useState } from "react";
import { Check, Zap } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  credits: number;
  parallel: number;
  max_pdf_bytes: number;
  rate_limit_rpm: number;
  features: string[];
};

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [currentPlan, setCurrentPlan] = useState<string>("free");

  useEffect(() => {
    // Fetch plans from API
    fetch("/api/v1/plans")
      .then(r => r.json())
      .then(d => setPlans(d.plans ?? []))
      .catch(() => {});

    // Fetch current user plan
    fetch("/api/v1/usage")
      .then(r => r.json())
      .then(d => setCurrentPlan(d.plan?.id ?? "free"))
      .catch(() => {});
  }, []);

  const formatPrice = (paise: number) => {
    if (paise === 0) return "₹0";
    return `₹${(paise / 100).toLocaleString("en-IN")}`;
  };

  const yearlyMonthly = (paise: number) =>
    paise > 0 ? `₹${Math.round(paise / 100 / 12).toLocaleString("en-IN")}/mo` : "Free";

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Billing</h1>
        <p style={{ fontSize: 14, color: "var(--pdf-muted)", marginTop: 6 }}>
          Choose the plan that fits your usage. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Billing cycle toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{
          display: "flex", gap: 4,
          background: "var(--pdf-surface)",
          border: "1px solid var(--pdf-border)",
          borderRadius: 10, padding: 4,
        }}>
          {(["monthly", "yearly"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className="pdfapi-btn"
              style={{
                padding: "6px 20px", fontSize: 13,
                background: cycle === c ? "var(--pdf-accent)" : "transparent",
                color: cycle === c ? "#fff" : "var(--pdf-muted)",
              }}
            >
              {c === "monthly" ? "Monthly" : "Yearly"}
            </button>
          ))}
        </div>
        {cycle === "yearly" && (
          <span className="pdfapi-badge pdfapi-badge-success">Save 2 months free</span>
        )}
      </div>

      {/* Plans grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isPro = plan.id === "pro";
          const price = cycle === "monthly" ? plan.price_monthly : plan.price_yearly;

          return (
            <div
              key={plan.id}
              className="pdfapi-card"
              style={{
                position: "relative",
                borderColor: isPro ? "var(--pdf-accent)" : isCurrent ? "var(--pdf-success)" : "var(--pdf-border)",
                background: isPro ? "rgba(99,102,241,0.06)" : undefined,
              }}
            >
              {isPro && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: "var(--pdf-accent)", color: "#fff",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  padding: "3px 12px", borderRadius: "0 0 8px 8px",
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{plan.name}</div>
                {isCurrent && (
                  <span className="pdfapi-badge pdfapi-badge-success" style={{ fontSize: 10, marginTop: 4 }}>
                    Current Plan
                  </span>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {cycle === "monthly"
                    ? formatPrice(price)
                    : (price === 0 ? "₹0" : yearlyMonthly(price))}
                </span>
                {price > 0 && (
                  <span style={{ fontSize: 13, color: "var(--pdf-muted)", marginLeft: 4 }}>
                    /{cycle === "monthly" ? "mo" : "yr"}
                  </span>
                )}
                {cycle === "yearly" && price > 0 && (
                  <div style={{ fontSize: 11, color: "var(--pdf-muted)", marginTop: 4 }}>
                    Billed {formatPrice(price)}/year
                  </div>
                )}
              </div>

              <div style={{ fontSize: 13, color: "var(--pdf-muted)", marginBottom: 20 }}>
                <strong style={{ color: "var(--pdf-text)", fontSize: 15 }}>
                  {plan.credits.toLocaleString()}
                </strong> PDFs/month
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                {(Array.isArray(plan.features) ? plan.features : []).map((f: string) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                    <Check size={13} color="var(--pdf-success)" style={{ marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`pdfapi-btn ${isCurrent ? "pdfapi-btn-secondary" : isPro ? "pdfapi-btn-primary" : "pdfapi-btn-secondary"}`}
                style={{ width: "100%", justifyContent: "center" }}
                disabled={isCurrent}
              >
                {isCurrent ? "Current Plan" : plan.price_monthly === 0 ? "Get Started" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Enterprise */}
      <div className="pdfapi-card" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(99,102,241,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={20} color="var(--pdf-accent)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Enterprise</div>
            <div style={{ fontSize: 13, color: "var(--pdf-muted)", marginTop: 2 }}>
              Custom volume, dedicated infrastructure, invoice billing, SLA.
            </div>
          </div>
        </div>
        <a
          href="mailto:mdzafareqbal@gmail.com?subject=AIVEXA PDF API - Enterprise Plan"
          className="pdfapi-btn pdfapi-btn-primary"
        >
          Contact Sales
        </a>
      </div>
    </div>
  );
}
