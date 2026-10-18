"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard, Key, BarChart2, ScrollText,
  FlaskConical, CreditCard, Settings, BookOpen, LogOut, Home
} from "lucide-react";

const navItems = [
  { href: "/pdf-api/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/pdf-api/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/pdf-api/dashboard/playground", label: "Playground", icon: FlaskConical },
  { href: "/pdf-api/dashboard/logs", label: "API Logs", icon: ScrollText },
  { href: "/pdf-api/dashboard/usage", label: "Usage", icon: BarChart2 },
  { href: "/pdf-api/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/pdf-api/docs", label: "Docs", icon: BookOpen },
  { href: "/pdf-api/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  // Every dashboard page needs a signed-in user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        const next = encodeURIComponent(window.location.pathname);
        window.location.replace(`/pdf-api/login?next=${next}`);
        return;
      }
      setEmail(session.user.email ?? "");
      setChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") window.location.replace("/pdf-api/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.replace("/pdf-api/login");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  if (!checked) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pdf-muted)", fontSize: 14 }}>
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="pdfdash">
      <aside className="pdfdash-side">
        <div className="pdfdash-nav">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`pdfdash-link${active ? " is-active" : ""}`}>
                <Icon size={15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="pdfdash-foot">
          {email && <div className="pdfdash-email" title={email}>{email}</div>}
          <Link href="/pdf-api" className="pdfdash-link"><Home size={14} /><span>PDF API home</span></Link>
          <button type="button" onClick={signOut} className="pdfdash-link pdfdash-signout">
            <LogOut size={14} /><span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="pdfdash-main">{children}</div>

      <style>{`
        .pdfdash { display: flex; min-height: calc(100vh - 56px); }
        .pdfdash-side {
          width: 220px; flex-shrink: 0; background: var(--pdf-surface);
          border-right: 1px solid var(--pdf-border); display: flex; flex-direction: column;
          padding: 20px 0; position: sticky; top: 56px; height: calc(100vh - 56px); overflow-y: auto;
        }
        .pdfdash-nav { padding: 0 12px; flex: 1; }
        .pdfdash-link {
          display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
          margin-bottom: 2px; text-decoration: none; font-size: 14px; font-weight: 500;
          color: var(--pdf-muted); border-left: 2px solid transparent; transition: all 0.15s;
          background: transparent; width: 100%; font-family: inherit; cursor: pointer; border-top: 0; border-right: 0; border-bottom: 0; text-align: left;
        }
        .pdfdash-link:hover { color: var(--pdf-text); }
        .pdfdash-link.is-active { color: var(--pdf-text); background: rgba(99,102,241,0.12); border-left-color: var(--pdf-accent); }
        .pdfdash-foot { padding: 12px; border-top: 1px solid var(--pdf-border); margin-top: 12px; }
        .pdfdash-email { font-size: 12px; color: var(--pdf-muted); padding: 4px 12px 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pdfdash-signout:hover { color: var(--pdf-error); }
        .pdfdash-main { flex: 1; min-width: 0; padding: 32px 36px; overflow-x: hidden; }
        @media (max-width: 820px) {
          .pdfdash { flex-direction: column; }
          .pdfdash-side { width: 100%; height: auto; position: static; padding: 8px 0; border-right: 0; border-bottom: 1px solid var(--pdf-border); }
          .pdfdash-nav { display: flex; overflow-x: auto; gap: 4px; padding: 0 12px; }
          .pdfdash-nav .pdfdash-link { width: auto; white-space: nowrap; margin: 0; border-left: 0; border-bottom: 2px solid transparent; }
          .pdfdash-nav .pdfdash-link.is-active { border-bottom-color: var(--pdf-accent); }
          .pdfdash-foot { display: flex; align-items: center; gap: 4px; margin-top: 4px; padding: 6px 12px 0; }
          .pdfdash-foot .pdfdash-link { width: auto; white-space: nowrap; }
          .pdfdash-email { flex: 1; padding: 0 4px; }
          .pdfdash-main { padding: 20px 16px; }
        }
      `}</style>
    </div>
  );
}
