"use client";

import { useCallback, useEffect, useState } from "react";
import { getAnalytics, type AnalyticsResult } from "@/app/admin/actions";
import { PAGE_TYPE_LABELS } from "@/lib/analytics";

const RANGE_OPTIONS = [
  { value: 0, label: "Today" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
];

function rangeLabel(days: number) {
  return days === 0 ? "today" : `${days}d`;
}

const EMPTY: AnalyticsResult = {
  error: "",
  days: 0,
  totalViews: 0,
  uniqueVisitors: 0,
  byType: [],
  topPages: [],
  byDevice: [],
  byLocation: [],
  recent: [],
};

function shortVisitor(id: string) {
  if (!id) return "—";
  return id.length > 10 ? `${id.slice(0, 8)}…` : id;
}

export default function AdminAnalytics() {
  const [days, setDays] = useState(0);
  const [data, setData] = useState<AnalyticsResult>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (range: number) => {
    setLoading(true);
    const result = await getAnalytics(range);
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1 className="admin-title" style={{ marginBottom: 0 }}>
          Analytics
        </h1>
        <div style={{ display: "flex", gap: ".5rem" }}>
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setDays(r.value)}
              className={days === r.value ? "btn-primary sm" : "btn-secondary sm"}
              style={{ padding: ".4rem .9rem", fontSize: ".8rem" }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <p className="admin-muted">
        Who&apos;s visiting which page or product, from which device and
        location — logged automatically from every page on the site (admin
        pages excluded).
      </p>

      {data.error && <div className="form-alert err">{data.error}</div>}

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <>
          <div className="admin-cards">
            <div className="admin-card">
              <b>{data.totalViews.toLocaleString("en-IN")}</b>
              <span>Total pageviews ({rangeLabel(data.days)})</span>
            </div>
            <div className="admin-card">
              <b>{data.uniqueVisitors.toLocaleString("en-IN")}</b>
              <span>Unique visitors ({rangeLabel(data.days)})</span>
            </div>
            <div className="admin-card">
              <b>{data.byType[0]?.label ?? "—"}</b>
              <span>Most-visited section</span>
            </div>
            <div className="admin-card">
              <b>{data.topPages[0]?.pageKey ?? "—"}</b>
              <span>Top single page</span>
            </div>
          </div>

          <h2 className="editor-title">Views by section</h2>
          {data.byType.length === 0 ? (
            <p className="admin-muted">
              No pageviews logged yet — this fills up once the tracker script
              is live and people start visiting the site.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {data.byType.map((t) => (
                  <tr key={t.type}>
                    <td>{t.label}</td>
                    <td>{t.count.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="editor-title">Top pages / products</h2>
          {data.topPages.length === 0 ? (
            <p className="admin-muted">Nothing to show yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Type</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.map((p) => (
                  <tr key={`${p.pageType}::${p.pageKey}`}>
                    <td>{p.pageKey}</td>
                    <td>{PAGE_TYPE_LABELS[p.pageType] ?? p.pageType}</td>
                    <td>{p.count.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="editor-title">Devices & browsers</h2>
          {data.byDevice.length === 0 ? (
            <p className="admin-muted">Nothing to show yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Device · OS · Browser</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {data.byDevice.map((d) => (
                  <tr key={d.label}>
                    <td>{d.label}</td>
                    <td>{d.count.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="editor-title">Locations</h2>
          {data.byLocation.length === 0 ? (
            <p className="admin-muted">
              Nothing to show yet — location is only detected on the live
              Vercel deployment, not on localhost.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>City / Region / Country</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {data.byLocation.map((l) => (
                  <tr key={l.label}>
                    <td>{l.label}</td>
                    <td>{l.count.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="editor-title">Recent activity</h2>
          {data.recent.length === 0 ? (
            <p className="admin-muted">No recent visits logged yet.</p>
          ) : (
            data.recent.map((r, i) => {
              const device = [r.device_type, r.os, r.browser].filter(Boolean).join(" · ");
              const location = [r.city, r.region, r.country].filter(Boolean).join(", ");
              return (
                <div className="message-card" key={i}>
                  <div className="message-head">
                    <b>{r.path}</b>
                    <span>{new Date(r.created_at).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="message-meta">
                    Visitor {shortVisitor(r.visitor_id)}
                    {device && <span> · {device}</span>}
                    {location && <span> · {location}</span>}
                    {r.referrer && <span> · from {r.referrer}</span>}
                  </div>
                </div>
              );
            })
          )}
        </>
      )}
    </>
  );
}
