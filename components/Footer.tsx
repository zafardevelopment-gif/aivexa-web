import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Settings } from "@/lib/types";

export default function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="nav-logo">
            <span className="logo-mark">
              <Sparkles size={20} strokeWidth={2} />
            </span>
            <span className="logo-word">
              AIVE<span className="accent">XA</span>
            </span>
          </Link>
          <p>{settings.footer_about}</p>
        </div>
        <div>
          <h5>Products</h5>
          <div className="footer-links">
            <Link href="/products/ai-munim">AI Munim</Link>
            <Link href="/products/clinic-voice">Clinic Voice</Link>
            <Link href="/products/ai-hospital">AI Hospital</Link>
            <Link href="/products/ai-camp">AI Camp</Link>
          </div>
        </div>
        <div>
          <h5>Company</h5>
          <div className="footer-links">
            <a href="/#about">About Us</a>
            <a href="/#how-it-works">How It Works</a>
            <a href="/#testimonials">Customers</a>
            <a href="/#contact">Contact</a>
          </div>
        </div>
        <div>
          <h5>Resources</h5>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/data-deletion">Data Deletion</Link>
          </div>
        </div>
        <div>
          <h5>Contact</h5>
          <div className="footer-links">
            <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
            <a href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>
            <span>{settings.city}, {settings.country}</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright &copy; {new Date().getFullYear()} {settings.site_name}. All Rights Reserved.</p>
        <p>
          Legal Name: {settings.legal_name} | GST: {settings.gst_number}
        </p>
      </div>
    </footer>
  );
}
