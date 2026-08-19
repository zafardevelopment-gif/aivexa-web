"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Key, BarChart2, ScrollText,
  FlaskConical, CreditCard, Settings, BookOpen, LogOut
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

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: "var(--pdf-surface)",
        borderRight: "1px solid var(--pdf-border)",
        display: "flex", flexDirection: "column",
        padding: "20px 0",
        position: "sticky", top: 56, height: "calc(100vh - 56px)",
        overflowY: "auto",
      }}>
        <div style={{ padding: "0 12px", flex: 1 }}>
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, marginBottom: 2,
                textDecoration: "none", fontSize: 14, fontWeight: 500,
                color: active ? "var(--pdf-text)" : "var(--pdf-muted)",
                background: active ? "rgba(99,102,241,0.12)" : "transparent",
                borderLeft: active ? "2px solid var(--pdf-accent)" : "2px solid transparent",
                transition: "all 0.15s",
              }}>
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div style={{ padding: "12px", borderTop: "1px solid var(--pdf-border)", marginTop: 12 }}>
          <Link href="/pdf-api" style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 8,
            textDecoration: "none", fontSize: 13,
            color: "var(--pdf-muted)",
          }}>
            <LogOut size={14} />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, padding: "32px 36px", maxWidth: "calc(100vw - 220px)", overflowX: "hidden" }}>
        {children}
      </div>
    </div>
  );
}
