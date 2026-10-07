"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAppTraffic,
  getCalivoStats,
  getMiftahStats,
  saveAppMetric,
  saveMiftahImpact,
  type AppMetric,
  type AppTraffic,
  type CalivoStats,
  type CountRow,
  type MiftahImpact,
  type MiftahStats,
} from "@/app/admin/app-actions";

type AppKey = "calivo" | "miftah";

const RANGES = [
  { value: 0, label: "Today" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
];

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const num = (n: number) => n.toLocaleString("en-IN");

// ───────────────────────────── small UI bits ─────────────────────────────

function Card({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <div className="admin-card">
      <b>{value}</b>
      <span>{label}</span>
      {hint && <div style={{ fontSize: ".72rem", color: "var(--muted-2)", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: ".7rem" }}>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 800 }}>{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

function Bars({ data, color = "var(--indigo)" }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
        height: 140,
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "12px 12px 22px",
        position: "relative",
      }}
    >
      {data.map((d) => (
        <div key={d.label} title={`${d.label}: ${d.value}`} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
          <div
            style={{
              height: `${(d.value / max) * 100}%`,
              minHeight: d.value > 0 ? 3 : 0,
              background: color,
              borderRadius: "4px 4px 0 0",
              opacity: 0.85,
            }}
          />
        </div>
      ))}
      <span style={{ position: "absolute", left: 12, bottom: 4, fontSize: ".7rem", color: "var(--muted-2)" }}>
        {data[0]?.label}
      </span>
      <span style={{ position: "absolute", right: 12, bottom: 4, fontSize: ".7rem", color: "var(--muted-2)" }}>
        {data[data.length - 1]?.label}
      </span>
    </div>
  );
}

function TopTable({ title, rows, total }: { title: string; rows: CountRow[]; total: number }) {
  return (
    <table className="admin-table" style={{ marginBottom: 0 }}>
      <thead>
        <tr>
          <th>{title}</th>
          <th style={{ width: 70, textAlign: "right" }}>Views</th>
          <th style={{ width: 60, textAlign: "right" }}>%</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={3} style={{ color: "var(--muted-2)" }}>No data yet</td>
          </tr>
        )}
        {rows.map((r) => (
          <tr key={r.label}>
            <td style={{ wordBreak: "break-all" }}>{r.label}</td>
            <td style={{ textAlign: "right" }}>{num(r.count)}</td>
            <td style={{ textAlign: "right", color: "var(--muted-2)" }}>{total ? Math.round((r.count / total) * 100) : 0}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" };
const input: React.CSSProperties = {
  padding: ".55rem .7rem",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: ".9rem",
  width: "100%",
  background: "#fff",
};
const btn: React.CSSProperties = {
  padding: ".6rem 1.1rem",
  borderRadius: 10,
  border: "none",
  background: "var(--indigo)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

// ───────────────────────────── installs editor ─────────────────────────────

function InstallsEditor({ app, metric, onSaved }: { app: AppKey; metric: AppMetric; onSaved: () => void }) {
  const [installs, setInstalls] = useState(String(metric.installs ?? 0));
  const [asOf, setAsOf] = useState(metric.installs_as_of ?? new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(metric.notes ?? "");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    setInstalls(String(metric.installs ?? 0));
    setAsOf(metric.installs_as_of ?? new Date().toISOString().slice(0, 10));
    setNotes(metric.notes ?? "");
  }, [metric]);

  return (
    <div className="admin-card" style={{ padding: "1rem 1.2rem" }}>
      <div style={{ fontSize: ".82rem", color: "var(--muted-2)", marginBottom: ".6rem" }}>
        Google Play doesn&apos;t share install numbers with websites automatically. Copy them from Play Console › Statistics (or the
        Dashboard) and save here.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "140px 160px 1fr auto", gap: ".6rem", alignItems: "end" }}>
        <label style={{ fontSize: ".78rem" }}>
          Installs
          <input style={input} type="number" min={0} value={installs} onChange={(e) => setInstalls(e.target.value)} />
        </label>
        <label style={{ fontSize: ".78rem" }}>
          As of
          <input style={input} type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
        </label>
        <label style={{ fontSize: ".78rem" }}>
          Notes
          <input style={input} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. 4.9★ rating, 12 reviews" />
        </label>
        <button
          style={btn}
          onClick={async () => {
            const err = await saveAppMetric(app, Number(installs), asOf, notes);
            setMsg(err || "Saved ✓");
            if (!err) onSaved();
          }}
        >
          Save
        </button>
      </div>
      {msg && <div style={{ fontSize: ".8rem", marginTop: ".5rem", color: msg.startsWith("Saved") ? "#15803d" : "#b91c1c" }}>{msg}</div>}
      <a
        href={
          app === "calivo"
            ? "https://play.google.com/console/u/3/developers/8987920338658726445/app/4975635136525303895/statistics"
            : "https://play.google.com/console/u/3/developers/8987920338658726445/app/4973760122760051624/statistics"
        }
        target="_blank"
        rel="noreferrer"
        style={{ fontSize: ".8rem", color: "var(--indigo)", display: "inline-block", marginTop: ".5rem" }}
      >
        Open Play Console statistics ↗
      </a>
    </div>
  );
}

// ───────────────────────────── traffic report ─────────────────────────────

function TrafficReport({ app }: { app: AppKey }) {
  const [days, setDays] = useState(30);
  const [t, setT] = useState<AppTraffic | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async (d: number) => {
    setLoading(true);
    setT(await getAppTraffic(app, d));
    setLoading(false);
  }, [app]);
  useEffect(() => {
    load(days);
  }, [days, load]);

  return (
    <Section
      title={`Website traffic — aivexallp.com/${app} & ${app} blog`}
      right={
        <div style={{ display: "flex", gap: 6 }}>
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setDays(r.value)}
              style={{
                ...btn,
                padding: ".35rem .7rem",
                fontSize: ".8rem",
                background: days === r.value ? "var(--indigo)" : "#fff",
                color: days === r.value ? "#fff" : "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      }
    >
      {loading && <div className="admin-muted">Loading…</div>}
      {t?.error && <div className="form-alert err">{t.error}</div>}
      {t && !loading && (
        <>
          <div className="admin-cards">
            <Card value={num(t.views)} label="Page views" />
            <Card value={num(t.visitors)} label="Unique visitors" />
            <Card value={t.visitors ? (t.views / t.visitors).toFixed(1) : "0"} label="Pages / visitor" />
            <Card value={t.referrers[0]?.label ?? "—"} label="Top source" />
          </div>
          {t.daily.length > 1 && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: ".8rem", color: "var(--muted-2)", marginBottom: 6 }}>Daily views</div>
              <Bars data={t.daily.map((d) => ({ label: d.date.slice(5), value: d.views }))} />
            </div>
          )}
          <div style={grid2}>
            <TopTable title="Top pages" rows={t.topPages} total={t.views} />
            <TopTable title="Traffic source" rows={t.referrers} total={t.views} />
            <TopTable title="City / region" rows={t.cities} total={t.views} />
            <TopTable title="Country" rows={t.countries} total={t.views} />
            <TopTable title="Device" rows={t.devices} total={t.views} />
            <TopTable title="Operating system" rows={t.os} total={t.views} />
          </div>
        </>
      )}
    </Section>
  );
}

// ───────────────────────────── CALIVO tab ─────────────────────────────

function CalivoTab() {
  const [s, setS] = useState<CalivoStats | null>(null);
  const load = useCallback(async () => setS(await getCalivoStats()), []);
  useEffect(() => {
    load();
  }, [load]);
  if (!s) return <div className="admin-muted">Loading…</div>;

  return (
    <>
      {s.error && <div className="form-alert err">{s.error}</div>}
      <Section title="Active users (opened the app)">
        {!s.activeTracking && s.configured && (
          <div className="form-alert err">
            Active-user tracking starts once the <code>calivo_daily_active</code> table exists — run
            backend/sql_daily_active.sql in the CALIVO Supabase project.
          </div>
        )}
        <div className="admin-cards">
          <Card value={num(s.activeToday)} label="Active today" hint={`${s.activeYesterday} yesterday`} />
          <Card value={num(s.activeUsers7d)} label="Active · 7 days" />
          <Card value={num(s.active30d)} label="Active · 30 days" />
          <Card
            value={s.active30d ? `${Math.round((s.activeToday / s.active30d) * 100)}%` : "—"}
            label="Stickiness (DAU / MAU)"
          />
        </div>
        {s.dailyActive.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: ".8rem", color: "var(--muted-2)", marginBottom: 6 }}>Daily active users (30 days, IST)</div>
            <Bars data={s.dailyActive.map((d) => ({ label: d.date.slice(5), value: d.count }))} color="#16a34a" />
          </div>
        )}
      </Section>
      <Section title="App users (live from CALIVO database)">
        <div className="admin-cards">
          <Card value={num(s.metric.installs)} label="Installs (Play)" hint={s.metric.installs_as_of ? `as of ${s.metric.installs_as_of}` : "enter below"} />
          <Card value={num(s.totalUsers)} label="Total sign-ups" />
          <Card value={num(s.signups7d)} label="Sign-ups · 7 days" hint={`${s.signupsToday} today · ${s.signups30d} in 30 days`} />
          <Card value={num(s.activeUsers7d)} label="Active users · 7 days" hint="logged a meal" />
        </div>
        <div className="admin-cards">
          <Card value={num(s.premiumActive)} label="Premium (active)" hint={`${s.premiumMonthly} monthly · ${s.premiumYearly} yearly`} />
          <Card value={inr(s.estMonthlyRevenue)} label="Est. monthly revenue" hint="before Razorpay fees" />
          <Card
            value={s.metric.installs ? `${Math.round((s.totalUsers / s.metric.installs) * 100)}%` : "—"}
            label="Install → sign-up"
          />
          <Card value={s.totalUsers ? `${((s.premiumActive / s.totalUsers) * 100).toFixed(1)}%` : "—"} label="Sign-up → Premium" />
        </div>
        {s.daily.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: ".8rem", color: "var(--muted-2)", marginBottom: 6 }}>Sign-ups per day (30 days)</div>
            <Bars data={s.daily.map((d) => ({ label: d.date.slice(5), value: d.count }))} color="#e64848" />
          </div>
        )}
        {s.recent.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Latest sign-ups</th>
                <th style={{ width: 190 }}>When</th>
              </tr>
            </thead>
            <tbody>
              {s.recent.map((u) => (
                <tr key={u.email + u.created_at}>
                  <td>{u.email}</td>
                  <td>{new Date(u.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
      <Section title="Installs (from Play Console)">
        <InstallsEditor app="calivo" metric={s.metric} onSaved={load} />
      </Section>
      <TrafficReport app="calivo" />
    </>
  );
}

// ───────────────────────────── Miftah tab ─────────────────────────────

function FundEditor({ impact, onSaved }: { impact: MiftahImpact; onSaved: () => void }) {
  const [f, setF] = useState<MiftahImpact>(impact);
  const [msg, setMsg] = useState("");
  useEffect(() => setF(impact), [impact]);
  const set = (patch: Partial<MiftahImpact>) => setF((p) => ({ ...p, ...patch }));
  const pledgedAuto = Math.round((Number(f.collected) || 0) * (Number(f.share_percent) || 0) / 100);
  const donatedFromList = (f.donations || []).reduce((s, d) => s + (Number(d.amount) || 0), 0);

  return (
    <div className="admin-card" style={{ padding: "1.1rem 1.2rem" }}>
      <div style={{ fontSize: ".82rem", color: "var(--muted-2)", marginBottom: ".8rem" }}>
        Shown live in the Miftah app (Premium screen) via <code>aivexallp.com/miftah/impact.json</code> — no app update needed.
        Take &ldquo;Collected&rdquo; from Play Console › Financial reports.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: ".7rem" }}>
        <label style={{ fontSize: ".78rem" }}>
          Collected (₹)
          <input style={input} type="number" value={f.collected} onChange={(e) => set({ collected: Number(e.target.value) })} />
        </label>
        <label style={{ fontSize: ".78rem" }}>
          Share for madrasa (%)
          <input style={input} type="number" value={f.share_percent} onChange={(e) => set({ share_percent: Number(e.target.value) })} />
        </label>
        <label style={{ fontSize: ".78rem" }}>
          Madrasa share (₹)
          <div style={{ display: "flex", gap: 6 }}>
            <input style={input} type="number" value={f.pledged} onChange={(e) => set({ pledged: Number(e.target.value) })} />
            <button style={{ ...btn, padding: ".4rem .6rem", fontSize: ".75rem" }} onClick={() => set({ pledged: pledgedAuto })} title="= collected × %">
              =
            </button>
          </div>
        </label>
        <label style={{ fontSize: ".78rem" }}>
          Given so far (₹)
          <div style={{ display: "flex", gap: 6 }}>
            <input style={input} type="number" value={f.donated} onChange={(e) => set({ donated: Number(e.target.value) })} />
            <button style={{ ...btn, padding: ".4rem .6rem", fontSize: ".75rem" }} onClick={() => set({ donated: donatedFromList })} title="= sum of payments below">
              Σ
            </button>
          </div>
        </label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: ".7rem", marginTop: ".7rem" }}>
        <label style={{ fontSize: ".78rem" }}>
          Madrasa name
          <input style={input} value={f.recipient?.name ?? ""} onChange={(e) => set({ recipient: { ...f.recipient, name: e.target.value } })} />
        </label>
        <label style={{ fontSize: ".78rem" }}>
          Address
          <input style={input} value={f.recipient?.address ?? ""} onChange={(e) => set({ recipient: { ...f.recipient, address: e.target.value } })} />
        </label>
      </div>

      <div style={{ marginTop: "1rem", fontSize: ".82rem", fontWeight: 700 }}>Payments to the madrasa</div>
      <table className="admin-table" style={{ marginTop: ".4rem" }}>
        <thead>
          <tr>
            <th style={{ width: 170 }}>Date</th>
            <th>Amount (₹)</th>
            <th style={{ width: 60 }} />
          </tr>
        </thead>
        <tbody>
          {(f.donations || []).map((d, i) => (
            <tr key={i}>
              <td>
                <input
                  style={input}
                  type="date"
                  value={d.date}
                  onChange={(e) => {
                    const next = [...f.donations];
                    next[i] = { ...d, date: e.target.value };
                    set({ donations: next });
                  }}
                />
              </td>
              <td>
                <input
                  style={input}
                  type="number"
                  value={d.amount}
                  onChange={(e) => {
                    const next = [...f.donations];
                    next[i] = { ...d, amount: Number(e.target.value) };
                    set({ donations: next });
                  }}
                />
              </td>
              <td>
                <button
                  style={{ ...btn, background: "#fee2e2", color: "#b91c1c", padding: ".35rem .6rem" }}
                  onClick={() => set({ donations: f.donations.filter((_, j) => j !== i) })}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          style={{ ...btn, background: "#fff", color: "var(--indigo)", border: "1px solid var(--border)" }}
          onClick={() => set({ donations: [...(f.donations || []), { date: new Date().toISOString().slice(0, 10), amount: 0 }] })}
        >
          + Add payment
        </button>
        <button
          style={btn}
          onClick={async () => {
            const err = await saveMiftahImpact(f);
            setMsg(err || "Saved ✓ — the app shows it within a few minutes.");
            if (!err) onSaved();
          }}
        >
          Save & publish to app
        </button>
      </div>
      {msg && <div style={{ fontSize: ".8rem", marginTop: ".5rem", color: msg.startsWith("Saved") ? "#15803d" : "#b91c1c" }}>{msg}</div>}
    </div>
  );
}

function MiftahTab() {
  const [s, setS] = useState<MiftahStats | null>(null);
  const load = useCallback(async () => setS(await getMiftahStats()), []);
  useEffect(() => {
    load();
  }, [load]);
  if (!s) return <div className="admin-muted">Loading…</div>;
  const i = s.impact;

  return (
    <>
      {s.error && <div className="form-alert err">{s.error}</div>}
      <Section title="App">
        <div className="admin-cards">
          <Card value={num(s.metric.installs)} label="Installs (Play)" hint={s.metric.installs_as_of ? `as of ${s.metric.installs_as_of}` : "enter below"} />
          <Card value={i ? inr(i.collected) : "—"} label="Premium collected" />
          <Card value={i ? inr(i.pledged) : "—"} label={`Madrasa share (${i?.share_percent ?? 20}%)`} />
          <Card value={i ? inr(i.donated) : "—"} label="Given to madrasa" hint={i ? `${inr(Math.max(0, i.pledged - i.donated))} still to give` : ""} />
        </div>
        <div className="admin-muted">
          Miftah has no accounts and no tracking (privacy-first), so sign-ups and active users can&apos;t be counted from
          the app. Google Play counts them for us — see <b>Daily active users</b> and <b>Monthly active users</b> in Play
          Console › Statistics.{" "}
          <a
            href="https://play.google.com/console/u/3/developers/8987920338658726445/app/4973760122760051624/statistics"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--indigo)" }}
          >
            Open Miftah statistics ↗
          </a>
        </div>
      </Section>
      <Section title="Installs (from Play Console)">
        <InstallsEditor app="miftah" metric={s.metric} onSaved={load} />
      </Section>
      {i && (
        <Section title="Qur'an education fund (shown in the app)">
          <FundEditor impact={i} onSaved={load} />
        </Section>
      )}
      <TrafficReport app="miftah" />
    </>
  );
}

// ───────────────────────────── page ─────────────────────────────

export default function AppAnalyticsPage() {
  const [tab, setTab] = useState<AppKey>("calivo");
  return (
    <>
      <h1 className="admin-title">App Analytics</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.4rem", borderBottom: "1px solid var(--border)" }}>
        {(
          [
            ["calivo", "CALIVO AI"],
            ["miftah", "Miftah"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: ".7rem 1.2rem",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: ".95rem",
              color: tab === key ? "var(--indigo)" : "var(--muted)",
              borderBottom: tab === key ? "3px solid var(--indigo)" : "3px solid transparent",
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "calivo" ? <CalivoTab /> : <MiftahTab />}
    </>
  );
}
