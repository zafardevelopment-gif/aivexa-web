"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, Field, TextInput, ResultBox, ResultRow } from "@/components/tools/ToolUI";

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\b(mr|mrs|ms|dr|shri|smt|kumari|md|mohd|mohammad|muhammad)\b/g, (m) =>
      ["md", "mohd", "mohammad", "muhammad"].includes(m) ? "mohammed" : ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return dp[m][n];
}

function similarity(a: string, b: string) {
  if (!a && !b) return 100;
  const maxLen = Math.max(a.length, b.length) || 1;
  return Math.round((1 - levenshtein(a, b) / maxLen) * 100);
}

export default function PanAadhaarNameMatcherTool() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  const r = useMemo(() => {
    const a = normalize(name1);
    const b = normalize(name2);
    if (!a || !b) return null;

    const overall = similarity(a, b);

    // token-level analysis (handles reordered names: "Kumar Ravi" vs "Ravi Kumar")
    const ta = a.split(" ");
    const tb = b.split(" ");
    const sortedSim = similarity([...ta].sort().join(" "), [...tb].sort().join(" "));

    // initials check (R Kumar vs Ravi Kumar)
    const initialsMatch =
      ta.length === tb.length &&
      ta.every((t, i) => t[0] === tb[i]?.[0]);

    const score = Math.max(overall, sortedSim);
    let verdict: string, note: string;
    if (score >= 95) {
      verdict = "Exact / near-exact match";
      note = "Names match. No correction needed.";
    } else if (score >= 80) {
      verdict = "Likely same person — minor mismatch";
      note = "Spelling variation detected (e.g. missing letter or transliteration difference). Government systems usually accept this, but updating one document to match the other is safer.";
    } else if (sortedSim > overall + 10) {
      verdict = "Same words, different order";
      note = "First/last name order differs between documents. Update one document so the order matches.";
    } else if (initialsMatch) {
      verdict = "Initials vs full name";
      note = "One document uses initials. Expand initials to the full name for PAN-Aadhaar linking.";
    } else {
      verdict = "Significant mismatch";
      note = "Names differ substantially. PAN-Aadhaar linking or e-KYC may fail — update the incorrect document (Aadhaar via SSUP portal, PAN via NSDL/UTIITSL correction form).";
    }

    return { score, sortedSim, overall, verdict, note };
  }, [name1, name2]);

  return (
    <ToolPageLayout
      title="PAN-Aadhaar Name Matcher"
      description="Check if the name on your PAN and Aadhaar (or any two documents) matches — get a similarity score and correction suggestions. Everything runs in your browser; nothing is uploaded."
      categoryHref="/tools/misc"
      categoryName="Misc & Educational"
    >
      <Card>
        <Field label="Name as per PAN (or document 1)">
          <TextInput value={name1} onChange={(e) => setName1(e.target.value)} placeholder="e.g. RAVI KUMAR SHARMA" />
        </Field>
        <Field label="Name as per Aadhaar (or document 2)">
          <TextInput value={name2} onChange={(e) => setName2(e.target.value)} placeholder="e.g. Ravi Kumar Sarma" />
        </Field>

        {r && (
          <ResultBox>
            <ResultRow
              label="Similarity score"
              value={
                <span style={{ color: r.score >= 80 ? "var(--indigo)" : "#b91c1c", fontSize: "1.05rem" }}>
                  {r.score}%
                </span>
              }
            />
            <ResultRow label="Verdict" value={r.verdict} />
            <p style={{ marginTop: ".8rem", fontSize: ".9rem", color: "var(--muted)", lineHeight: 1.6 }}>
              {r.note}
            </p>
          </ResultBox>
        )}

        <p style={{ marginTop: "1.2rem", fontSize: ".85rem", color: "var(--muted)" }}>
          This is an indicative check — official systems (Income Tax e-filing, UIDAI) use their
          own matching logic. Your names are never sent to any server.
        </p>
      </Card>
    </ToolPageLayout>
  );
}
