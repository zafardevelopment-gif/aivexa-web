"use client";

import { useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

export default function PdfApiLoginPage() {
  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<"signup" | null>(null);

  function friendlyError(msg: string): string {
    if (msg.includes("Invalid login credentials")) return "Incorrect email or password.";
    if (msg.includes("Email not confirmed")) return "Please confirm your email first, then sign in.";
    if (msg.includes("User already registered")) return "Account exists — please sign in instead.";
    if (msg.includes("rate limit")) return "Too many attempts. Please wait a few minutes.";
    return msg;
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/pdf-api/dashboard`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
    // On success browser redirects — no need to setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/pdf-api/dashboard` }
        });
        if (error) throw error;
        setDone("signup");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) window.location.href = "/pdf-api/dashboard";
      }
    } catch (err: unknown) {
      setError(friendlyError(err instanceof Error ? err.message : "Authentication failed"));
    } finally {
      setLoading(false);
    }
  }

  if (done === "signup") {
    return (
      <div className="pdfapi-root" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className="pdfapi-card" style={{ maxWidth: 420, width: "100%", textAlign: "center", padding: "40px 32px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h2 style={{ margin: "0 0 10px", color: "var(--pdf-text)", fontSize: 20 }}>Confirm your email</h2>
          <p style={{ color: "var(--pdf-muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            We sent a link to <strong style={{ color: "var(--pdf-text)" }}>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <button className="pdfapi-btn pdfapi-btn-secondary" style={{ width: "100%", padding: "11px 0" }}
            onClick={() => { setDone(null); setMode("login"); }}>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdfapi-root" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <a href="/pdf-api" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 22, color: "var(--pdf-accent)" }}>⬡</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: "var(--pdf-text)", letterSpacing: "-0.01em" }}>
              AIVEXA <strong style={{ color: "var(--pdf-accent-light)" }}>PDF API</strong>
            </span>
          </a>
          <p style={{ color: "var(--pdf-muted)", fontSize: 14, margin: 0 }}>
            {mode === "login" ? "Welcome back" : "Create your free account"}
          </p>
        </div>

        <div className="pdfapi-card" style={{ padding: "28px 28px" }}>

          {/* Google Login — PRIMARY */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            style={{
              width: "100%", padding: "12px 16px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              background: "#fff", color: "#3c4043",
              border: "1px solid #dadce0", borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              transition: "box-shadow 0.15s, background 0.15s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              marginBottom: 20,
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)")}
          >
            {/* Google G logo SVG */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            {googleLoading ? "Redirecting…" : `${mode === "login" ? "Sign in" : "Sign up"} with Google`}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "var(--pdf-border)" }} />
            <span style={{ fontSize: 12, color: "var(--pdf-muted)" }}>or use email & password</span>
            <div style={{ flex: 1, height: 1, background: "var(--pdf-border)" }} />
          </div>

          {/* Email + Password form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="pdfapi-label">Email address</label>
              <input
                className="pdfapi-input"
                type="email" required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="pdfapi-label">Password</label>
              <input
                className="pdfapi-input"
                type="password" required minLength={6}
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            {error && (
              <div style={{
                color: "var(--pdf-error)", fontSize: 13,
                background: "rgba(239,68,68,0.08)", padding: "10px 14px",
                borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", lineHeight: 1.5
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="pdfapi-btn pdfapi-btn-primary"
              disabled={loading || googleLoading}
              style={{ padding: "12px 0", width: "100%", fontSize: 15 }}
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>

            <p style={{ textAlign: "center", margin: 0, fontSize: 13, color: "var(--pdf-muted)" }}>
              {mode === "login" ? (
                <>No account?{" "}
                  <button type="button" onClick={() => { setMode("signup"); setError(""); }}
                    style={{ background: "none", border: "none", color: "var(--pdf-accent)", cursor: "pointer", fontSize: 13, padding: 0, fontWeight: 600 }}>
                    Sign up free
                  </button>
                </>
              ) : (
                <>Have an account?{" "}
                  <button type="button" onClick={() => { setMode("login"); setError(""); }}
                    style={{ background: "none", border: "none", color: "var(--pdf-accent)", cursor: "pointer", fontSize: 13, padding: 0, fontWeight: 600 }}>
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--pdf-muted)" }}>
          By continuing you agree to our{" "}
          <a href="/pdf-api/terms" style={{ color: "var(--pdf-accent)" }}>Terms</a> and{" "}
          <a href="/privacy-policy" style={{ color: "var(--pdf-accent)" }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
