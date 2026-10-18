"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const [ready, setReady] = useState<"checking" | "ok" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The link from the email signs the user in for this one step
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) setReady("ok");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady("ok");
      else setTimeout(() => setReady((r) => (r === "checking" ? "invalid" : r)), 2500);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("The two passwords do not match."); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => { window.location.href = "/pdf-api/dashboard"; }, 1500);
  }

  return (
    <div className="pdfapi-root" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="pdfapi-card" style={{ maxWidth: 420, width: "100%", padding: "32px 28px" }}>
        <h1 style={{ margin: "0 0 6px", fontSize: 20, color: "var(--pdf-text)" }}>Set a new password</h1>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--pdf-muted)" }}>AIVEXA PDF API account</p>

        {ready === "checking" && <p style={{ color: "var(--pdf-muted)", fontSize: 14 }}>Checking your reset link…</p>}

        {ready === "invalid" && (
          <div>
            <p style={{ color: "var(--pdf-error)", fontSize: 14, lineHeight: 1.6 }}>
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <a href="/pdf-api/login" className="pdfapi-btn pdfapi-btn-secondary" style={{ display: "block", textAlign: "center", padding: "11px 0" }}>
              Back to sign in
            </a>
          </div>
        )}

        {ready === "ok" && !done && (
          <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="pdfapi-label">New password</label>
              <input className="pdfapi-input" type="password" required minLength={6} autoComplete="new-password"
                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" />
            </div>
            <div>
              <label className="pdfapi-label">Confirm new password</label>
              <input className="pdfapi-input" type="password" required minLength={6} autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            {error && <div style={{ color: "var(--pdf-error)", fontSize: 13 }}>{error}</div>}
            <button type="submit" className="pdfapi-btn pdfapi-btn-primary" disabled={saving} style={{ padding: "12px 0" }}>
              {saving ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}

        {done && <p style={{ color: "var(--pdf-success)", fontSize: 14 }}>Password updated. Opening your dashboard…</p>}
      </div>
    </div>
  );
}
