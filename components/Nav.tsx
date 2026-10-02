"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

// Primary navigation — kept short so it fits on one line and reads professionally.
// Home-page anchors (How it works, Why AIVEXA, Customers) live in the footer.
const links: { href: string; label: string; newTab?: boolean; badge?: string }[] = [
  { href: "/store", label: "Digital Products" },
  { href: "/tools", label: "Free Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/pdf-api", label: "PDF API", newTab: true },
];

// "My Mobile Apps" dropdown — AIVEXA's own Android apps.
const mobileApps: { href: string; label: string; sub: string; badge?: string }[] = [
  { href: "/calivo-ai", label: "CALIVO AI", sub: "AI calorie counter & diet coach", badge: "New" },
  { href: "/miftah", label: "Miftah", sub: "Prayer times, Azan, Qibla & Quran" },
];

export default function Nav({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link
          href="/"
          className="nav-logo brand-lockup"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/aivexa-logo-mark.svg"
            alt="AIVEXA"
            width={145}
            height={58}
            priority
            className="brand-logo"
          />
        </Link>
        <div className={`nav-links${open ? " open" : ""}`}>
          <a href="/#products" onClick={() => setOpen(false)}>Products</a>
          <div
            className={`nav-dd${appsOpen ? " open" : ""}`}
            onMouseEnter={() => setAppsOpen(true)}
            onMouseLeave={() => setAppsOpen(false)}
          >
            <button
              type="button"
              className="nav-dd-btn"
              aria-haspopup="true"
              aria-expanded={appsOpen}
              onClick={() => setAppsOpen((v) => !v)}
            >
              My Mobile Apps <ChevronDown size={15} strokeWidth={2.2} />
            </button>
            <div className="nav-dd-menu" role="menu">
              {mobileApps.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    setAppsOpen(false);
                  }}
                >
                  <strong>
                    {a.label}
                    {a.badge && <span className="nav-new">{a.badge}</span>}
                  </strong>
                  <span>{a.sub}</span>
                </a>
              ))}
            </div>
          </div>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              {...(l.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
              {l.badge && <span className="nav-new">{l.badge}</span>}
            </a>
          ))}
          <a href="/#contact" className="nav-cta" onClick={() => setOpen(false)}>
            Book a Demo
          </a>
        </div>

        {/* Cart icon */}
        <button className="nav-cart-btn" onClick={openCart} aria-label="Open cart">
          <ShoppingCart size={20} strokeWidth={2} />
          {count > 0 && <span className="nav-cart-badge">{count}</span>}
        </button>

        <button
          className={`hamburger${open ? " active" : ""}`}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
