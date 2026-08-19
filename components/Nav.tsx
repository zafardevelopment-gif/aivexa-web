"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const links: { href: string; label: string; newTab?: boolean }[] = [
  { href: "/#products", label: "Products" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#why-us", label: "Why AIVEXA" },
  { href: "/#testimonials", label: "Customers" },
  { href: "/store", label: "Digital Products" },
  { href: "/tools", label: "Free Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/pdf-api", label: "PDF API", newTab: true },
];

export default function Nav({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              {...(l.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
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
