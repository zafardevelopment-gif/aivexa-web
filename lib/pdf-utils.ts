// Shared client-side helpers for the /tools/pdf/* pages.
// All heavy libraries are loaded via dynamic import so they only download
// when the user actually acts.

import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

export type { PDFDocumentProxy, PDFPageProxy };

/** Load pdfjs-dist and configure its worker (served from /public). */
export async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

/**
 * Open a PDF with pdfjs. Pass a copy of the bytes because pdfjs transfers
 * the buffer to its worker.
 */
export async function openPdfWithPdfJs(
  bytes: ArrayBuffer,
  password?: string
): Promise<PDFDocumentProxy> {
  const pdfjs = await loadPdfJs();
  return pdfjs.getDocument({
    data: new Uint8Array(bytes.slice(0)),
    password,
  }).promise;
}

/** Render a pdfjs page to a canvas at the given scale. */
export async function renderPageToCanvas(
  page: PDFPageProxy,
  scale: number
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  await page.render({ canvas, viewport }).promise;
  return canvas;
}

/**
 * Parse a 1-based page selection like "1,3,5-7" against a total page count.
 * Returns page numbers in the order given (duplicates removed).
 * Throws an Error with a human-readable message on invalid input.
 */
export function parsePageRanges(input: string, total: number): number[] {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Enter at least one page or range, e.g. 1,3,5-7");
  const out: number[] = [];
  const seen = new Set<number>();
  for (const part of trimmed.split(",")) {
    const token = part.trim();
    if (!token) continue;
    const m = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      let from = parseInt(m[1], 10);
      let to = parseInt(m[2], 10);
      if (from > to) [from, to] = [to, from];
      if (from < 1 || to > total) {
        throw new Error(`Range "${token}" is outside 1–${total}.`);
      }
      for (let p = from; p <= to; p++) {
        if (!seen.has(p)) {
          seen.add(p);
          out.push(p);
        }
      }
    } else if (/^\d+$/.test(token)) {
      const p = parseInt(token, 10);
      if (p < 1 || p > total) {
        throw new Error(`Page ${p} is outside 1–${total}.`);
      }
      if (!seen.has(p)) {
        seen.add(p);
        out.push(p);
      }
    } else {
      throw new Error(`Could not understand "${token}". Use e.g. 1,3,5-7`);
    }
  }
  if (out.length === 0) throw new Error("Enter at least one page or range.");
  return out;
}

/** Trigger a browser download for a blob and clean up the object URL. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Strip .pdf extension from a filename for building output names. */
export function baseName(name: string): string {
  return name.replace(/\.pdf$/i, "") || "document";
}

/** Turn an unknown thrown value into a friendly message for PDF loading. */
export function pdfErrorMessage(e: unknown): string {
  const msg =
    e instanceof Error ? e.message : typeof e === "string" ? e : String(e);
  if (/encrypt|password/i.test(msg)) {
    return "This PDF is password-protected. Use the Unlock PDF tool first (you need to know the password).";
  }
  if (/Invalid PDF|corrupt|structure|header/i.test(msg)) {
    return "This file does not look like a valid PDF, or it is corrupted.";
  }
  return `Could not process this PDF: ${msg}`;
}

/** Render every page of a PDF to a small JPEG thumbnail data URL. */
export async function renderThumbnails(
  bytes: ArrayBuffer,
  targetWidth = 140,
  onProgress?: (done: number, total: number) => void
): Promise<string[]> {
  const doc = await openPdfWithPdfJs(bytes);
  const thumbs: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const canvas = await renderPageToCanvas(page, targetWidth / base.width);
    thumbs.push(canvas.toDataURL("image/jpeg", 0.75));
    canvas.width = 0;
    canvas.height = 0;
    onProgress?.(i, doc.numPages);
  }
  await doc.cleanup();
  return thumbs;
}

/** Extract text lines from a pdfjs document, one string[] per page. */
export async function extractTextLines(doc: PDFDocumentProxy): Promise<string[][]> {
  const pages: string[][] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const lines: string[] = [];
    let current = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      current += item.str;
      if (item.hasEOL) {
        lines.push(current);
        current = "";
      }
    }
    if (current.trim().length > 0) lines.push(current);
    pages.push(lines);
  }
  return pages;
}
