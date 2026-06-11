"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { ok: false, error: "" };

export default function AdminLogin() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(login, initialState);

  useEffect(() => {
    if (state.ok) router.replace("/admin");
  }, [state.ok, router]);

  return (
    <main className="login-wrap">
      <form action={formAction} className="login-card contact-form">
        <div className="login-head">
          <span className="logo-mark">
            <Sparkles size={20} strokeWidth={2} />
          </span>
          <h1>
            AIVE<span style={{ color: "var(--indigo)" }}>XA</span> Admin
          </h1>
          <p>Sign in to manage your website content</p>
        </div>
        {state.error && <div className="form-alert err">{state.error}</div>}
        <div className="field">
          <label htmlFor="adm-user">User ID</label>
          <input
            id="adm-user"
            name="user_id"
            type="text"
            placeholder="admin"
            autoComplete="username"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="adm-pass">Password</label>
          <input
            id="adm-pass"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={pending}
          style={{ width: "100%", justifyContent: "center" }}
        >
          <Lock size={16} strokeWidth={2.2} /> {pending ? "Signing in…" : "Sign In"}
        </button>
        <p className="login-note">
          Login details aivexa_users table mein hain (default: admin / aivexa123 — pehli login ke baad badal dein).
        </p>
      </form>
    </main>
  );
}
