"use client";
import { useState } from "react";
import Link from "next/link";

export default function JsonToCsvPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function convert() {
    setError(""); setOutput("");
    try {
      const parsed = JSON.parse(input);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      if (arr.length === 0) { setError("Empty array"); return; }
      const keys = Object.keys(arr[0]);
      const header = keys.map(k => `"${k}"`).join(",");
      const rows = arr.map(row => keys.map(k => {
        const val = row[k] ?? "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(","));
      setOutput([header, ...rows].join("\n"));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function download() {
    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "output.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <main style={{ padding: "2.5rem 1.5rem 5rem" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="breadcrumb" style={{ marginBottom: "1.5rem" }}>
          <Link href="/tools">Free Tools</Link><span>/</span>
          <Link href="/tools/json/formatter">JSON Tools</Link><span>/</span>
          <span>JSON to CSV</span>
        </div>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 800, marginBottom: ".5rem" }}>JSON to CSV Converter</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Convert JSON arrays to CSV format — download or copy. Browser-only, no upload.</p>

        <button onClick={convert} style={{
          marginBottom: "1rem", padding: ".45rem 1.4rem", borderRadius: 999,
          background: "#14b8a6", color: "#fff", fontWeight: 700, fontSize: ".88rem", border: "none", cursor: "pointer", fontFamily: "inherit"
        }}>Convert →</button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: ".4rem" }}>INPUT JSON (array)</label>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder={'[{"name":"Alice","age":30},{"name":"Bob","age":25}]'}
              style={{ width: "100%", height: 340, fontFamily: "monospace", fontSize: ".85rem", padding: "1rem", border: "1px solid var(--border-2)", borderRadius: 12, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: ".4rem" }}>OUTPUT CSV</label>
            <textarea readOnly value={output}
              style={{ width: "100%", height: 340, fontFamily: "monospace", fontSize: ".85rem", padding: "1rem", border: "1px solid var(--border-2)", borderRadius: 12, resize: "vertical", background: "#f8fafc", boxSizing: "border-box" }} />
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", marginTop: ".8rem", fontFamily: "monospace", fontSize: ".88rem" }}>❌ {error}</p>}

        {output && (
          <div style={{ display: "flex", gap: ".6rem", marginTop: ".8rem", flexWrap: "wrap" }}>
            <button onClick={copy} style={{ padding: ".45rem 1.2rem", borderRadius: 999, background: copied ? "#10b981" : "#14b8a6", color: "#fff", fontWeight: 600, fontSize: ".85rem", border: "none", cursor: "pointer", fontFamily: "inherit" }}>{copied ? "Copied!" : "Copy CSV"}</button>
            <button onClick={download} style={{ padding: ".45rem 1.2rem", borderRadius: 999, background: "#1e293b", color: "#fff", fontWeight: 600, fontSize: ".85rem", border: "none", cursor: "pointer", fontFamily: "inherit" }}>⬇ Download .csv</button>
          </div>
        )}
      </div>
    </main>
  );
}
