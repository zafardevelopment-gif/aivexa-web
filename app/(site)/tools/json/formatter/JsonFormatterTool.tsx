"use client";
import { useState } from "react";
import Link from "next/link";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"beautify" | "minify">("beautify");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function process() {
    setError(""); setOutput("");
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === "beautify" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main style={{ padding: "2.5rem 1.5rem 5rem" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="breadcrumb" style={{ marginBottom: "1.5rem" }}>
          <Link href="/tools">Free Tools</Link><span>/</span>
          <Link href="/tools/json/formatter">JSON Tools</Link><span>/</span>
          <span>JSON Formatter & Validator</span>
        </div>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 800, marginBottom: ".5rem" }}>JSON Formatter & Validator</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Beautify or minify JSON with error detection — 100% browser-based.</p>

        <div style={{ display: "flex", gap: ".6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {(["beautify", "minify"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: ".4rem 1.1rem", borderRadius: 999, border: "1.5px solid",
              borderColor: mode === m ? "#14b8a6" : "var(--border-2)",
              background: mode === m ? "#14b8a6" : "transparent",
              color: mode === m ? "#fff" : "var(--text)",
              fontWeight: 600, fontSize: ".88rem", cursor: "pointer", fontFamily: "inherit"
            }}>{m === "beautify" ? "Beautify" : "Minify"}</button>
          ))}
          <button onClick={process} style={{
            padding: ".4rem 1.4rem", borderRadius: 999, background: "#14b8a6",
            color: "#fff", fontWeight: 700, fontSize: ".88rem", border: "none", cursor: "pointer", fontFamily: "inherit"
          }}>Format →</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: ".4rem" }}>INPUT JSON</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder='{"name":"AIVEXA","type":"AI platform"}'
              style={{ width: "100%", height: 340, fontFamily: "monospace", fontSize: ".88rem", padding: "1rem", border: "1px solid var(--border-2)", borderRadius: 12, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: ".4rem" }}>OUTPUT</label>
            <textarea readOnly value={output}
              style={{ width: "100%", height: 340, fontFamily: "monospace", fontSize: ".88rem", padding: "1rem", border: "1px solid var(--border-2)", borderRadius: 12, resize: "vertical", background: "#f8fafc", boxSizing: "border-box" }} />
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", marginTop: ".8rem", fontFamily: "monospace", fontSize: ".88rem" }}>❌ {error}</p>}

        {output && (
          <button onClick={copy} style={{
            marginTop: ".8rem", padding: ".45rem 1.2rem", borderRadius: 999,
            background: copied ? "#10b981" : "#14b8a6", color: "#fff",
            fontWeight: 600, fontSize: ".85rem", border: "none", cursor: "pointer", fontFamily: "inherit"
          }}>{copied ? "Copied!" : "Copy Output"}</button>
        )}
      </div>
    </main>
  );
}
