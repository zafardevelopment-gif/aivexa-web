"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Save, Trash2, Upload, X } from "lucide-react";
import { adminDelete, adminList, adminSave } from "@/app/admin/actions";

export interface ColumnDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "lines" | "image" | "images";
  // "lines"  = jsonb string[] edited one-per-line
  // "image"  = single image file upload → Supabase Storage, stores public URL
  // "images" = multiple image file upload → Supabase Storage, stores URL[]
  readOnlyOnEdit?: boolean; // e.g. primary keys like slug/setting_key
  hint?: string;
}

type Row = Record<string, unknown>;

// ── Image Upload Field ────────────────────────────────────────────────────────
function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(file: File) {
    setErr("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const json = await res.json();
      if (json.error) { setErr(json.error); }
      else { onChange(json.url); }
    } catch {
      setErr("Upload failed — check your connection.");
    }
    setUploading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {/* Preview */}
      {value && (
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            style={{
              width: "100%", maxWidth: "280px", height: "140px",
              objectFit: "cover", borderRadius: "8px",
              border: "1px solid var(--border)", display: "block",
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              position: "absolute", top: "4px", right: "4px",
              background: "#EF4444", color: "#fff", border: "none",
              borderRadius: "50%", width: "20px", height: "20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", padding: 0,
            }}
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Upload button */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          type="button"
          className="btn-secondary sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          style={{ gap: "5px" }}
        >
          <Upload size={13} strokeWidth={2.2} />
          {uploading ? "Uploading…" : "Upload Image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>JPG, PNG, WebP · max 5MB</span>
      </div>

      {/* Manual URL input */}
      <input
        type="text"
        value={value}
        placeholder="Or paste image URL directly"
        onChange={(e) => onChange(e.target.value)}
        style={{ fontSize: "12px" }}
      />
      {err && <span style={{ color: "#EF4444", fontSize: "11px" }}>{err}</span>}
    </div>
  );
}

// ── Multi Image Upload Field ──────────────────────────────────────────────────
function MultiImageUploadField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFiles(files: FileList) {
    setErr("");
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
        const json = await res.json();
        if (json.error) setErr(json.error);
        else newUrls.push(json.url);
      } catch {
        setErr("Upload failed — check your connection.");
      }
    }
    if (newUrls.length) onChange([...value, ...newUrls]);
    setUploading(false);
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...value];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Thumbnails grid */}
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {value.map((url, idx) => (
            <div key={idx} style={{ position: "relative", width: "100px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`img-${idx}`}
                style={{
                  width: "100px", height: "70px", objectFit: "cover",
                  borderRadius: "6px", border: "1px solid var(--border)", display: "block",
                }}
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
              />
              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(idx)}
                title="Remove"
                style={{
                  position: "absolute", top: "2px", right: "2px",
                  background: "#EF4444", color: "#fff", border: "none",
                  borderRadius: "50%", width: "18px", height: "18px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", padding: 0,
                }}
              >
                <X size={10} strokeWidth={2.5} />
              </button>
              {/* Order buttons */}
              <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginTop: "3px" }}>
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}
                  style={{ fontSize: "10px", padding: "0 5px", cursor: "pointer", borderRadius: "3px", border: "1px solid var(--border)", background: "var(--surface)", lineHeight: "16px" }}>←</button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === value.length - 1}
                  style={{ fontSize: "10px", padding: "0 5px", cursor: "pointer", borderRadius: "3px", border: "1px solid var(--border)", background: "var(--surface)", lineHeight: "16px" }}>→</button>
              </div>
              {idx === 0 && (
                <div style={{ textAlign: "center", fontSize: "9px", color: "var(--text-muted)", marginTop: "2px" }}>Main</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          type="button"
          className="btn-secondary sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          style={{ gap: "5px" }}
        >
          <Upload size={13} strokeWidth={2.2} />
          {uploading ? "Uploading…" : `Add Images ${value.length > 0 ? `(${value.length})` : ""}`}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }}
        />
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>JPG, PNG, WebP · select multiple · drag to reorder</span>
      </div>

      {/* Manual URL input */}
      <input
        type="text"
        placeholder="Or paste image URL and press Enter to add"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const val = (e.target as HTMLInputElement).value.trim();
            if (val) { onChange([...value, val]); (e.target as HTMLInputElement).value = ""; }
            e.preventDefault();
          }
        }}
        style={{ fontSize: "12px" }}
      />
      {err && <span style={{ color: "#EF4444", fontSize: "11px" }}>{err}</span>}
    </div>
  );
}

function toInput(value: unknown, type: ColumnDef["type"]): string {
  if (type === "lines") return Array.isArray(value) ? value.join("\n") : "";
  if (value === null || value === undefined) return "";
  return String(value);
}

function toImages(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string");
  if (typeof value === "string" && value.startsWith("[")) {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

function fromInput(value: string, type: ColumnDef["type"]): unknown {
  if (type === "lines")
    return value.split("\n").map((s) => s.trim()).filter(Boolean);
  if (type === "number") return Number(value) || 0;
  return value;
}

/**
 * Minimal CRUD editor for one aivexa_ table. All reads/writes go
 * through server actions (service-role, cookie-guarded). New rows
 * have no pk value and are inserted; existing rows update by pk.
 */
export default function TableEditor({
  table,
  pk = "id",
  orderBy,
  columns,
  allowAdd = true,
  allowDelete = true,
  title,
}: {
  table: string;
  pk?: string;
  orderBy?: string;
  columns: ColumnDef[];
  allowAdd?: boolean;
  allowDelete?: boolean;
  title?: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await adminList(table, orderBy ?? pk);
    if (error) setError(error);
    else setRows(data);
    setLoading(false);
  }, [table, orderBy, pk]);

  useEffect(() => {
    load();
  }, [load]);

  function setField(index: number, key: string, value: string, type: ColumnDef["type"]) {
    setRows((prev) => {
      const next = [...prev];
      // For "image" type, value is already the final URL string — no conversion needed
      next[index] = { ...next[index], [key]: type === "image" ? value : fromInput(value, type) };
      return next;
    });
  }

  function setImages(index: number, key: string, urls: string[]) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: urls };
      return next;
    });
  }

  function setBool(index: number, key: string, value: boolean) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  }

  async function saveRow(index: number) {
    setBusy(true);
    setError("");
    setNotice("");
    const row = rows[index];
    const payload: Row = {};
    for (const col of columns) payload[col.key] = row[col.key] ?? fromInput("", col.type);
    const pkValue = row[pk];
    const isNew = pkValue === undefined || pkValue === null || pkValue === "";

    const { error } = await adminSave(
      table,
      pk,
      payload,
      isNew ? null : (pkValue as string | number)
    );
    if (error) setError(error);
    else {
      setNotice("Saved ✓");
      await load();
    }
    setBusy(false);
  }

  async function deleteRow(index: number) {
    const row = rows[index];
    const pkValue = row[pk];
    if (pkValue === undefined || pkValue === null || pkValue === "") {
      setRows((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    if (!window.confirm("Delete this row?")) return;
    setBusy(true);
    setError("");
    const { error } = await adminDelete(table, pk, pkValue as string | number);
    if (error) setError(error);
    else await load();
    setBusy(false);
  }

  function addRow() {
    const blank: Row = {};
    for (const col of columns)
      blank[col.key] =
        col.type === "lines" || col.type === "images" ? [] : col.type === "number" ? 0 : col.type === "boolean" ? true : "";
    setRows((prev) => [...prev, blank]);
  }

  if (loading) return <p className="admin-muted">Loading {table}…</p>;

  return (
    <section className="editor-block">
      {title && <h2 className="editor-title">{title}</h2>}
      {error && <div className="form-alert err">{error}</div>}
      {notice && <div className="form-alert ok">{notice}</div>}
      {rows.map((row, i) => {
        const isNew = row[pk] === undefined || row[pk] === null || row[pk] === "";
        return (
          <div className="editor-row" key={`${String(row[pk] ?? "new")}-${i}`}>
            <div className="editor-fields">
              {columns.map((col) => (
                <label
                  key={col.key}
                  className={`editor-field${
                    col.type === "textarea" || col.type === "lines" || col.type === "image" || col.type === "images"
                      ? " wide"
                      : ""
                  }`}
                >
                  <span>
                    {col.label}
                    {col.hint && <em> — {col.hint}</em>}
                  </span>
                  {col.type === "images" ? (
                    <MultiImageUploadField
                      value={toImages(row[col.key])}
                      onChange={(urls) => setImages(i, col.key, urls)}
                    />
                  ) : col.type === "image" ? (
                    <ImageUploadField
                      value={toInput(row[col.key], col.type)}
                      onChange={(url) => setField(i, col.key, url, col.type)}
                    />
                  ) : col.type === "textarea" || col.type === "lines" ? (
                    <textarea
                      value={toInput(row[col.key], col.type)}
                      rows={col.type === "lines" ? 4 : 6}
                      onChange={(e) => setField(i, col.key, e.target.value, col.type)}
                    />
                  ) : col.type === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(row[col.key])}
                      onChange={(e) => setBool(i, col.key, e.target.checked)}
                    />
                  ) : (
                    <input
                      type={col.type === "number" ? "number" : "text"}
                      value={toInput(row[col.key], col.type)}
                      readOnly={col.readOnlyOnEdit && !isNew}
                      onChange={(e) => setField(i, col.key, e.target.value, col.type)}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="editor-actions">
              <button className="btn-primary sm" onClick={() => saveRow(i)} disabled={busy}>
                <Save size={14} strokeWidth={2.2} /> Save
              </button>
              {allowDelete && (
                <button className="btn-danger sm" onClick={() => deleteRow(i)} disabled={busy}>
                  <Trash2 size={14} strokeWidth={2.2} /> Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
      {allowAdd && (
        <button className="btn-secondary sm" onClick={addRow}>
          <Plus size={15} strokeWidth={2.2} /> Add new
        </button>
      )}
    </section>
  );
}
