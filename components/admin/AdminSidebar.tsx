"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Package,
  Settings,
  Sparkles,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/homepage", label: "Homepage", icon: MessageSquareQuote },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-side">
      <Link href="/" className="nav-logo" style={{ marginBottom: "1.6rem" }}>
        <span className="logo-mark">
          <Sparkles size={18} strokeWidth={2} />
        </span>
        <span className="logo-word" style={{ fontSize: "1.05rem" }}>
          AIVE<span className="accent">XA</span>
        </span>
      </Link>
      <nav className="admin-nav">
        {navItems.map(({ href, label, icon: ItemIcon }) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}>
            <ItemIcon size={17} strokeWidth={2} /> {label}
          </Link>
        ))}
      </nav>
      <button className="admin-logout" onClick={() => logout()}>
        <LogOut size={16} strokeWidth={2} /> Sign Out
      </button>
    </aside>
  );
}
