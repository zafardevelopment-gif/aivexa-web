"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { RefreshCw } from "lucide-react";

type LogRow = {
  id: number;
  request_id: string;
  endpoint: string;
  status: string;
  input_type: string;
  output_size_bytes: number | null;
  response_ms: number | null;
  pdf_gen_ms: number | null;
  error_code: string | null;
  is_test: boolean;
  created_at: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const getAuthHeader = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession();
    return { Authorization: session ? `Bearer ${session.access_token}` : "" };
  };

  const fetchLogs = async () => {
    setLoading(true);
    const headers = await getAuthHeader();
    const res = await fetch("/api/v1/logs", { headers });
    const data = await res.json();
    setLogs(data.logs ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>API Logs</h1>
          <p style={{ fontSize: 14, color: "var(--pdf-muted)", marginTop: 6 }}>
            Every request made with your API keys.
          </p>
        </div>
        <button className="pdfapi-btn pdfapi-btn-secondary" onClick={fetchLogs} disabled={loading}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="pdfapi-card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--pdf-muted)" }}>Loading…</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--pdf-muted)" }}>
            No requests yet. Make your first API call to see logs here.
          </div>
        ) : (
          <table className="pdfapi-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Endpoint</th>
                <th>Type</th>
                <th>Status</th>
                <th>Size</th>
                <th>Gen Time</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <code style={{ fontFamily: "monospace", fontSize: 11, color: "var(--pdf-muted)" }}>
                      {log.request_id}
                    </code>
                    {log.is_test && (
                      <span className="pdfapi-badge pdfapi-badge-warning" style={{ marginLeft: 6, fontSize: 10 }}>test</span>
                    )}
                  </td>
                  <td>
                    <code style={{ fontFamily: "monospace", fontSize: 12 }}>{log.endpoint}</code>
                  </td>
                  <td style={{ color: "var(--pdf-muted)", fontSize: 12 }}>
                    {log.input_type ?? "—"}
                  </td>
                  <td>
                    <span className={`pdfapi-badge ${
                      log.status === "completed" ? "pdfapi-badge-success"
                      : log.status === "failed" ? "pdfapi-badge-error"
                      : "pdfapi-badge-warning"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--pdf-muted)" }}>
                    {log.output_size_bytes
                      ? `${((log.output_size_bytes) / 1024).toFixed(1)} KB`
                      : "—"}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--pdf-muted)" }}>
                    {log.pdf_gen_ms ? `${log.pdf_gen_ms}ms` : "—"}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--pdf-muted)", whiteSpace: "nowrap" }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
