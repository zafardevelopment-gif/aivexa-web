"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { href: "/#products", label: "Products" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#why-us", label: "Why AIVEXA" },
  { href: "/#testimonials", label: "Customers" },
  { href: "/tools", label: "Free Tools" },
  { href: "/blog", label: "Blog" },
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
          <span className="brand-tagline">
            AI. VISION. AUTOMATION. EXCELLENCE.
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
