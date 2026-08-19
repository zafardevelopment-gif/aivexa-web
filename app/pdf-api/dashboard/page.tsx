"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FileText, CheckCircle, XCircle, Clock, Zap } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

type UsageData = {
  plan: {
    id: string; name: string;
    credits: number; credits_used: number; credits_reset_at: string;
  };
  daily: { date: string; total: number; success: number; failed: number }[];
  totals: { total: number; success: number; failed: number };
};

export default function DashboardOverview() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [authError, setAuthError] = useState(false);
  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { setAuthError(true); return; }
      fetch("/api/v1/usage?days=30", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((r) => {
          if (r.status === 401) { setAuthError(true); return null; }
          return r.json();
        })
        .then((d) => { if (d && d.plan) setUsage(d); })
        .catch(() => {});
    });
  }, [supabase]);

  if (authError) {
    if (typeof window !== "undefined") window.location.href = "/pdf-api/login";
    return null;
  }

  const creditsUsed = usage?.plan?.credits_used ?? 0;
  const creditsTotal = usage?.plan?.credits ?? 100;
  const usagePct = Math.min(Math.round((creditsUsed / creditsTotal) * 100), 100);
  const successRate = usage?.totals.total
    ? Math.round((usage.totals.success / usage.totals.total) * 100)
    : 100;

  // Build chart data (last 14 days)
  const chartData = usage?.daily.slice(-14) ?? [];
  const maxVal = Math.max(...chartData.map((d) => d.total), 1);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
          Overview
        </h1>
        <p style={{ fontSize: 14, color: "var(--pdf-muted)", marginTop: 6 }}>
          Your PDF API usage for the last 30 days
        </p>
      </div>

      {/* Stat tiles */}
      <div className="pdfapi-stat-grid" style={{ marginBottom: 28 }}>
        <div className="pdfapi-stat">
          <div className="pdfapi-stat-label">Current Plan</div>
          <div className="pdfapi-stat-value" style={{ fontSize: 22 }}>
            {usage?.plan?.name ?? "Free"}
          </div>
          <div className="pdfapi-stat-sub">
            <Link href="/pdf-api/dashboard/billing" style={{ color: "var(--pdf-accent-light)" }}>
              Upgrade plan →
            </Link>
          </div>
        </div>

        <div className="pdfapi-stat">
          <div className="pdfapi-stat-label">Credits Used</div>
          <div className="pdfapi-stat-value">{creditsUsed}</div>
          <div className="pdfapi-stat-sub">of {creditsTotal.toLocaleString()} this month</div>
          <div className="pdfapi-progress-bar" style={{ marginTop: 10 }}>
            <div className="pdfapi-progress-fill" style={{
              width: `${usagePct}%`,
              background: usagePct > 80
                ? "var(--pdf-error)"
                : usagePct > 60
                  ? "var(--pdf-warning)"
                  : undefined,
            }} />
          </div>
        </div>

        <div className="pdfapi-stat">
          <div className="pdfapi-stat-label">Total Requests</div>
          <div className="pdfapi-stat-value">{usage?.totals.total ?? 0}</div>
          <div className="pdfapi-stat-sub">Last 30 days</div>
        </div>

        <div className="pdfapi-stat">
          <div className="pdfapi-stat-label">Success Rate</div>
          <div className="pdfapi-stat-value" style={{
            color: successRate >= 95 ? "var(--pdf-success)"
              : successRate >= 80 ? "var(--pdf-warning)" : "var(--pdf-error)",
          }}>
            {successRate}%
          </div>
          <div className="pdfapi-stat-sub">
            {usage?.totals.failed ?? 0} failed requests
          </div>
        </div>
      </div>

      {/* Chart: Daily requests */}
      <div className="pdfapi-card" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <FileText size={16} color="var(--pdf-accent)" />
          <span style={{ fontWeight: 600, fontSize: 15 }}>Daily Requests — Last 14 Days</span>
        </div>

        {chartData.length === 0 ? (
          <div style={{
            height: 120, display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--pdf-muted)", fontSize: 14,
          }}>
            No requests yet. Make your first API call to see data here.
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
            {chartData.map((day) => {
              const h = Math.max(Math.round((day.total / maxVal) * 100), day.total > 0 ? 4 : 2);
              return (
                <div key={day.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 10, color: "var(--pdf-muted)" }}>{day.total > 0 ? day.total : ""}</div>
                  <div style={{
                    width: "100%", height: `${h}%`,
                    background: day.failed > 0
                      ? "linear-gradient(180deg, var(--pdf-accent) 70%, var(--pdf-error) 100%)"
                      : "var(--pdf-accent)",
                    borderRadius: 4, minHeight: 3,
                    opacity: 0.85,
                  }} title={`${day.date}: ${day.total} total, ${day.failed} failed`} />
                  <div style={{ fontSize: 9, color: "var(--pdf-muted)", transform: "rotate(-45deg)", whiteSpace: "nowrap" }}>
                    {day.date.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="pdfapi-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={16} color="var(--pdf-accent)" /> Quick Start
          </div>
          <p style={{ fontSize: 13, color: "var(--pdf-muted)", lineHeight: 1.6, margin: 0 }}>
            Get your API key and generate your first PDF in under 2 minutes.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/pdf-api/dashboard/api-keys" className="pdfapi-btn pdfapi-btn-primary" style={{ fontSize: 13 }}>
              Get API Key
            </Link>
            <Link href="/pdf-api/dashboard/playground" className="pdfapi-btn pdfapi-btn-secondary" style={{ fontSize: 13 }}>
              Try Playground
            </Link>
          </div>
        </div>

        <div className="pdfapi-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={16} color="var(--pdf-accent)" /> Recent Activity
          </div>
          {(usage?.totals.total ?? 0) === 0 ? (
            <p style={{ fontSize: 13, color: "var(--pdf-muted)", margin: 0 }}>
              No requests yet.{" "}
              <Link href="/pdf-api/docs" style={{ color: "var(--pdf-accent-light)" }}>
                Read the docs →
              </Link>
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--pdf-muted)" }}>
                  <CheckCircle size={13} color="var(--pdf-success)" /> Successful
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{usage?.totals.success}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--pdf-muted)" }}>
                  <XCircle size={13} color="var(--pdf-error)" /> Failed
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{usage?.totals.failed}</span>
              </div>
            </div>
          )}
          <Link href="/pdf-api/dashboard/logs" style={{ fontSize: 13, color: "var(--pdf-accent-light)" }}>
            View all logs →
          </Link>
        </div>
      </div>
    </div>
  );
}
