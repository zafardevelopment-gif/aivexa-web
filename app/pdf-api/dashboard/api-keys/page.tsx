"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Eye, EyeOff, Copy, Trash2, RefreshCw, Check } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

type ApiKey = {
  id: number;
  name: string;
  key_prefix: string;
  key_hint: string;
  is_test: boolean;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  full_key?: string; // only on create
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [isTest, setIsTest] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [justCreated, setJustCreated] = useState<ApiKey | null>(null);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | "new" | null>(null);
  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const getAuthHeader = async () => {
    const { data: { session } } = await supabase.auth.getSession();
return { Authorization: session ? `Bearer ${session.access_token}` : "" } as Record<string, string>;  };

  const fetchKeys = async () => {
    setLoading(true);
    const headers = await getAuthHeader();
    const res = await fetch("/api/v1/keys", { headers });
    const data = await res.json();
    setKeys(data.keys ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  const createKey = async () => {
    setCreating(true);
    const headers = await getAuthHeader();
    const res = await fetch("/api/v1/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ name: newKeyName || undefined, isTest }),
    });
    const data = await res.json();
    if (data.key) {
      setJustCreated(data.key);
      setShowForm(false);
      setNewKeyName("");
      await fetchKeys();
    }
    setCreating(false);
  };

  const revokeKey = async (id: number) => {
    if (!confirm("Revoke this API key? It will stop working immediately.")) return;
    const headers = await getAuthHeader();
    await fetch(`/api/v1/keys?id=${id}`, { method: "DELETE", headers });
    await fetchKeys();
  };

  const copy = (text: string, id: number | "new") => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>API Keys</h1>
          <p style={{ fontSize: 14, color: "var(--pdf-muted)", marginTop: 6 }}>
            Manage your production and test API keys. Max 5 active keys.
          </p>
        </div>
        <button className="pdfapi-btn pdfapi-btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={14} /> New Key
        </button>
      </div>

      {/* New key form */}
      {showForm && (
        <div className="pdfapi-card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 16 }}>Create New API Key</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "end" }}>
            <div>
              <label className="pdfapi-label">Key Name</label>
              <input
                className="pdfapi-input"
                placeholder="e.g. Production, My App"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div>
              <label className="pdfapi-label">Type</label>
              <select
                className="pdfapi-select"
                value={isTest ? "test" : "live"}
                onChange={(e) => setIsTest(e.target.value === "test")}
              >
                <option value="live">Live (avx_pdf_live_...)</option>
                <option value="test">Test (avx_pdf_test_...)</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="pdfapi-btn pdfapi-btn-primary" onClick={createKey} disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </button>
              <button className="pdfapi-btn pdfapi-btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Just-created key — show full key ONCE */}
      {justCreated && (
        <div className="pdfapi-card" style={{
          marginBottom: 20,
          borderColor: "var(--pdf-success)",
          background: "rgba(34,197,94,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Check size={16} color="var(--pdf-success)" />
            <span style={{ fontWeight: 600, color: "var(--pdf-success)" }}>API Key Created!</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--pdf-muted)", marginTop: 0, marginBottom: 12 }}>
            ⚠️ Copy this key now. It will <strong>never be shown again</strong>.
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(0,0,0,0.3)", border: "1px solid var(--pdf-border)",
            borderRadius: 8, padding: "10px 14px",
          }}>
            <code style={{ flex: 1, fontFamily: "monospace", fontSize: 13, wordBreak: "break-all" }}>
              {justCreated.full_key}
            </code>
            <button
              className="pdfapi-btn pdfapi-btn-ghost"
              style={{ padding: "4px 10px" }}
              onClick={() => copy(justCreated.full_key!, "new")}
            >
              {copied === "new" ? <Check size={14} color="var(--pdf-success)" /> : <Copy size={14} />}
            </button>
          </div>
          <button
            className="pdfapi-btn pdfapi-btn-ghost"
            style={{ marginTop: 12, fontSize: 12 }}
            onClick={() => setJustCreated(null)}
          >
            I&apos;ve saved the key, dismiss
          </button>
        </div>
      )}

      {/* Keys list */}
      <div className="pdfapi-card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--pdf-muted)" }}>Loading…</div>
        ) : keys.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--pdf-muted)" }}>
            No API keys yet.{" "}
            <button className="pdfapi-btn pdfapi-btn-ghost" style={{ padding: 0 }} onClick={() => setShowForm(true)}>
              Create one →
            </button>
          </div>
        ) : (
          <table className="pdfapi-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key</th>
                <th>Type</th>
                <th>Last Used</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 500 }}>{k.name}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <code style={{ fontFamily: "monospace", fontSize: 12 }}>
                        {k.key_prefix}
                        {revealed[k.id] ? "••••" : "•".repeat(16)}
                        {k.key_hint}
                      </code>
                      <button
                        className="pdfapi-btn pdfapi-btn-ghost"
                        style={{ padding: "2px 6px" }}
                        onClick={() => setRevealed((p) => ({ ...p, [k.id]: !p[k.id] }))}
                        title={revealed[k.id] ? "Hide" : "Show key hint"}
                      >
                        {revealed[k.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`pdfapi-badge ${k.is_test ? "pdfapi-badge-warning" : "pdfapi-badge-success"}`}>
                      {k.is_test ? "Test" : "Live"}
                    </span>
                  </td>
                  <td style={{ color: "var(--pdf-muted)", fontSize: 12 }}>
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "Never"}
                  </td>
                  <td style={{ color: "var(--pdf-muted)", fontSize: 12 }}>
                    {new Date(k.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="pdfapi-btn pdfapi-btn-danger"
                      style={{ padding: "4px 10px", fontSize: 12 }}
                      onClick={() => revokeKey(k.id)}
                      title="Revoke key"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Security notice */}
      <div style={{
        marginTop: 20, padding: "14px 18px",
        background: "rgba(99,102,241,0.08)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 10, fontSize: 13, color: "var(--pdf-muted)", lineHeight: 1.6,
      }}>
        🔒 <strong style={{ color: "var(--pdf-text)" }}>Security:</strong> Never expose API keys in browser JavaScript, public repos, or client-side code.
        Use test keys (<code style={{ fontFamily: "monospace", fontSize: 12 }}>avx_pdf_test_...</code>) for development —
        they don&apos;t consume credits.
      </div>
    </div>
  );
}
