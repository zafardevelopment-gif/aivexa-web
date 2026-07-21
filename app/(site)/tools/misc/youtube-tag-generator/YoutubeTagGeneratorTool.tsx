"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, SelectInput, CopyButton } from "@/components/tools/ToolUI";

const REGIONS = [
  { code: "IN", label: "India" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "PK", label: "Pakistan" },
  { code: "BD", label: "Bangladesh" },
  { code: "AE", label: "UAE" },
];

export default function YoutubeTagGeneratorTool() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("IN");
  const [tags, setTags] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedTags = useMemo(
    () => tags.filter((t) => selected.has(t)),
    [tags, selected]
  );
  const joined = selectedTags.join(", ");

  async function generate() {
    const q = query.trim();
    if (q.length < 2) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        `/api/youtube-tags?q=${encodeURIComponent(q)}&gl=${region}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      const list: string[] = data.tags ?? [];
      setTags(list);
      setSelected(new Set(list));
      if (!list.length) setError("No tags found. Try a broader keyword.");
    } catch {
      setError("Could not fetch suggestions. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function toggle(tag: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  return (
    <ToolPageLayout
      title="YouTube Tag Generator"
      description="Enter your video topic and get SEO-optimized YouTube tags pulled from real YouTube search suggestions. Click a tag to include/exclude it, then copy all."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: ".75rem", alignItems: "end" }}>
          <Field label="Video topic / title keyword">
            <TextInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. mobile photography tips"
            />
          </Field>
          <Field label="Region">
            <SelectInput value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r.code} value={r.code}>{r.label}</option>
              ))}
            </SelectInput>
          </Field>
        </div>
        <button
          className="btn-primary"
          onClick={generate}
          disabled={busy || query.trim().length < 2}
          style={{ marginTop: "1rem", width: "100%" }}
        >
          {busy ? "Generating…" : "Generate Tags"}
        </button>
        {error && (
          <p style={{ color: "#b91c1c", marginTop: ".75rem", fontSize: ".9rem" }}>{error}</p>
        )}
      </Card>

      {tags.length > 0 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".5rem", marginBottom: ".9rem" }}>
            <strong>
              {selectedTags.length} tags · {joined.length}/500 characters
              {joined.length > 500 && (
                <span style={{ color: "#b91c1c" }}> — over YouTube&apos;s limit, deselect some</span>
              )}
            </strong>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <button
                className="btn-secondary"
                style={{ fontSize: ".85rem" }}
                onClick={() =>
                  setSelected(selected.size === tags.length ? new Set() : new Set(tags))
                }
              >
                {selected.size === tags.length ? "Deselect all" : "Select all"}
              </button>
              <CopyButton text={joined} label="Copy tags" />
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
            {tags.map((tag) => {
              const on = selected.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  style={{
                    padding: ".35rem .8rem",
                    borderRadius: 999,
                    fontSize: ".88rem",
                    cursor: "pointer",
                    border: on ? "1px solid var(--indigo)" : "1px solid #e5e7eb",
                    background: on ? "var(--indigo-light)" : "#fff",
                    color: on ? "var(--indigo)" : "var(--muted)",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <textarea
            readOnly
            value={joined}
            rows={4}
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: ".75rem",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              fontSize: ".9rem",
              color: "var(--muted)",
            }}
            onFocus={(e) => e.currentTarget.select()}
          />
        </Card>
      )}
    </ToolPageLayout>
  );
}
