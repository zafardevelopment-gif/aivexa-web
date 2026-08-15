"use client";
import { useState } from "react";
import Link from "next/link";

function xmlToObj(xml: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid XML");
  function nodeToObj(node: Element): unknown {
    const children = Array.from(node.children);
    if (children.length === 0) return node.textContent ?? "";
    const obj: Record<string, unknown> = {};
    for (const child of children) {
      const key = child.tagName;
      const val = nodeToObj(child);
      if (obj[key] !== undefined) {
        if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
        (obj[key] as unknown[]).push(val);
      } else { obj[key] = val; }
    }
    return obj;
  }
  return nodeToObj(doc.documentElement);
}

export default function XmlToJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function convert() {
    setError(""); setOutput("");
    try { setOutput(JSON.stringify(xmlToObj(input), null, 2)); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Parse error"); }
  }

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <main style={{ padding: "2.5rem 1.5rem 5rem" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="breadcrumb" style={{ marginBottom: "1.5rem" }}>
          <Link href="/tools">Free Tools</Link><span>/</span>
          <Link href="/tools/json/formatter">JSON Tools</Link><span>/</span>
          <span>XML to JSON</span>
        </div>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 800, marginBottom: ".5rem" }}>XML to JSON Converter</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Parse XML and convert to clean JSON — browser-only, no upload needed.</p>

        <button onClick={convert} style={{ marginBottom: "1rem", padding: ".45rem 1.4rem", borderRadius: 999, background: "#14b8a6", color: "#fff", fontWeight: 700, fontSize: ".88rem", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Convert →</button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: ".4rem" }}>INPUT XML</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={"<root><name>AIVEXA</name><type>AI</type></root>"}
              style={{ width: "100%", height: 340, fontFamily: "monospace", fontSize: ".85rem", padding: "1rem", border: "1px solid var(--border-2)", borderRadius: 12, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: ".4rem" }}>OUTPUT JSON</label>
            <textarea readOnly value={output}
              style={{ width: "100%", height: 340, fontFamily: "monospace", fontSize: ".85rem", padding: "1rem", border: "1px solid var(--border-2)", borderRadius: 12, resize: "vertical", background: "#f8fafc", boxSizing: "border-box" }} />
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", marginTop: ".8rem", fontSize: ".88rem" }}>❌ {error}</p>}
        {output && <button onClick={copy} style={{ marginTop: ".8rem", padding: ".45rem 1.2rem", borderRadius: 999, background: copied ? "#10b981" : "#14b8a6", color: "#fff", fontWeight: 600, fontSize: ".85rem", border: "none", cursor: "pointer", fontFamily: "inherit" }}>{copied ? "Copied!" : "Copy JSON"}</button>}
      </div>
    </main>
  );
}
