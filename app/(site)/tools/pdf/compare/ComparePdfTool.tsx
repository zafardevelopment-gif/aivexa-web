"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  extractTextLines,
  openPdfWithPdfJs,
  pdfErrorMessage,
} from "@/lib/pdf-utils";

type DiffLine = { type: "same" | "add" | "del"; text: string };

const MAX_LINES = 4000;

/** Simple LCS-based line diff. */
function diffLines(a: string[], b: string[]): DiffLine[] {
  const n = a.length;
  const m = b.length;
  // lcs[i][j] = LCS length of a[i..] and b[j..], flattened.
  const width = m + 1;
  const lcs = new Uint32Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i * width + j] =
        a[i] === b[j]
          ? lcs[(i + 1) * width + j + 1] + 1
          : Math.max(lcs[(i + 1) * width + j], lcs[i * width + j + 1]);
    }
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (lcs[(i + 1) * width + j] >= lcs[i * width + j + 1]) {
      out.push({ type: "del", text: a[i] });
      i++;
    } else {
      out.push({ type: "add", text: b[j] });
      j++;
    }
  }
  while (i < n) out.push({ type: "del", text: a[i++] });
  while (j < m) out.push({ type: "add", text: b[j++] });
  return out;
}

async function pdfToLines(file: File): Promise<string[]> {
  const pdf = await openPdfWithPdfJs(await file.arrayBuffer());
  const pages = await extractTextLines(pdf);
  await pdf.cleanup();
  return pages
    .flat()
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

export default function ComparePdfTool() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [diff, setDiff] = useState<DiffLine[] | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function compare() {
    if (!fileA || !fileB) return;
    setError("");
    setDiff(null);
    setBusy(true);
    try {
      let linesA = await pdfToLines(fileA);
      let linesB = await pdfToLines(fileB);
      if (linesA.length === 0 && linesB.length === 0) {
        throw new Error(
          "Neither PDF contains selectable text (scanned PDFs need OCR, which this tool does not perform)."
        );
      }
      const wasTruncated = linesA.length > MAX_LINES || linesB.length > MAX_LINES;
      if (wasTruncated) {
        linesA = linesA.slice(0, MAX_LINES);
        linesB = linesB.slice(0, MAX_LINES);
      }
      setTruncated(wasTruncated);
      setDiff(diffLines(linesA, linesB));
    } catch (e) {
      setError(e instanceof Error ? e.message : pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const added = diff?.filter((d) => d.type === "add").length ?? 0;
  const removed = diff?.filter((d) => d.type === "del").length ?? 0;

  return (
    <ToolPageLayout
      title="Compare PDFs"
      description="Upload two versions of a PDF and see a line-by-line text diff: additions in green, removals in red — all in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <div className="tool-cols" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: ".9rem", marginBottom: ".5rem" }}>Original PDF</p>
            <FileDropzone
              accept="application/pdf"
              onFiles={(f) => {
                setFileA(f[0]);
                setDiff(null);
                setError("");
              }}
              label={fileA ? fileA.name : "Drop or click"}
            />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: ".9rem", marginBottom: ".5rem" }}>Revised PDF</p>
            <FileDropzone
              accept="application/pdf"
              onFiles={(f) => {
                setFileB(f[0]);
                setDiff(null);
                setError("");
              }}
              label={fileB ? fileB.name : "Drop or click"}
            />
          </div>
        </div>

        <button type="button" className="btn-primary" onClick={compare} disabled={busy || !fileA || !fileB}>
          {busy ? "Comparing…" : "Compare"}
        </button>

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {diff && (
          <>
            <ResultBox>
              <ResultRow label="Lines added" value={<span style={{ color: "#15803d" }}>+{added}</span>} />
              <ResultRow label="Lines removed" value={<span style={{ color: "#dc2626" }}>-{removed}</span>} />
              <ResultRow label="Unchanged lines" value={diff.length - added - removed} />
              {truncated && (
                <p style={{ marginTop: ".6rem", fontSize: ".82rem", color: "#b45309" }}>
                  Very large documents were truncated to the first {MAX_LINES.toLocaleString()} lines each.
                </p>
              )}
            </ResultBox>

            {added + removed === 0 ? (
              <p style={{ marginTop: "1rem", fontSize: ".9rem", color: "var(--muted)" }}>
                The text content of both PDFs is identical.
              </p>
            ) : (
              <div
                style={{
                  marginTop: "1.2rem",
                  border: "1px solid var(--border-2)",
                  borderRadius: "10px",
                  maxHeight: 420,
                  overflow: "auto",
                  fontFamily: "monospace",
                  fontSize: ".8rem",
                  lineHeight: 1.5,
                }}
              >
                {diff.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      padding: ".1rem .7rem",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      background:
                        line.type === "add" ? "#dcfce7" : line.type === "del" ? "#fee2e2" : "transparent",
                      color: line.type === "add" ? "#15803d" : line.type === "del" ? "#b91c1c" : "var(--text)",
                    }}
                  >
                    {line.type === "add" ? "+ " : line.type === "del" ? "- " : "  "}
                    {line.text}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Card>
    </ToolPageLayout>
  );
}
