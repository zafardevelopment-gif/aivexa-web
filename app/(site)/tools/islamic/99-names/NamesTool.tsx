"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { TextInput } from "@/components/tools/ToolUI";
import { asmaUlHusna } from "./names-data";

export default function NamesTool() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return asmaUlHusna;
    return asmaUlHusna.filter(
      (n) =>
        n.transliteration.toLowerCase().includes(q) || n.meaning.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <ToolPageLayout
      title="99 Names of Allah"
      description="Asma-ul-Husna — the 99 Names of Allah with Arabic script, transliteration and meaning."
      categoryHref="/tools/islamic"
      categoryName="Islamic Tools"
    >
      <div style={{ marginBottom: "1.6rem" }}>
        <TextInput
          type="text"
          placeholder="Search by transliteration or meaning (e.g. Merciful, Rahman)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <p style={{ fontSize: ".85rem", color: "var(--muted-2)", marginBottom: "1.2rem" }}>
        {filtered.length} of {asmaUlHusna.length} names
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {filtered.map((n) => (
          <div
            key={n.number}
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm, 12px)",
              padding: "1.1rem 1.2rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--indigo)" }}>
              {n.number}
            </span>
            <div
              dir="rtl"
              lang="ar"
              style={{
                fontSize: "1.8rem",
                fontWeight: 600,
                margin: ".3rem 0 .4rem",
                color: "var(--text)",
                lineHeight: 1.4,
              }}
            >
              {n.arabic}
            </div>
            <div style={{ fontWeight: 700, fontSize: ".98rem", color: "var(--text)" }}>
              {n.transliteration}
            </div>
            <div style={{ fontSize: ".85rem", color: "var(--muted)", marginTop: ".2rem" }}>
              {n.meaning}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--muted-2)", padding: "2rem 0" }}>
          No names match your search.
        </p>
      )}
    </ToolPageLayout>
  );
}
