"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface DayUsage {
  date: string;
  requests: number;
  credits_used: number;
  success_rate: number;
}

interface UsageData {
  days: DayUsage[];
  total_requests: number;
  total_credits: number;
  plan_name: string;
  credits: number;
  credits_used: number;
}

export default function UsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const getAuthHeader = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession();
    return { Authorization: session ? `Bearer ${session.access_token}` : "" };
  };

  async function load() {
    setLoading(true);
    try {
      const headers = await getAuthHeader();
      const res = await fetch(`/api/v1/usage?days=${range}`, { headers });
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [range]);

  const maxReq = data ? Math.max(...data.days.map(d => d.requests), 1) : 1;
  const pct = data && data.credits > 0
    ? Math.round((data.credits_used / data.credits) * 100)
    : 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--pdf-text)" }}>Usage Analytics</h1>
          <p style={{ margin: "4px 0 0", color: "var(--pdf-muted)", fontSize: 14 }}>Monitor your API consumption</p>
        </div>
        <select
          className="pdfapi-select"
          value={range}
          onChange={e => setRange(Number(e.target.value))}
          style={{ width: 140 }}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: "var(--pdf-muted)" }}>Loading…</p>
      ) : !data ? (
        <p style={{ color: "var(--pdf-error)" }}>Failed to load usage data.</p>
      ) : (
        <>
          {/* Summary cards */}
          <div className="pdfapi-stat-grid" style={{ marginBottom: 24 }}>
            <div className="pdfapi-stat">
              <div className="pdfapi-stat-value">{data.total_requests.toLocaleString()}</div>
              <div className="pdfapi-stat-label">Total Requests ({range}d)</div>
            </div>
            <div className="pdfapi-stat">
              <div className="pdfapi-stat-value">{data.total_credits.toLocaleString()}</div>
              <div className="pdfapi-stat-label">Credits Used ({range}d)</div>
            </div>
            <div className="pdfapi-stat">
              <div className="pdfapi-stat-value">{data.credits_used} / {data.credits}</div>
              <div className="pdfapi-stat-label">Monthly Quota</div>
            </div>
            <div className="pdfapi-stat">
              <div className="pdfapi-stat-value">{data.plan_name}</div>
              <div className="pdfapi-stat-label">Current Plan</div>
            </div>
          </div>

          {/* Monthly quota bar */}
          <div className="pdfapi-card" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "var(--pdf-text)", fontSize: 14, fontWeight: 600 }}>Monthly Credit Quota</span>
              <span style={{ color: "var(--pdf-muted)", fontSize: 13 }}>{pct}% used</span>
            </div>
            <div className="pdfapi-progress-bar">
              <div
                className="pdfapi-progress-fill"
                style={{
                  width: `${pct}%`,
                  background: pct > 90 ? "var(--pdf-error)" : pct > 70 ? "var(--pdf-warning)" : "var(--pdf-accent)"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "var(--pdf-muted)" }}>
              <span>{data.credits_used.toLocaleString()} used</span>
              <span>{(data.credits - data.credits_used).toLocaleString()} remaining</span>
            </div>
          </div>

          {/* Daily chart */}
          <div className="pdfapi-card" style={{ marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "var(--pdf-text)" }}>Daily Requests</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 140, overflowX: "auto" }}>
              {data.days.map(d => (
                <div key={d.date} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 20 }}>
                  <div
                    title={`${d.date}: ${d.requests} requests`}
                    style={{
                      width: "100%",
                      height: `${Math.max(4, (d.requests / maxReq) * 120)}px`,
                      background: "var(--pdf-accent)",
                      borderRadius: "3px 3px 0 0",
                      opacity: 0.85,
                      transition: "opacity 0.15s",
                      cursor: "default",
                    }}
                  />
                  {range <= 14 && (
                    <span style={{ fontSize: 10, color: "var(--pdf-muted)", marginTop: 4, whiteSpace: "nowrap" }}>
                      {d.date.slice(5)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Daily table */}
          <div className="pdfapi-card">
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "var(--pdf-text)" }}>Daily Breakdown</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="pdfapi-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Requests</th>
                    <th>Credits Used</th>
                    <th>Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.days].reverse().map(d => (
                    <tr key={d.date}>
                      <td>{d.date}</td>
                      <td>{d.requests.toLocaleString()}</td>
                      <td>{d.credits_used.toLocaleString()}</td>
                      <td>
                        <span style={{ color: d.success_rate >= 95 ? "var(--pdf-success)" : d.success_rate >= 80 ? "var(--pdf-warning)" : "var(--pdf-error)" }}>
                          {d.success_rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
