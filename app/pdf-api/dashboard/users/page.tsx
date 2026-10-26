"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

type Row = {
  id: string; email: string; plan_id: string; plan_name: string; credits: number; credits_used: number;
  plan_expires_at: string | null; is_active: boolean; created_at: string; last_sign_in_at: string | null;
  email_confirmed: boolean; requests_30d: number; failed_30d: number; last_request_at: string | null;
  paid_total: number; last_paid_at: string | null; last_paid_amount: number | null; autopay_on: boolean;
};

function daysLeft(d: string | null) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

const day = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");
const inr = (p: number) => `₹${(Number(p) / 100).toLocaleString("en-IN")}`;

export default function AdminUsersPage() {
  const supabase = useMemo(() => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/v1/admin/users?q=${encodeURIComponent(query)}&page=${page}`, {
      headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setError(res.status === 403 ? "This page is only for AIVEXA admins." : d.error ?? "Could not load users."); setRows([]); }
    else { setRows(d.users ?? []); setTotal(d.total ?? 0); }
    setLoading(false);
  }, [supabase, query, page]);

  useEffect(() => { load(); }, [load]);

  const pages = Math.max(1, Math.ceil(total / 50));
  const paying = rows.filter((r) => r.plan_id !== "free").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Users</h1>
          <p style={{ margin: "6px 0 0", color: "var(--pdf-muted)", fontSize: 14 }}>
            {total.toLocaleString("en-IN")} customers{rows.length ? ` · ${paying} on paid plans (this page)` : ""}
          </p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); setQuery(q.trim()); }} style={{ display: "flex", gap: 8 }}>
          <input className="pdfapi-input" placeholder="Search by email" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 260 }} />
          <button className="pdfapi-btn pdfapi-btn-secondary" type="submit"><Search size={14} /></button>
        </form>
      </div>

      {error && <div className="pdfapi-card" style={{ color: "var(--pdf-error)" }}>{error}</div>}

      {!error && (
        <div className="pdfapi-card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="au-table">
            <thead>
              <tr><th>User</th><th>Plan</th><th>Expires</th><th>Last recharge</th><th>Credits used</th><th>Requests (30d)</th><th>Last active</th><th>Total paid</th><th>Joined</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ color: "var(--pdf-muted)" }}>Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={10} style={{ color: "var(--pdf-muted)" }}>No users found.</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/pdf-api/dashboard/users/${r.id}`} style={{ color: "var(--pdf-text)", fontWeight: 600, textDecoration: "none" }}>{r.email}</Link>
                    {!r.email_confirmed && <span className="au-tag warn">not verified</span>}
                  </td>
                  <td>{r.plan_name}{r.autopay_on && <span className="au-tag ok">auto-pay</span>}</td>
                  <td>
                    {r.plan_expires_at ? (() => {
                      const left = daysLeft(r.plan_expires_at)!;
                      return <>{day(r.plan_expires_at)}<div className="au-sub" style={{ color: left < 0 ? "var(--pdf-error)" : left <= 7 ? "#f59e0b" : undefined }}>{left < 0 ? "expired" : `${left} day${left === 1 ? "" : "s"} left`}{r.autopay_on && left >= 0 ? " · renews" : ""}</div></>;
                    })() : <span className="au-sub">Free — no expiry</span>}
                  </td>
                  <td>{r.last_paid_at ? <>{day(r.last_paid_at)}<div className="au-sub">{inr(r.last_paid_amount ?? 0)}</div></> : "—"}</td>
                  <td>{r.credits_used.toLocaleString("en-IN")} / {r.credits.toLocaleString("en-IN")}</td>
                  <td>{Number(r.requests_30d).toLocaleString("en-IN")}{Number(r.failed_30d) > 0 && <span className="au-sub"> · {r.failed_30d} failed</span>}</td>
                  <td>{day(r.last_request_at ?? r.last_sign_in_at)}</td>
                  <td>{Number(r.paid_total) > 0 ? inr(r.paid_total) : "—"}</td>
                  <td>{day(r.created_at)}</td>
                  <td>{r.is_active ? <span className="au-tag ok">active</span> : <span className="au-tag bad">suspended</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginTop: 14, fontSize: 13, color: "var(--pdf-muted)" }}>
          <button className="pdfapi-btn pdfapi-btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={14} /></button>
          Page {page} of {pages}
          <button className="pdfapi-btn pdfapi-btn-secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}><ChevronRight size={14} /></button>
        </div>
      )}

      <style>{`
        .au-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 1150px; }
        .au-table th { text-align: left; font-size: 12px; font-weight: 500; color: var(--pdf-muted); padding: 12px 16px; border-bottom: 1px solid var(--pdf-border); white-space: nowrap; }
        .au-table td { padding: 12px 16px; border-bottom: 1px solid var(--pdf-border); vertical-align: top; }
        .au-table tr:last-child td { border-bottom: 0; }
        .au-table tbody tr:hover { background: rgba(255,255,255,0.02); }
        .au-sub { font-size: 12px; color: var(--pdf-muted); }
        .au-tag { display: inline-block; margin-left: 6px; font-size: 11px; padding: 1px 7px; border-radius: 999px; }
        .au-tag.ok { background: rgba(34,197,94,0.12); color: var(--pdf-success); }
        .au-tag.warn { background: rgba(245,158,11,0.12); color: #f59e0b; }
        .au-tag.bad { background: rgba(239,68,68,0.12); color: var(--pdf-error); }
      `}</style>
    </div>
  );
}
