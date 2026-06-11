"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { adminDelete, adminList, adminSave } from "@/app/admin/actions";

export interface ColumnDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "lines"; // "lines" = jsonb string[] edited one-per-line
  readOnlyOnEdit?: boolean; // e.g. primary keys like slug/setting_key
  hint?: string;
}

type Row = Record<string, unknown>;

function toInput(value: unknown, type: ColumnDef["type"]): string {
  if (type === "lines") return Array.isArray(value) ? value.join("\n") : "";
  if (value === null || value === undefined) return "";
  return String(value);
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
      next[index] = { ...next[index], [key]: fromInput(value, type) };
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
        col.type === "lines" ? [] : col.type === "number" ? 0 : col.type === "boolean" ? true : "";
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
                  className={`editor-field${col.type === "textarea" || col.type === "lines" ? " wide" : ""}`}
                >
                  <span>
                    {col.label}
                    {col.hint && <em> — {col.hint}</em>}
                  </span>
                  {col.type === "textarea" || col.type === "lines" ? (
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
