"use client";

import { useRef, useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import { Card, CopyButton, ResultBox, ResultRow } from "@/components/tools/ToolUI";

// ─── helpers ──────────────────────────────────────────────────────────────────

function downloadMd(md: string, filename: string) {
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

// Load a CDN script once, returning a promise that resolves when loaded
const scriptCache: Record<string, Promise<void>> = {};
function loadScript(src: string): Promise<void> {
  if (scriptCache[src]) return scriptCache[src];
  scriptCache[src] = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
  return scriptCache[src];
}

// ─── converters ───────────────────────────────────────────────────────────────

/** PDF → Markdown using pdfjs-dist */
async function pdfToMarkdown(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  const ab = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise;
  const parts: string[] = [`# ${baseName(file.name)}\n`];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines = content.items
      .filter((item): item is { str: string; hasEOL: boolean } => "str" in item)
      .map((item) => (item.hasEOL ? item.str + "\n" : item.str))
      .join("")
      .trim();
    if (lines) parts.push(`## Page ${i}\n\n${lines}`);
  }
  await pdf.cleanup();
  return parts.join("\n\n");
}

/** DOCX → Markdown using mammoth.js from CDN */
async function docxToMarkdown(file: File): Promise<string> {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mammoth = (window as any).mammoth;
  const ab = await file.arrayBuffer();
  const result = await mammoth.convertToMarkdown({ arrayBuffer: ab });
  const md = result.value.trim();
  return `# ${baseName(file.name)}\n\n${md}`;
}

/** XLSX → Markdown table using SheetJS from CDN */
async function xlsxToMarkdown(file: File): Promise<string> {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const XLSX = (window as any).XLSX;
  const ab = await file.arrayBuffer();
  const wb = XLSX.read(ab, { type: "array" });
  const parts: string[] = [`# ${baseName(file.name)}\n`];
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    if (!rows.length) continue;
    parts.push(`## ${sheetName}\n`);
    const header = rows[0].map(String);
    const separator = header.map(() => "---");
    const mdRows = [header, separator, ...rows.slice(1).map((r) => r.map(String))];
    parts.push(mdRows.map((r) => `| ${r.join(" | ")} |`).join("\n"));
  }
  return parts.join("\n\n");
}

/** CSV → Markdown table (pure JS) */
function csvToMarkdown(text: string, fileName: string): string {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return "";
  const parse = (line: string) =>
    line.split(",").map((c) => c.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
  const header = parse(lines[0]);
  const separator = header.map(() => "---");
  const rows = lines.slice(1).map(parse);
  const mdRows = [header, separator, ...rows];
  const table = mdRows.map((r) => `| ${r.join(" | ")} |`).join("\n");
  return `# ${baseName(fileName)}\n\n${table}`;
}

/** HTML → Markdown (simple, no CDN needed) */
function htmlToMarkdown(html: string, fileName: string): string {
  const rules: [RegExp, string | ((m: string, ...g: string[]) => string)][] = [
    [/<h1[^>]*>(.*?)<\/h1>/gi, "# $1"],
    [/<h2[^>]*>(.*?)<\/h2>/gi, "## $1"],
    [/<h3[^>]*>(.*?)<\/h3>/gi, "### $1"],
    [/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1"],
    [/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1"],
    [/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1"],
    [/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**"],
    [/<b[^>]*>(.*?)<\/b>/gi, "**$1**"],
    [/<em[^>]*>(.*?)<\/em>/gi, "_$1_"],
    [/<i[^>]*>(.*?)<\/i>/gi, "_$1_"],
    [/<code[^>]*>(.*?)<\/code>/gi, "`$1`"],
    [/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)"],
    [/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, "![$1]($2)"],
    [/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)"],
    [/<li[^>]*>(.*?)<\/li>/gi, "- $1"],
    [/<br\s*\/?>/gi, "\n"],
    [/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n"],
    [/<hr\s*\/?>/gi, "\n---\n"],
    [/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) =>
      inner.trim().split("\n").map((l: string) => `> ${l}`).join("\n")
    ],
    [/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```"],
    [/<[^>]+>/g, ""],
    [/&nbsp;/g, " "],
    [/&amp;/g, "&"],
    [/&lt;/g, "<"],
    [/&gt;/g, ">"],
    [/&quot;/g, '"'],
    [/&#39;/g, "'"],
    [/\n{3,}/g, "\n\n"],
  ];
  let md = html;
  for (const [pattern, replacement] of rules) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    md = md.replace(pattern, replacement as any);
  }
  return `# ${baseName(fileName)}\n\n${md.trim()}`;
}

/** TXT → Markdown (wrap in a document heading) */
function txtToMarkdown(text: string, fileName: string): string {
  return `# ${baseName(fileName)}\n\n${text.trim()}`;
}

/** JSON → Markdown code block */
function jsonToMarkdown(text: string, fileName: string): string {
  let formatted = text;
  try { formatted = JSON.stringify(JSON.parse(text), null, 2); } catch {}
  return `# ${baseName(fileName)}\n\n\`\`\`json\n${formatted}\n\`\`\``;
}

/** Image → Markdown using Tesseract.js OCR from CDN */
async function imageToMarkdown(file: File): Promise<string> {
  await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tesseract = (window as any).Tesseract;
  const url = URL.createObjectURL(file);
  try {
    const result = await Tesseract.recognize(url, "eng", {});
    const text = result.data.text.trim();
    URL.revokeObjectURL(url);
    if (!text) return `# ${baseName(file.name)}\n\n_No text detected in this image._`;
    return `# ${baseName(file.name)}\n\n${text}`;
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

// ─── accepted types ────────────────────────────────────────────────────────────

const ACCEPTED =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.html,.htm,.json,image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp";

const TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "text/csv": "CSV",
  "text/plain": "TXT",
  "text/markdown": "MD",
  "text/html": "HTML",
  "application/json": "JSON",
};

function detectType(file: File): string {
  if (file.type && TYPE_LABELS[file.type]) return TYPE_LABELS[file.type];
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return ext.toUpperCase();
}

// ─── component ────────────────────────────────────────────────────────────────

export default function FileToMarkdownTool() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function reset(newFile?: File) {
    setMarkdown("");
    setError("");
    setProgress("");
    if (newFile) setFile(newFile);
  }

  function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    reset(list[0]);
  }

  async function convert() {
    if (!file) return;
    setError("");
    setMarkdown("");
    setBusy(true);
    const type = detectType(file);
    try {
      let md = "";
      if (type === "PDF") {
        setProgress("Reading PDF…");
        md = await pdfToMarkdown(file);
      } else if (type === "DOCX" || type === "DOC") {
        setProgress("Converting Word document…");
        md = await docxToMarkdown(file);
      } else if (type === "XLSX" || type === "XLS") {
        setProgress("Converting Excel spreadsheet…");
        md = await xlsxToMarkdown(file);
      } else if (type === "CSV") {
        setProgress("Parsing CSV…");
        md = csvToMarkdown(await file.text(), file.name);
      } else if (type === "HTML" || type === "HTM") {
        setProgress("Converting HTML…");
        md = htmlToMarkdown(await file.text(), file.name);
      } else if (type === "JSON") {
        setProgress("Formatting JSON…");
        md = jsonToMarkdown(await file.text(), file.name);
      } else if (type === "TXT" || type === "MD") {
        setProgress("Wrapping text…");
        md = txtToMarkdown(await file.text(), file.name);
      } else if (file.type.startsWith("image/")) {
        setProgress("Running OCR on image… (this may take 10–30 s)");
        md = await imageToMarkdown(file);
      } else {
        throw new Error(`Unsupported file type: ${type || file.type}. Please upload a PDF, DOCX, XLSX, CSV, image, HTML, JSON or TXT file.`);
      }
      setMarkdown(md);
      setProgress("");
    } catch (e) {
      setProgress("");
      setError(e instanceof Error ? e.message : "Conversion failed. Please try a different file.");
    } finally {
      setBusy(false);
    }
  }

  const wordCount = markdown ? markdown.trim().split(/\s+/).length : 0;
  const lineCount = markdown ? markdown.split("\n").length : 0;

  return (
    <ToolPageLayout
      title="File to Markdown Converter"
      description="Upload a PDF, Word, Excel, CSV, image, HTML, JSON or plain-text file and get a clean Markdown (.md) file — processed entirely in your browser."
      categoryHref="/tools/markdown"
      categoryName="Markdown Converter"
    >
      <Card>
        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); }
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          style={{
            border: `2px dashed ${dragOver ? "var(--indigo, #4f46e5)" : "var(--border-2, #cbd5e1)"}`,
            background: dragOver ? "var(--indigo-light, #eef2ff)" : "#fafafa",
            borderRadius: "12px",
            padding: "2.2rem 1.5rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color .15s, background .15s",
            marginBottom: "1.2rem",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            style={{ display: "none" }}
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
          />
          <div style={{ fontSize: "2rem", marginBottom: ".4rem" }} aria-hidden>📄</div>
          <div style={{ fontWeight: 600, marginBottom: ".35rem" }}>
            {file ? file.name : "Drag & drop a file here, or click to browse"}
          </div>
          <div style={{ fontSize: ".82rem", color: "var(--muted, #64748b)" }}>
            {file
              ? `${detectType(file)} · ${(file.size / 1024).toFixed(1)} KB — click to change`
              : "PDF · DOCX · XLSX · CSV · Image · HTML · JSON · TXT"}
          </div>
        </div>

        {/* Supported formats legend */}
        {!file && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", marginBottom: "1rem" }}>
            {["PDF", "DOCX", "XLSX", "CSV", "PNG / JPG", "HTML", "JSON", "TXT"].map((f) => (
              <span
                key={f}
                style={{
                  fontSize: ".74rem",
                  fontWeight: 600,
                  padding: ".2rem .55rem",
                  borderRadius: 6,
                  background: "var(--indigo-light, #eef2ff)",
                  color: "var(--indigo, #4f46e5)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {file && !busy && (
          <button type="button" className="btn-primary" onClick={convert}>
            Convert to Markdown
          </button>
        )}

        {busy && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".7rem",
              padding: "1rem",
              background: "var(--indigo-light, #eef2ff)",
              borderRadius: 10,
              marginTop: ".5rem",
              fontSize: ".9rem",
              color: "var(--indigo, #4f46e5)",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                border: "2.5px solid var(--indigo, #4f46e5)",
                borderTopColor: "transparent",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }}
            />
            {progress || "Converting…"}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && (
          <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>
        )}

        {markdown && (
          <>
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", margin: "1.2rem 0 .8rem" }}>
              <CopyButton text={markdown} label="Copy Markdown" />
              <button
                type="button"
                className="btn-secondary sm"
                onClick={() => downloadMd(markdown, `${baseName(file!.name)}.md`)}
              >
                Download .md
              </button>
              <button
                type="button"
                className="btn-secondary sm"
                onClick={() => reset()}
                style={{ marginLeft: "auto" }}
              >
                Convert another
              </button>
            </div>

            <textarea
              readOnly
              value={markdown}
              style={{
                width: "100%",
                minHeight: 360,
                fontFamily: "monospace",
                fontSize: ".82rem",
                border: "1px solid var(--border-2, #cbd5e1)",
                borderRadius: 10,
                padding: ".9rem 1rem",
                resize: "vertical",
                background: "#fafafa",
                color: "var(--text)",
                lineHeight: 1.65,
                boxSizing: "border-box",
              }}
            />

            <ResultBox>
              <ResultRow label="Words" value={wordCount.toLocaleString()} />
              <ResultRow label="Lines" value={lineCount.toLocaleString()} />
              <ResultRow label="Characters" value={markdown.length.toLocaleString()} />
              <ResultRow label="Source type" value={detectType(file!)} />
            </ResultBox>
          </>
        )}
      </Card>

      {/* Privacy note */}
      <p
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: ".82rem",
          color: "var(--muted-2, #94a3b8)",
        }}
      >
        🔒 All conversion happens locally in your browser — your files are never uploaded anywhere.
      </p>
    </ToolPageLayout>
  );
}
