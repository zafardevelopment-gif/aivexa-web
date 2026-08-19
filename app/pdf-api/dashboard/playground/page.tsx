"use client";

import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Play, Download, Copy, Check, FileText } from "lucide-react";

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 40px; color: #1a1a2e; }
    h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
    .info { background: #f8f9ff; padding: 16px; border-radius: 8px; margin: 16px 0; }
    .badge { background: #6366f1; color: white; padding: 2px 10px; border-radius: 100px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>AIVEXA PDF API <span class="badge">Test</span></h1>
  <div class="info">
    <p><strong>Invoice #INV-2026-001</strong></p>
    <p>Customer: AIVEXA LLP</p>
    <p>Amount: ₹25,000.00</p>
    <p>Date: ${new Date().toLocaleDateString("en-IN")}</p>
  </div>
  <p>Generated using <strong>AIVEXA PDF API</strong> — HTML &amp; URL to PDF for developers.</p>
</body>
</html>`;

type Mode = "html" | "url";

export default function PlaygroundPage() {
  const [mode, setMode] = useState<Mode>("html");
  const [htmlInput, setHtmlInput] = useState(DEFAULT_HTML);
  const [urlInput, setUrlInput] = useState("https://example.com");
  const [apiKey, setApiKey] = useState("");
  const [format, setFormat] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean; requestId?: string; genMs?: number;
    sizeBytes?: number; error?: string; pdfUrl?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const getAuthHeader = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession();
    return { Authorization: session ? `Bearer ${session.access_token}` : "" };
  };

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const startMs = Date.now();

    try {
      const endpoint = mode === "html" ? "/api/v1/pdf" : "/api/v1/url-to-pdf";
      const body = mode === "html"
        ? { html: htmlInput, format, orientation }
        : { url: urlInput, format, orientation };

      const authHeaders = await getAuthHeader();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
          // Explicit apiKey overrides session token when provided
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const requestId = res.headers.get("x-request-id") ?? undefined;
      const genMs = parseInt(res.headers.get("x-pdf-generation-ms") ?? "0");

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setResult({ ok: false, requestId, error: errData?.error?.message ?? `HTTP ${res.status}` });
        return;
      }

      const blob = await res.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setResult({ ok: true, requestId, genMs, sizeBytes: blob.size, pdfUrl });
    } catch (err) {
      setResult({ ok: false, error: err instanceof Error ? err.message : "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const getCurlCode = () => {
    const k = apiKey || "YOUR_API_KEY";
    if (mode === "html") {
      return `curl -X POST https://aivexa.com/api/v1/pdf \\
  -H "Authorization: Bearer ${k}" \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Hello World</h1>", "format": "${format}", "orientation": "${orientation}"}' \\
  --output document.pdf`;
    }
    return `curl -X POST https://aivexa.com/api/v1/url-to-pdf \\
  -H "Authorization: Bearer ${k}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${urlInput}", "format": "${format}"}' \\
  --output page.pdf`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCurlCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
          API Playground
        </h1>
        <p style={{ fontSize: 14, color: "var(--pdf-muted)", marginTop: 6 }}>
          Test the API live without writing code.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        {/* Left: Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 4, background: "var(--pdf-surface)", border: "1px solid var(--pdf-border)", borderRadius: 10, padding: 4, width: "fit-content" }}>
            {(["html", "url"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="pdfapi-btn"
                style={{
                  padding: "6px 20px", fontSize: 13,
                  background: mode === m ? "var(--pdf-accent)" : "transparent",
                  color: mode === m ? "#fff" : "var(--pdf-muted)",
                }}
              >
                {m === "html" ? "HTML → PDF" : "URL → PDF"}
              </button>
            ))}
          </div>

          {/* API Key */}
          <div>
            <label className="pdfapi-label">API Key (optional — uses your session if blank)</label>
            <input
              className="pdfapi-input"
              type="password"
              placeholder="avx_pdf_live_... or avx_pdf_test_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          {/* Input */}
          {mode === "html" ? (
            <div>
              <label className="pdfapi-label">HTML</label>
              <textarea
                className="pdfapi-textarea"
                rows={16}
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label className="pdfapi-label">URL</label>
              <input
                className="pdfapi-input"
                type="url"
                placeholder="https://example.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
          )}

          {/* Generate */}
          <button
            className="pdfapi-btn pdfapi-btn-primary"
            style={{ padding: "12px 28px", fontSize: 15 }}
            onClick={generate}
            disabled={loading}
          >
            {loading ? (
              <>Generating PDF…</>
            ) : (
              <><Play size={15} /> Generate PDF</>
            )}
          </button>

          {/* cURL code */}
          <div className="pdfapi-card" style={{ padding: 0 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--pdf-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--pdf-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>cURL</span>
              <button className="pdfapi-btn pdfapi-btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={copyCode}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="pdfapi-code" style={{ margin: 0, borderRadius: "0 0 12px 12px", border: "none", fontSize: 12 }}>
              {getCurlCode()}
            </pre>
          </div>
        </div>

        {/* Right: Options + Result */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Options */}
          <div className="pdfapi-card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 16, color: "var(--pdf-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              PDF Options
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="pdfapi-label">Format</label>
                <select className="pdfapi-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                  {["A3", "A4", "A5", "Letter", "Legal", "Tabloid"].map(f => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="pdfapi-label">Orientation</label>
                <select className="pdfapi-select" value={orientation} onChange={(e) => setOrientation(e.target.value)}>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="pdfapi-card" style={{
              borderColor: result.ok ? "var(--pdf-success)" : "var(--pdf-error)",
              background: result.ok ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
            }}>
              <div style={{ fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={15} color={result.ok ? "var(--pdf-success)" : "var(--pdf-error)"} />
                {result.ok ? "PDF Generated!" : "Generation Failed"}
              </div>

              {result.requestId && (
                <div style={{ fontSize: 12, color: "var(--pdf-muted)", marginBottom: 8 }}>
                  Request ID: <code style={{ fontFamily: "monospace" }}>{result.requestId}</code>
                </div>
              )}
              {result.ok && (
                <>
                  <div style={{ fontSize: 12, color: "var(--pdf-muted)", marginBottom: 4 }}>
                    Generation time: <strong style={{ color: "var(--pdf-text)" }}>{result.genMs}ms</strong>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--pdf-muted)", marginBottom: 16 }}>
                    File size: <strong style={{ color: "var(--pdf-text)" }}>
                      {((result.sizeBytes ?? 0) / 1024).toFixed(1)} KB
                    </strong>
                  </div>
                  <a
                    href={result.pdfUrl}
                    download="aivexa-pdf.pdf"
                    className="pdfapi-btn pdfapi-btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Download size={14} /> Download PDF
                  </a>
                </>
              )}
              {!result.ok && (
                <p style={{ fontSize: 13, color: "var(--pdf-error)", margin: 0 }}>{result.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
