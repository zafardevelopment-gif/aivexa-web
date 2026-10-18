"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Profile = { email: string; planName: string; expiresAt: string | null; resetAt: string | null };

const SUPPORT_EMAIL = "aivexallp@gmail.com";
const SUPPORT_WHATSAPP = "https://wa.me/919204298771";

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const res = await fetch("/api/v1/usage?days=1", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const d = res.ok ? await res.json() : null;
      setProfile({
        email: session.user.email ?? "",
        planName: d?.plan?.name ?? "Free",
        expiresAt: d?.plan?.expires_at ?? null,
        resetAt: d?.plan?.credits_reset_at ?? null,
      });
      setLoading(false);
    })();
  }, [supabase]);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pw.length < 6) { setPwMsg({ ok: false, text: "Password must be at least 6 characters." }); return; }
    if (pw !== pw2) { setPwMsg({ ok: false, text: "The two passwords do not match." }); return; }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSavingPw(false);
    if (error) setPwMsg({ ok: false, text: error.message });
    else { setPwMsg({ ok: true, text: "Password changed." }); setPw(""); setPw2(""); }
  }

  const row = { display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--pdf-border)", fontSize: 14 } as const;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--pdf-text)" }}>Account Settings</h1>
        <p style={{ margin: "4px 0 0", color: "var(--pdf-muted)", fontSize: 14 }}>Your account, plan and password</p>
      </div>

      <div className="pdfapi-card" style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "var(--pdf-text)" }}>Account</h3>
        {loading ? <p style={{ color: "var(--pdf-muted)", margin: 0 }}>Loading…</p> : (
          <div>
            <div style={row}><span style={{ color: "var(--pdf-muted)" }}>Email</span><span>{profile?.email || "—"}</span></div>
            <div style={row}><span style={{ color: "var(--pdf-muted)" }}>Plan</span><span>{profile?.planName}</span></div>
            {profile?.expiresAt && <div style={row}><span style={{ color: "var(--pdf-muted)" }}>Plan valid until</span><span>{fmt(profile.expiresAt)}</span></div>}
            <div style={{ ...row, borderBottom: 0 }}><span style={{ color: "var(--pdf-muted)" }}>Monthly credits reset on</span><span>{fmt(profile?.resetAt ?? null)}</span></div>
            <a href="/pdf-api/dashboard/billing" className="pdfapi-btn pdfapi-btn-secondary" style={{ marginTop: 12, padding: "6px 16px", fontSize: 13, display: "inline-block" }}>
              Change plan
            </a>
          </div>
        )}
      </div>

      <div className="pdfapi-card" style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "var(--pdf-text)" }}>Change password</h3>
        <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360 }}>
          <input className="pdfapi-input" type="password" placeholder="New password (min. 6 characters)" autoComplete="new-password"
            value={pw} onChange={(e) => setPw(e.target.value)} />
          <input className="pdfapi-input" type="password" placeholder="Confirm new password" autoComplete="new-password"
            value={pw2} onChange={(e) => setPw2(e.target.value)} />
          {pwMsg && <div style={{ fontSize: 13, color: pwMsg.ok ? "var(--pdf-success)" : "var(--pdf-error)" }}>{pwMsg.text}</div>}
          <button type="submit" className="pdfapi-btn pdfapi-btn-primary" disabled={savingPw} style={{ padding: "10px 0" }}>
            {savingPw ? "Saving…" : "Update password"}
          </button>
        </form>
      </div>

      <div className="pdfapi-card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--pdf-error)" }}>Delete account</h3>
        <p style={{ margin: "0 0 12px", color: "var(--pdf-muted)", fontSize: 13, lineHeight: 1.6 }}>
          To delete your account and all its data, email us from your registered address at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Delete%20my%20PDF%20API%20account`} style={{ color: "var(--pdf-accent)" }}>{SUPPORT_EMAIL}</a>.
          To stop API access right away, revoke your keys on the <a href="/pdf-api/dashboard/api-keys" style={{ color: "var(--pdf-accent)" }}>API Keys</a> page.
        </p>
      </div>

      <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(99,102,241,0.06)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)" }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--pdf-muted)", lineHeight: 1.6 }}>
          Need help? Email <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--pdf-accent)" }}>{SUPPORT_EMAIL}</a>,
          message us on <a href={SUPPORT_WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: "var(--pdf-accent)" }}>WhatsApp</a>,
          or read the <a href="/pdf-api/docs" style={{ color: "var(--pdf-accent)" }}>documentation</a>.
        </p>
      </div>
    </div>
  );
}
