"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { toolCategories } from "@/lib/tools-registry";

// Category accent colors
const CAT_COLORS: Record<string, string> = {
  pdf:        "#ef4444",
  image:      "#8b5cf6",
  daily:      "#3b82f6",
  islamic:    "#10b981",
  generators: "#f59e0b",
  misc:       "#ec4899",
  markdown:   "#6366f1",
  json:       "#14b8a6",
};

type FlatTool = {
  slug: string;
  name: string;
  description: string;
  status: "live" | "soon";
  categorySlug: string;
  categoryName: string;
  color: string;
};

const allTools: FlatTool[] = toolCategories.flatMap((cat) =>
  cat.tools.map((t) => ({
    ...t,
    categorySlug: cat.slug,
    categoryName: cat.name,
    color: CAT_COLORS[cat.slug] ?? "#6366f1",
  }))
);

export default function ToolsGrid({ searchQuery = "" }: { searchQuery?: string }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allTools.filter((t) => {
      if (activeCategory !== "all" && t.categorySlug !== activeCategory) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  const totalLive = filtered.filter((t) => t.status === "live").length;

  return (
    <div>
      {/* Category filter pills */}
      <div
        style={{
          display: "flex",
          gap: ".5rem",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "2rem 0 2.5rem",
          padding: "0 1rem",
        }}
      >
        <button
          onClick={() => setActiveCategory("all")}
          style={{
            padding: ".45rem 1.1rem",
            borderRadius: 999,
            border: "1.5px solid",
            borderColor: activeCategory === "all" ? "var(--indigo)" : "var(--border-2)",
            background: activeCategory === "all" ? "var(--indigo)" : "transparent",
            color: activeCategory === "all" ? "#fff" : "var(--text)",
            fontWeight: 600,
            fontSize: ".85rem",
            cursor: "pointer",
            transition: "all .15s",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          All Tools
        </button>
        {toolCategories.map((cat) => {
          const active = activeCategory === cat.slug;
          const color = CAT_COLORS[cat.slug] ?? "#6366f1";
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              style={{
                padding: ".45rem 1.1rem",
                borderRadius: 999,
                border: `1.5px solid ${color}`,
                background: active ? color : color + "12",
                color: active ? "#fff" : color,
                fontWeight: 600,
                fontSize: ".85rem",
                cursor: "pointer",
                transition: "all .15s",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              {cat.name.replace(" Tools", "").replace(" Converter", "").replace(" & Documents", "").replace(" & Educational", "")}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.8rem" }}>
        {totalLive} live tool{totalLive !== 1 ? "s" : ""}
        {activeCategory !== "all" ? ` in ${toolCategories.find(c => c.slug === activeCategory)?.name}` : " across all categories"}
      </p>

      {/* Tools grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {filtered.map((tool) =>
          tool.status === "live" ? (
            <Link
              key={`${tool.categorySlug}-${tool.slug}`}
              href={`/tools/${tool.categorySlug}/${tool.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".5rem",
                padding: "1.2rem 1.3rem",
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "#fff",
                textDecoration: "none",
                color: "inherit",
                transition: "box-shadow .15s, border-color .15s, transform .15s",
                position: "relative",
                overflow: "hidden",
              }}
              className="tool-grid-card"
            >
              {/* colored top stripe */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 3,
                background: tool.color,
                borderRadius: "14px 14px 0 0",
              }} />
              {/* category badge */}
              <span style={{
                display: "inline-block",
                padding: ".18rem .65rem",
                borderRadius: 999,
                fontSize: ".72rem",
                fontWeight: 700,
                letterSpacing: ".03em",
                background: tool.color + "18",
                color: tool.color,
                alignSelf: "flex-start",
                marginTop: ".2rem",
              }}>
                {tool.categoryName.replace(" Tools", "").replace(" Converter", "").replace(" & Documents", "").replace(" & Educational", "")}
              </span>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                {tool.name}
              </h3>
              <p style={{ fontSize: ".85rem", color: "var(--muted)", margin: 0, lineHeight: 1.5, flex: 1 }}>
                {tool.description}
              </p>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: ".82rem",
                fontWeight: 600,
                color: tool.color,
                marginTop: ".3rem",
              }}>
                Try free <ArrowRight size={14} />
              </span>
            </Link>
          ) : (
            <div
              key={`${tool.categorySlug}-${tool.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".5rem",
                padding: "1.2rem 1.3rem",
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "#fafafa",
                opacity: 0.7,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 3,
                background: tool.color + "60",
                borderRadius: "14px 14px 0 0",
              }} />
              <span style={{
                display: "inline-block",
                padding: ".18rem .65rem",
                borderRadius: 999,
                fontSize: ".72rem",
                fontWeight: 700,
                background: "#f1f5f9",
                color: "var(--muted)",
                alignSelf: "flex-start",
                marginTop: ".2rem",
              }}>
                {tool.categoryName.replace(" Tools", "").replace(" Converter", "").replace(" & Documents", "").replace(" & Educational", "")}
              </span>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                {tool.name}
              </h3>
              <p style={{ fontSize: ".85rem", color: "var(--muted)", margin: 0, lineHeight: 1.5, flex: 1 }}>
                {tool.description}
              </p>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: ".8rem",
                color: "var(--muted-2)",
                marginTop: ".3rem",
              }}>
                <Clock size={13} /> Coming soon
              </span>
            </div>
          )
        )}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>
          No tools found. Try a different search or category.
        </p>
      )}

      <style>{`
        .tool-grid-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,.09);
          border-color: var(--border-2);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
