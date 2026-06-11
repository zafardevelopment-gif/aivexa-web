"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard } from "@/app/admin/actions";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

const cards = [
  { table: "aivexa_messages", label: "Messages", href: "/admin/messages" },
  { table: "aivexa_products", label: "Products", href: "/admin/products" },
  { table: "aivexa_testimonials", label: "Testimonials", href: "/admin/homepage" },
  { table: "aivexa_pages", label: "Pages", href: "/admin/pages" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<Message[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard().then(({ counts, recent, error }) => {
      setCounts(counts);
      setRecent(recent as unknown as Message[]);
      setError(error);
    });
  }, []);

  return (
    <>
      <h1 className="admin-title">Dashboard</h1>
      {error && <div className="form-alert err">{error}</div>}
      <div className="admin-cards">
        {cards.map(({ table, label, href }) => (
          <Link href={href} className="admin-card" key={table}>
            <b>{counts[table] ?? "…"}</b>
            <span>{label}</span>
          </Link>
        ))}
      </div>
      <h2 className="editor-title">Recent messages</h2>
      {recent.length === 0 ? (
        <p className="admin-muted">No messages yet.</p>
      ) : (
        recent.map((m) => (
          <div className="message-card" key={m.id}>
            <div className="message-head">
              <b>{m.name}</b>
              <span>{new Date(m.created_at).toLocaleString("en-IN")}</span>
            </div>
            <div className="message-meta">
              <a href={`mailto:${m.email}`}>{m.email}</a>
              {m.phone && <span> · {m.phone}</span>}
            </div>
            <p>{m.message}</p>
          </div>
        ))
      )}
    </>
  );
}
