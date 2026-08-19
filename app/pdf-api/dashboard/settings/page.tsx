"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  email: string;
  plan_id: string;
  created_at: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Fetch basic profile via usage endpoint (has plan info)
    fetch("/api/v1/usage?days=1")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setProfile({ email: "", plan_id: d.plan_name, created_at: "" });
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveWebhook(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Placeholder — webhook save would call /api/v1/webhooks
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--pdf-text)" }}>Account Settings</h1>
        <p style={{ margin: "4px 0 0", color: "var(--pdf-muted)", fontSize: 14 }}>Manage your account preferences</p>
      </div>

      {/* Plan info */}
      <div className="pdfapi-card" style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "var(--pdf-text)" }}>Current Plan</h3>
        {loading ? (
          <p style={{ color: "var(--pdf-muted)", margin: 0 }}>Loading…</p>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span className="pdfapi-badge pdfapi-badge-info" style={{ fontSize: 14, padding: "4px 12px" }}>
              {profile?.plan_id ?? "—"}
            </span>
            <a
              href="/pdf-api/dashboard/billing"
              className="pdfapi-btn pdfapi-btn-secondary"
              style={{ padding: "6px 16px", fontSize: 13 }}
            >
              Upgrade Plan
            </a>
          </div>
        )}
      </div>

      {/* Webhook config */}
      <div className="pdfapi-card" style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--pdf-text)" }}>Webhook Endpoint</h3>
        <p style={{ margin: "0 0 16px", color: "var(--pdf-muted)", fontSize: 13 }}>
          Receive a POST request when an async job completes. Leave blank to disable.
        </p>
        <form onSubmit={saveWebhook} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            className="pdfapi-input"
            type="url"
            placeholder="https://your-app.com/webhook/pdf"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            style={{ flex: 1, minWidth: 260 }}
          />
          <button type="submit" className="pdfapi-btn pdfapi-btn-primary" disabled={saving} style={{ padding: "10px 20px" }}>
            {saving ? "Saving…" : saved ? "✓ Saved" : "Save Webhook"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="pdfapi-card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--pdf-error)" }}>Danger Zone</h3>
        <p style={{ margin: "0 0 16px", color: "var(--pdf-muted)", fontSize: 13 }}>
          These actions are irreversible. Proceed with caution.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            className="pdfapi-btn pdfapi-btn-danger"
            style={{ padding: "8px 16px", fontSize: 13 }}
            onClick={() => {
              if (confirm("Delete all API keys? This cannot be undone.")) {
                alert("Please revoke each key individually from the API Keys page.");
              }
            }}
          >
            Revoke All Keys
          </button>
          <button
            className="pdfapi-btn pdfapi-btn-danger"
            style={{ padding: "8px 16px", fontSize: 13, opacity: 0.7 }}
            onClick={() => alert("To delete your account, please email support@aivexa.com")}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Support */}
      <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(99,102,241,0.06)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)" }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--pdf-muted)" }}>
          Need help? Contact us at{" "}
          <a href="mailto:support@aivexa.com" style={{ color: "var(--pdf-accent)" }}>support@aivexa.com</a>
          {" "}or check the{" "}
          <a href="/pdf-api/docs" style={{ color: "var(--pdf-accent)" }}>documentation</a>.
        </p>
      </div>
    </div>
  );
}
