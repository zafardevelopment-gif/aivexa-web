"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropzone from "@/components/tools/FileDropzone";
import { Card, Field, TextInput, SelectInput, TabGroup, ResultBox, ResultRow } from "@/components/tools/ToolUI";
import {
  baseName,
  downloadBlob,
  formatBytes,
  parsePageRanges,
  pdfErrorMessage,
} from "@/lib/pdf-utils";

export default function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [scope, setScope] = useState("all");
  const [pagesInput, setPagesInput] = useState("");
  const [angle, setAngle] = useState("90");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ rotated: number; size: number } | null>(null);

  async function onFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setPageCount(null);
    setError("");
    setResult(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch (e) {
      setFile(null);
      setError(pdfErrorMessage(e));
    }
  }

  async function rotate() {
    if (!file || pageCount === null) return;
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const targets =
        scope === "all"
          ? Array.from({ length: pageCount }, (_, i) => i + 1)
          : parsePageRanges(pagesInput, pageCount);
      const delta = parseInt(angle, 10);
      for (const pageNum of targets) {
        const page = doc.getPage(pageNum - 1);
        const current = page.getRotation().angle;
        page.setRotation(degrees(((current + delta) % 360 + 360) % 360));
      }
      const bytes = await doc.save({ useObjectStreams: true });
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      setResult({ rotated: targets.length, size: blob.size });
      downloadBlob(blob, `${baseName(file.name)}-rotated.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      title="Rotate PDF"
      description="Rotate every page or just the pages you pick by 90°, 180° or 270° — entirely in your browser."
      categoryHref="/tools/pdf"
      categoryName="PDF Tools"
    >
      <Card>
        <FileDropzone
          accept="application/pdf"
          onFiles={onFiles}
          label="Drag & drop a PDF here, or click to browse"
        />

        {file && pageCount !== null && (
          <>
            <p style={{ fontSize: ".9rem", marginBottom: "1rem", color: "var(--muted)" }}>
              <strong style={{ color: "var(--text)" }}>{file.name}</strong> — {pageCount} page{pageCount === 1 ? "" : "s"}, {formatBytes(file.size)}
            </p>

            <TabGroup
              options={[
                { value: "all", label: "All pages" },
                { value: "some", label: "Selected pages" },
              ]}
              value={scope}
              onChange={setScope}
            />

            {scope === "some" && (
              <Field label={`Pages to rotate (1–${pageCount}, e.g. 1,3,5-7)`}>
                <TextInput value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} placeholder="1,3,5-7" />
              </Field>
            )}

            <Field label="Rotation">
              <SelectInput value={angle} onChange={(e) => setAngle(e.target.value)}>
                <option value="90">90° clockwise</option>
                <option value="180">180°</option>
                <option value="270">270° clockwise (90° counter-clockwise)</option>
              </SelectInput>
            </Field>

            <button type="button" className="btn-primary" onClick={rotate} disabled={busy}>
              {busy ? "Rotating…" : "Rotate & Download"}
            </button>
          </>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: "1rem", fontSize: ".9rem" }}>{error}</p>}

        {result && (
          <ResultBox>
            <ResultRow label="Pages rotated" value={result.rotated} />
            <ResultRow label="Output size" value={formatBytes(result.size)} />
          </ResultBox>
        )}
      </Card>
    </ToolPageLayout>
  );
}
