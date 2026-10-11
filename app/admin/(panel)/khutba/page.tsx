"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteKhutba, listKhutbas, saveKhutba, type Khutba } from "@/app/admin/khutba-actions";

// Admin › Miftah Khutba — add each Friday's Juma khutba from Masjid al-Haram
// (Makkah) and Masjid an-Nabawi (Madinah). The Miftah app shows it in
// Books › Juma Khutba and on the Home screen on Fridays.

const LANGS: [string, string][] = [
  ["en", "English"],
  ["hi", "Hindi"],
  ["ur", "Urdu"],
  ["bn", "Bangla"],
  ["ml", "Malayalam"],
  ["id", "Indonesian"],
];

const input: React.CSSProperties = {
  padding: ".55rem .7rem",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: ".9rem",
  width: "100%",
  background: "#fff",
};
const area: React.CSSProperties = { ...input, minHeight: 160, fontFamily: "inherit", lineHeight: 1.5 };
const btn: React.CSSProperties = {
  padding: ".6rem 1.1rem",
  borderRadius: 10,
  border: "none",
  background: "var(--indigo)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
const label: React.CSSProperties = { fontSize: ".78rem", display: "block" };

/** Most recent Friday (today if Friday), YYYY-MM-DD. */
function lastFriday(): string {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 2) % 7));
  return d.toISOString().slice(0, 10);
}

const empty = (): Khutba => ({
  masjid: "makkah",
  date: lastFriday(),
  hijri: "",
  khateeb: "",
  khateeb_ar: "",
  title: {},
  arabic: "",
  translations: {},
  source_url: "",
  published: true,
});

export default function KhutbaAdminPage() {
  const [rows, setRows] = useState<Khutba[]>([]);
  const [error, setError] = useState("");
  const [f, setF] = useState<Khutba>(empty());
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const r = await listKhutbas();
    setRows(r.rows);
    setError(r.error);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const set = (p: Partial<Khutba>) => setF((o) => ({ ...o, ...p }));

  return (
    <>
      <h1 className="admin-title">Miftah — Juma Khutba</h1>
      <p className="admin-muted" style={{ marginBottom: "1rem" }}>
        Add each Friday&apos;s khutba from Makkah and Madinah. Paste the Arabic text and the translations you have; the app
        shows the user&apos;s language, or English if that language is missing. Use only text you have the right to publish
        (e.g. the official Haramain sources) and put the source link below.
      </p>
      {error && <div className="form-alert err">{error}</div>}

      <div className="admin-card" style={{ padding: "1.1rem 1.2rem", marginBottom: "1.6rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: ".8rem" }}>
          {f.id ? "Edit khutba" : "Add khutba"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "150px 170px 1fr", gap: ".7rem", marginBottom: ".7rem" }}>
          <label style={label}>
            Masjid
            <select style={input} value={f.masjid} onChange={(e) => set({ masjid: e.target.value as Khutba["masjid"] })}>
              <option value="makkah">Makkah — Masjid al-Haram</option>
              <option value="madinah">Madinah — Masjid an-Nabawi</option>
            </select>
          </label>
          <label style={label}>
            Friday date
            <input style={input} type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} />
          </label>
          <label style={label}>
            Hijri date (optional)
            <input style={input} value={f.hijri} onChange={(e) => set({ hijri: e.target.value })} placeholder="15 Rabi al-Akhir 1448" />
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem", marginBottom: ".7rem" }}>
          <label style={label}>
            Khateeb (Latin)
            <input style={input} value={f.khateeb} onChange={(e) => set({ khateeb: e.target.value })} placeholder="Sheikh Abdul Rahman As-Sudais" />
          </label>
          <label style={label}>
            Khateeb (Arabic)
            <input style={input} dir="rtl" value={f.khateeb_ar} onChange={(e) => set({ khateeb_ar: e.target.value })} />
          </label>
          <label style={label}>
            Title (Arabic, optional)
            <input style={input} dir="rtl" value={f.title.ar ?? ""} onChange={(e) => set({ title: { ...f.title, ar: e.target.value } })} />
          </label>
          <label style={label}>
            Title (English, optional)
            <input style={input} value={f.title.en ?? ""} onChange={(e) => set({ title: { ...f.title, en: e.target.value } })} />
          </label>
        </div>
        <label style={{ ...label, marginBottom: ".7rem" }}>
          Arabic text *
          <textarea style={{ ...area, minHeight: 220 }} dir="rtl" value={f.arabic} onChange={(e) => set({ arabic: e.target.value })} />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem", marginBottom: ".7rem" }}>
          {LANGS.map(([code, name]) => (
            <label key={code} style={label}>
              Translation — {name}
              <textarea
                style={area}
                dir={code === "ur" ? "rtl" : "ltr"}
                value={f.translations[code] ?? ""}
                onChange={(e) => set({ translations: { ...f.translations, [code]: e.target.value } })}
              />
            </label>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: ".7rem", alignItems: "end" }}>
          <label style={label}>
            Source link
            <input style={input} value={f.source_url} onChange={(e) => set({ source_url: e.target.value })} placeholder="https://…" />
          </label>
          <label style={{ ...label, display: "flex", gap: 6, alignItems: "center", paddingBottom: ".6rem" }}>
            <input type="checkbox" checked={f.published} onChange={(e) => set({ published: e.target.checked })} />
            Published
          </label>
          {f.id && (
            <button style={{ ...btn, background: "#fff", color: "var(--text)", border: "1px solid var(--border)" }} onClick={() => setF(empty())}>
              Cancel
            </button>
          )}
          <button
            style={{ ...btn, opacity: busy ? 0.6 : 1 }}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const err = await saveKhutba(f);
              setBusy(false);
              setMsg(err || "Saved ✓");
              if (!err) {
                setF(empty());
                load();
              }
            }}
          >
            Save
          </button>
        </div>
        {msg && <div style={{ marginTop: ".6rem", fontSize: ".85rem" }}>{msg}</div>}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Masjid</th>
            <th>Khateeb</th>
            <th>Translations</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.masjid === "makkah" ? "Makkah" : "Madinah"}</td>
              <td>{r.khateeb}</td>
              <td>{Object.keys(r.translations || {}).join(", ") || "—"}</td>
              <td>{r.published ? "Published" : "Draft"}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button
                  style={{ ...btn, padding: ".3rem .7rem", fontSize: ".8rem" }}
                  onClick={() => {
                    setF({
                      ...empty(),
                      ...r,
                      hijri: r.hijri ?? "",
                      khateeb_ar: r.khateeb_ar ?? "",
                      source_url: r.source_url ?? "",
                      title: r.title ?? {},
                      translations: r.translations ?? {},
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Edit
                </button>{" "}
                <button
                  style={{ ...btn, padding: ".3rem .7rem", fontSize: ".8rem", background: "#c0392b" }}
                  onClick={async () => {
                    if (!r.id || !confirm(`Delete the ${r.masjid} khutba of ${r.date}?`)) return;
                    const err = await deleteKhutba(r.id);
                    setMsg(err || "Deleted");
                    load();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && !error && (
            <tr>
              <td colSpan={6} className="admin-muted">
                No khutbas yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
