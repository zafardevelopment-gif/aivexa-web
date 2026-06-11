"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const links = [
  { href: "/#products", label: "Products" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#why-us", label: "Why AIVEXA" },
  { href: "/#testimonials", label: "Customers" },
];

export default function Nav({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">
            <Sparkles size={20} strokeWidth={2} />
          </span>
          <span className="logo-word">
            AIVE<span className="accent">XA</span>
          </span>
        </Link>
        <div className={`nav-links${open ? " open" : ""}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="/#contact" className="nav-cta" onClick={() => setOpen(false)}>
            Book a Demo
          </a>
        </div>
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
