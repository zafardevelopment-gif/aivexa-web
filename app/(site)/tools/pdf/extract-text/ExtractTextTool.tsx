"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, TextArea, CopyButton, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  extractTextLines,
  openPdfWithPdfJs,
  pdfErrorMessage,
} from "@/lib/pdf-utils";

export default function ExtractTextTool() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function extract() {
    if (!file) return;
    setError("");
    setText("");
    setBusy(true);
    try {
      const pdf = await openPdfWithPdfJs(await file.arrayBuffer());
      const pages = await extractTextLines(pdf);
      await pdf.cleanup();
      const combined = pages
        .map((lines, i) => `--- Page ${i + 1} ---\n${lines.join("\n")}`)
        .join("\n\n");
      setPageCount(pages.length);
      setCharCount(combined.length);
      setText(combined);
      if (pages.every((lines) => lines.join("").trim() === "")) {
        setError(
          "No selectable text found. This PDF is probably scanned images — it would need OCR, which this tool does not perform."
        );
      }
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  function downloadTxt() {
    if (!file) return;
    downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), `${baseName(file.name)}.txt`);
  }

  return (
    <ToolPageLayout
      title="Extract Text from PDF"
      description="Extract all text content from a PDF, grouped by page. Copy it or save it as a .txt file — entirely in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="application/pdf"
          onFiles={(f) => {
            setFile(f[0]);
            setText("");
            setError("");
          }}
          label="Drag & drop a PDF here, or click to browse"
        />

        {file && (
          <button type="button" className="btn-primary" onClick={extract} disabled={busy}>
            {busy ? "Extracting…" : "Extract Text"}
          </button>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {text && (
          <>
            <div style={{ display: "flex", gap: ".6rem", margin: "1.2rem 0 .8rem" }}>
              <CopyButton text={text} label="Copy all text" />
              <button type="button" className="btn-secondary sm" onClick={downloadTxt}>
                Download .txt
              </button>
            </div>
            <TextArea value={text} readOnly style={{ minHeight: 320, fontFamily: "monospace", fontSize: ".82rem" }} />
            <ResultBox>
              <ResultRow label="Pages" value={pageCount} />
              <ResultRow label="Characters" value={charCount.toLocaleString()} />
            </ResultBox>
          </>
        )}
      </Card>
    </ToolPageLayout>
  );
}
