"use client";
import { useState } from "react";
import Link from "next/link";

function toXml(obj: unknown, tag = "root", indent = 0): string {
  const pad = "  ".repeat(indent);
  if (Array.isArray(obj)) {
    return obj.map(item => toXml(item, "item", indent)).join("\n");
  }
  if (obj !== null && typeof obj === "object") {
    const inner = Object.entries(obj as Record<string, unknown>)
      .map(([k, v]) => toXml(v, k, indent + 1)).join("\n");
    return `${pad}<${tag}>\n${inner}\n${pad}</${tag}>`;
  }
  return `${pad}<${tag}>${String(obj ?? "")}</${tag}>`;
}

export default function JsonToXmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function convert() {
    setError(""); setOutput("");
    try {
      const parsed = JSON.parse(input);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(parsed, "root")}`;
      setOutput(xml);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <main style={{ padding: "2.5rem 1.5rem 5rem" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="breadcrumb" style={{ marginBottom: "1.5rem" }}>
          <Link href="/tools">Free Tools</Link><span>/</span>
          <Link href="/tools/json/formatter">JSON Tools</Link><span>/</span>
          <span>JSON to XML</span>
        </div>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 800, marginBottom: ".5rem" }}>JSON to XML Converter</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Transform JSON objects to valid XML format — browser-only, instant.</p>

        <button onClick={convert} style={{ marginBottom: "1rem", padding: ".45rem 1.4rem", borderRadius: 999, background: "#14b8a6", color: "#fff", fontWeight: 700, fontSize: ".88rem", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Convert →</button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: ".4rem" }}>INPUT JSON</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={'{"name":"AIVEXA","type":"AI"}'}
              style={{ width: "100%", height: 340, fontFamily: "monospace", fontSize: ".85rem", padding: "1rem", border: "1px solid var(--border-2)", borderRadius: 12, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: ".4rem" }}>OUTPUT XML</label>
            <textarea readOnly value={output}
              style={{ width: "100%", height: 340, fontFamily: "monospace", fontSize: ".85rem", padding: "1rem", border: "1px solid var(--border-2)", borderRadius: 12, resize: "vertical", background: "#f8fafc", boxSizing: "border-box" }} />
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", marginTop: ".8rem", fontSize: ".88rem" }}>❌ {error}</p>}
        {output && <button onClick={copy} style={{ marginTop: ".8rem", padding: ".45rem 1.2rem", borderRadius: 999, background: copied ? "#10b981" : "#14b8a6", color: "#fff", fontWeight: 600, fontSize: ".85rem", border: "none", cursor: "pointer", fontFamily: "inherit" }}>{copied ? "Copied!" : "Copy XML"}</button>}
      </div>
    </main>
  );
}
