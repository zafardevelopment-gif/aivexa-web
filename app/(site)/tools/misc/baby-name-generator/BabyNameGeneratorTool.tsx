"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, SelectInput, TabGroup } from "@/components/tools/ToolUI";
import { NAMES, RELIGION_LABELS, type Religion, type Gender } from "./names-data";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function BabyNameGeneratorTool() {
  const [religion, setReligion] = useState<Religion | "all">("all");
  const [gender, setGender] = useState<Gender | "all">("all");
  const [letter, setLetter] = useState("");
  const [query, setQuery] = useState("");
  const [surprise, setSurprise] = useState<(typeof NAMES)[number] | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NAMES.filter((n) => {
      if (religion !== "all" && n.religion !== religion) return false;
      if (gender !== "all" && n.gender !== gender) return false;
      if (letter && !n.name.toUpperCase().startsWith(letter)) return false;
      if (q && !n.name.toLowerCase().includes(q) && !n.meaning.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [religion, gender, letter, query]);

  function surpriseMe() {
    if (filtered.length === 0) return;
    setSurprise(filtered[Math.floor(Math.random() * filtered.length)]);
  }

  return (
    <ToolPageLayout
      title="Baby Name Generator"
      description="Browse Islamic, Hindu, Christian and Sikh baby names with meaning and origin, filterable by gender and letter."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <TabGroup
          value={religion}
          onChange={(v) => setReligion(v as Religion | "all")}
          options={[
            { value: "all", label: "All Religions" },
            ...(Object.keys(RELIGION_LABELS) as Religion[]).map((r) => ({
              value: r,
              label: RELIGION_LABELS[r],
            })),
          ]}
        />
        <TabGroup
          value={gender}
          onChange={(v) => setGender(v as Gender | "all")}
          options={[
            { value: "all", label: "All" },
            { value: "boy", label: "Boy" },
            { value: "girl", label: "Girl" },
          ]}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0 1rem" }}>
          <Field label="Search name or meaning">
            <TextInput
              value={query}
              placeholder="e.g. light, brave, Zain"
              onChange={(e) => setQuery(e.target.value)}
            />
          </Field>
          <Field label="Starting Letter">
            <SelectInput value={letter} onChange={(e) => setLetter(e.target.value)}>
              <option value="">Any</option>
              {letters.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".6rem", margin: "1rem 0" }}>
          <span style={{ fontSize: ".88rem", color: "var(--muted)" }}>
            {filtered.length} name{filtered.length !== 1 ? "s" : ""} found
          </span>
          <button type="button" className="btn-secondary sm" onClick={surpriseMe} disabled={filtered.length === 0}>
            🎲 Surprise me
          </button>
        </div>

        {surprise && (
          <div
            style={{
              background: "var(--indigo-light)",
              border: "1px solid #e0e7ff",
              borderRadius: 12,
              padding: "1rem 1.2rem",
              marginBottom: "1.2rem",
            }}
          >
            <strong style={{ fontSize: "1.1rem" }}>{surprise.name}</strong>
            {surprise.tag && (
              <span style={{ marginLeft: 8, fontSize: ".72rem", background: "var(--indigo)", color: "#fff", padding: "2px 8px", borderRadius: 20 }}>
                {surprise.tag}
              </span>
            )}
            <div style={{ fontSize: ".9rem", color: "var(--muted)", marginTop: 4 }}>
              {surprise.meaning} · {surprise.origin} · {RELIGION_LABELS[surprise.religion]}
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: ".8rem",
            maxHeight: 560,
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          {filtered.slice(0, 300).map((n, i) => (
            <div
              key={`${n.name}-${i}`}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: ".85rem 1rem",
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <strong>{n.name}</strong>
                <span
                  style={{
                    fontSize: ".68rem",
                    color: "var(--indigo)",
                    background: "var(--indigo-light)",
                    padding: "1px 7px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                  }}
                >
                  {n.gender}
                </span>
              </div>
              <div style={{ fontSize: ".85rem", color: "var(--muted)", marginTop: 4 }}>{n.meaning}</div>
              <div style={{ fontSize: ".76rem", color: "var(--muted-2)", marginTop: 4 }}>
                {n.origin} · {RELIGION_LABELS[n.religion]}
              </div>
              {n.tag && (
                <div style={{ fontSize: ".72rem", color: "var(--indigo)", marginTop: 4, fontWeight: 600 }}>
                  {n.tag}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ color: "var(--muted)", gridColumn: "1/-1" }}>No names match these filters.</p>
          )}
        </div>
        {filtered.length > 300 && (
          <p style={{ fontSize: ".8rem", color: "var(--muted-2)", marginTop: ".6rem" }}>
            Showing first 300 of {filtered.length} results — narrow your search to see more relevant names.
          </p>
        )}

        <p style={{ fontSize: ".8rem", color: "var(--muted-2)", marginTop: "1.2rem" }}>
          Meanings are indicative and drawn from commonly documented sources. Please verify with
          religious or linguistic references before finalising a name.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
