"use client";

import Link from "next/link";
import { useMemo, useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { toolCategories } from "@/lib/tools-registry";

type FlatTool = {
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  categoryName: string;
};

const allTools: FlatTool[] = toolCategories.flatMap((cat) =>
  cat.tools
    .filter((t) => t.status === "live")
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      description: t.description,
      categorySlug: cat.slug,
      categoryName: cat.name,
    }))
);

export default function ToolSearch({
  defaultCategory = "all",
  placeholder,
}: {
  defaultCategory?: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(defaultCategory);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTools.filter((t) => {
      if (categoryFilter !== "all" && t.categorySlug !== categoryFilter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q)
      );
    });
  }, [query, categoryFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, FlatTool[]>();
    for (const t of results) {
      const list = map.get(t.categoryName) ?? [];
      list.push(t);
      map.set(t.categoryName, list);
    }
    return Array.from(map.entries());
  }, [results]);

  const showDropdown = open;

  return (
    <div
      ref={wrapRef}
      style={{
        maxWidth: 640,
        margin: "2rem auto 0",
        position: "relative",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: ".6rem",
          background: "#fff",
          border: "1px solid var(--border-2)",
          borderRadius: 14,
          padding: ".55rem .7rem",
          boxShadow: "var(--shadow-sm)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flex: "1 1 200px" }}>
          <Search size={18} color="var(--muted-2)" style={{ flexShrink: 0, marginLeft: 6 }} />
          <input
            type="text"
            value={query}
            placeholder={placeholder ?? "Search 90 tools — e.g. merge pdf, zakat, resize image…"}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: ".95rem",
              fontFamily: "inherit",
              padding: ".45rem 0",
              minWidth: 0,
              background: "transparent",
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--muted-2)",
                display: "flex",
                padding: 4,
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={categoryFilter}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setOpen(true);
          }}
          style={{
            border: "1px solid var(--border-2)",
            borderRadius: 10,
            padding: ".55rem .7rem",
            fontSize: ".88rem",
            fontFamily: "inherit",
            background: "#fff",
            color: "var(--text)",
            cursor: "pointer",
          }}
        >
          <option value="all">All Categories</option>
          {toolCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 14,
            boxShadow: "var(--shadow-lg)",
            maxHeight: 480,
            overflowY: "auto",
            zIndex: 30,
            padding: ".6rem",
          }}
        >
          <div
            style={{
              fontSize: ".78rem",
              color: "var(--muted-2)",
              padding: ".2rem .6rem .5rem",
              borderBottom: "1px solid var(--border)",
              marginBottom: ".4rem",
            }}
          >
            {results.length} tool{results.length !== 1 ? "s" : ""}
            {query.trim() ? ` matching "${query.trim()}"` : ""}
            {categoryFilter !== "all"
              ? ` in ${toolCategories.find((c) => c.slug === categoryFilter)?.name}`
              : ""}
          </div>
          {results.length === 0 ? (
            <p style={{ padding: "1rem", color: "var(--muted)", fontSize: ".9rem", margin: 0 }}>
              No tools match &quot;{query}&quot;.
            </p>
          ) : (
            grouped.map(([categoryName, tools]) => (
              <div key={categoryName} style={{ marginBottom: ".6rem" }}>
                <div
                  style={{
                    fontSize: ".72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".04em",
                    color: "var(--indigo)",
                    padding: ".4rem .6rem .2rem",
                  }}
                >
                  {categoryName}
                </div>
                {tools.map((t) => (
                  <Link
                    key={`${t.categorySlug}-${t.slug}`}
                    href={`/tools/${t.categorySlug}/${t.slug}`}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "block",
                      padding: ".55rem .6rem",
                      borderRadius: 10,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    className="tool-search-item"
                  >
                    <div style={{ fontWeight: 600, fontSize: ".92rem" }}>{t.name}</div>
                    <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>{t.description}</div>
                  </Link>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
