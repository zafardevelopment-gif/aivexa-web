"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrandedApp } from "../actions";
import {
  ArrowLeft, ArrowRight, Check, Smartphone, Palette,
  FileText, Globe, ShieldCheck, Send, Loader2, Info
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Identity",    icon: Smartphone,  desc: "Tenant & package name" },
  { id: 2, label: "Branding",    icon: Palette,     desc: "Colors & icons" },
  { id: 3, label: "Store Listing", icon: FileText,  desc: "Description & category" },
  { id: 4, label: "Distribution", icon: Globe,      desc: "Track & countries" },
  { id: 5, label: "Contact",     icon: ShieldCheck, desc: "Support & legal" },
  { id: 6, label: "Review",      icon: Send,        desc: "Confirm & create" },
];

const CATEGORIES = [
  "PRODUCTIVITY","BUSINESS","EDUCATION","FINANCE","HEALTH_AND_FITNESS",
  "LIFESTYLE","ENTERTAINMENT","TOOLS","COMMUNICATION","SHOPPING",
  "SOCIAL","TRAVEL_AND_LOCAL","NEWS_AND_MAGAZINES","BOOKS_AND_REFERENCE","ART_AND_DESIGN",
];

const TRACKS = ["internal", "alpha", "beta", "production"];
const LANGUAGES = ["en-US","hi-IN","ar","fr-FR","de-DE","es-ES","pt-BR","zh-CN","ja-JP","ko-KR"];

type FormState = {
  tenant_name: string;
  package_name: string;
  app_display_name: string;
  primary_color: string;
  secondary_color: string;
  short_description: string;
  full_description: string;
  category: string;
  content_rating: string;
  default_language: string;
  release_track: string;
  website_url: string;
  email: string;
  phone: string;
  privacy_policy_url: string;
};

const DEFAULT: FormState = {
  tenant_name: "",
  package_name: "",
  app_display_name: "",
  primary_color: "#4f46e5",
  secondary_color: "#10b981",
  short_description: "",
  full_description: "",
  category: "PRODUCTIVITY",
  content_rating: "EVERYONE",
  default_language: "en-US",
  release_track: "internal",
  website_url: "",
  email: "",
  phone: "",
  privacy_policy_url: "",
};

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: ".76rem", color: "var(--muted-2)", marginTop: ".3rem" }}>{hint}</p>}
    </div>
  );
}

function Input({ name, value, onChange, placeholder, maxLength, type = "text" }: {
  name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; type?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        name={name} type={type} value={value} placeholder={placeholder}
        maxLength={maxLength}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: "#fff", border: "1px solid var(--border-2)", borderRadius: 10, padding: ".72rem 1rem", color: "var(--text)", fontFamily: "inherit", fontSize: ".9rem", outline: "none" }}
        onFocus={e => e.target.style.borderColor = "var(--indigo)"}
        onBlur={e => e.target.style.borderColor = "var(--border-2)"}
      />
      {maxLength && (
        <span style={{ position: "absolute", right: 10, bottom: 10, fontSize: ".7rem", color: "var(--muted-2)" }}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function Textarea({ name, value, onChange, placeholder, maxLength, rows = 4 }: {
  name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; rows?: number;
}) {
  return (
    <div style={{ position: "relative" }}>
      <textarea
        name={name} value={value} placeholder={placeholder}
        maxLength={maxLength} rows={rows}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: "#fff", border: "1px solid var(--border-2)", borderRadius: 10, padding: ".72rem 1rem", color: "var(--text)", fontFamily: "inherit", fontSize: ".9rem", outline: "none", resize: "vertical" }}
        onFocus={e => e.target.style.borderColor = "var(--indigo)"}
        onBlur={e => e.target.style.borderColor = "var(--border-2)"}
      />
      {maxLength && (
        <span style={{ position: "absolute", right: 10, bottom: 10, fontSize: ".7rem", color: "var(--muted-2)" }}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function Select({ name, value, onChange, options }: {
  name: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      name={name} value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: "#fff", border: "1px solid var(--border-2)", borderRadius: 10, padding: ".72rem 1rem", color: "var(--text)", fontFamily: "inherit", fontSize: ".9rem", outline: "none", cursor: "pointer" }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 10, padding: ".8rem 1rem", display: "flex", gap: 8, fontSize: ".82rem", color: "#92400e", lineHeight: 1.6 }}>
      <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} /> <span>{children}</span>
    </div>
  );
}

export default function NewBrandedAppPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (key: keyof FormState) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const validate = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.tenant_name.trim()) e.tenant_name = "Required";
      if (!form.app_display_name.trim()) e.app_display_name = "Required";
      if (!form.package_name.trim()) e.package_name = "Required";
      else if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){2,}$/.test(form.package_name))
        e.package_name = "Must be like com.company.appname (lowercase, 3+ segments)";
    }
    if (s === 3) {
      if (!form.short_description.trim()) e.short_description = "Required";
      if (!form.full_description.trim()) e.full_description = "Required";
    }
    if (s === 5) {
      if (!form.email.trim()) e.email = "Required";
      if (!form.privacy_policy_url.trim()) e.privacy_policy_url = "Required";
      else if (!form.privacy_policy_url.startsWith("http")) e.privacy_policy_url = "Must be a full URL (https://...)";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => Math.min(s + 1, 6));
  };

  const back = () => { setErrors({}); setStep(s => Math.max(s - 1, 1)); };
  const saveDraft = async () => {
    setSavingDraft(true);
    setDraftSaved(false);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    fd.set("status", "draft");
    const { error } = await createBrandedApp(fd);
    setSavingDraft(false);
    if (!error) { setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000); }
    else { setSubmitError(error); }
  };


  const handleSubmit = async () => {
    const allErrors = { ...validate(1), ...validate(3), ...validate(5) };
    if (Object.keys(allErrors).length) { setErrors(allErrors); setStep(1); return; }

    setSubmitting(true);
    setSubmitError(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    const { id, error } = await createBrandedApp(fd);
    setSubmitting(false);

    if (error) { setSubmitError(error); return; }
    router.push(`/admin/branded-apps/${id}`);
  };

  const inputStyle = { marginBottom: ".85rem" };

  return (
    <div>
      <style>{`
        .field { margin-bottom: .95rem; }
        .field label { display: block; font-size: .8rem; font-weight: 600; color: var(--text); margin-bottom: .35rem; }
        .field-error { color: #b91c1c; font-size: .76rem; margin-top: .25rem; }
        .step-bar { display: flex; gap: 0; margin-bottom: 2rem; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; background: #fff; }
        .step-item { flex: 1; padding: .65rem .5rem; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: .72rem; font-weight: 600; color: var(--muted-2); border-right: 1px solid var(--border); cursor: pointer; transition: all .15s; text-align: center; }
        .step-item:last-child { border-right: none; }
        .step-item.active { background: var(--indigo-light); color: var(--indigo); }
        .step-item.done { background: #ecfdf5; color: #047857; }
        .step-item .step-num { width: 22px; height: 22px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: .7rem; }
        .wizard-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 2rem; }
        .wizard-footer { display: flex; justify-content: space-between; margin-top: 1.8rem; padding-top: 1.2rem; border-top: 1px solid var(--border); }
        .color-row { display: flex; gap: 1rem; }
        .color-field { flex: 1; }
        .color-preview { display: flex; align-items: center; gap: 10px; padding: .55rem 1rem; border: 1px solid var(--border-2); border-radius: 10px; background: #fff; }
        .color-preview input[type=color] { width: 32px; height: 32px; border: none; background: none; cursor: pointer; padding: 0; border-radius: 6px; }
        .review-row { display: flex; justify-content: space-between; padding: .6rem 0; border-bottom: 1px solid var(--border); font-size: .88rem; }
        .review-row:last-child { border-bottom: none; }
        .review-label { color: var(--muted-2); font-weight: 500; }
        .review-val { color: var(--text); font-weight: 600; max-width: 60%; text-align: right; word-break: break-all; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
        <button onClick={() => router.push("/admin/branded-apps")} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 9, padding: ".4rem .8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: ".84rem", color: "var(--muted)" }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 className="admin-title" style={{ margin: 0 }}>New Branded App</h1>
      </div>

      {/* Step bar */}
      <div className="step-bar">
        {STEPS.map(s => (
          <div key={s.id} className={`step-item ${step === s.id ? "active" : step > s.id ? "done" : ""}`} onClick={() => step > s.id && setStep(s.id)}>
            <div className="step-num">{step > s.id ? <Check size={12} /> : s.id}</div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="wizard-card">
        {/* Step 1 — Identity */}
        {step === 1 && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: ".3rem" }}>App Identity</h2>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.5rem" }}>Basic details that identify this branded app.</p>

            <Field label="Tenant / Client Name" required hint="Internal label — who this app belongs to.">
              <Input name="tenant_name" value={form.tenant_name} onChange={set("tenant_name")} placeholder="Acme Corp" />
              {errors.tenant_name && <p className="field-error">{errors.tenant_name}</p>}
            </Field>

            <Field label="App Display Name" required hint="What users see on their device. Max 50 characters.">
              <Input name="app_display_name" value={form.app_display_name} onChange={set("app_display_name")} placeholder="Acme App" maxLength={50} />
              {errors.app_display_name && <p className="field-error">{errors.app_display_name}</p>}
            </Field>

            <Field label="Package Name" required hint="Unique ID — cannot be changed after first publish. Use lowercase, 3+ dot-separated segments.">
              <Input name="package_name" value={form.package_name} onChange={v => set("package_name")(v.toLowerCase().replace(/[^a-z0-9._]/g, ""))} placeholder="com.acme.myapp" />
              {errors.package_name && <p className="field-error">{errors.package_name}</p>}
              {form.package_name && !errors.package_name && /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){2,}$/.test(form.package_name) && (
                <p style={{ fontSize: ".76rem", color: "#047857", marginTop: ".25rem" }}>✓ Valid package name</p>
              )}
            </Field>

            <InfoBox>
              The package name is permanent once the app is published to Google Play. Choose carefully — it cannot be changed later without creating an entirely new app listing.
            </InfoBox>
          </div>
        )}

        {/* Step 2 — Branding */}
        {step === 2 && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: ".3rem" }}>Branding</h2>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.5rem" }}>Colors and default language for the app.</p>

            <div className="color-row">
              <div className="color-field">
                <Field label="Primary Color">
                  <div className="color-preview">
                    <input type="color" value={form.primary_color} onChange={e => set("primary_color")(e.target.value)} />
                    <span style={{ fontFamily: "monospace", fontSize: ".88rem", color: "var(--muted)" }}>{form.primary_color}</span>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: form.primary_color, marginLeft: "auto", border: "1px solid rgba(0,0,0,.1)" }} />
                  </div>
                </Field>
              </div>
              <div className="color-field">
                <Field label="Secondary Color">
                  <div className="color-preview">
                    <input type="color" value={form.secondary_color} onChange={e => set("secondary_color")(e.target.value)} />
                    <span style={{ fontFamily: "monospace", fontSize: ".88rem", color: "var(--muted)" }}>{form.secondary_color}</span>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: form.secondary_color, marginLeft: "auto", border: "1px solid rgba(0,0,0,.1)" }} />
                  </div>
                </Field>
              </div>
            </div>

            {/* Live color preview */}
            <div style={{ background: form.primary_color, borderRadius: 14, padding: "1.5rem", color: "#fff", display: "flex", alignItems: "center", gap: 16, marginBottom: "1.2rem" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: form.primary_color, fontSize: "1.2rem" }}>
                {form.app_display_name?.slice(0, 2).toUpperCase() || "AP"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>{form.app_display_name || "App Name"}</div>
                <div style={{ fontSize: ".78rem", opacity: .8, marginTop: 2 }}>{form.package_name || "com.example.app"}</div>
              </div>
              <div style={{ marginLeft: "auto", background: form.secondary_color, borderRadius: 20, padding: ".3rem .9rem", fontSize: ".78rem", fontWeight: 700 }}>
                GET
              </div>
            </div>

            <Field label="Default Language">
              <Select name="default_language" value={form.default_language} onChange={set("default_language")} options={LANGUAGES.map(l => ({ value: l, label: l }))} />
            </Field>

            <InfoBox>
              App icon and feature graphic uploads will be available after creating the app. You can upload them from the app detail page before publishing to Google Play.
            </InfoBox>
          </div>
        )}

        {/* Step 3 — Store Listing */}
        {step === 3 && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: ".3rem" }}>Store Listing</h2>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.5rem" }}>What users see on the Google Play Store page.</p>

            <Field label="Short Description" required hint="Max 80 characters — shown in search results.">
              <Input name="short_description" value={form.short_description} onChange={set("short_description")} placeholder="A powerful app for your business" maxLength={80} />
              {errors.short_description && <p className="field-error">{errors.short_description}</p>}
            </Field>

            <Field label="Full Description" required hint="Max 4000 characters — full store listing description.">
              <Textarea name="full_description" value={form.full_description} onChange={set("full_description")} placeholder="Describe your app in detail..." maxLength={4000} rows={6} />
              {errors.full_description && <p className="field-error">{errors.full_description}</p>}
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Category">
                <Select name="category" value={form.category} onChange={set("category")} options={CATEGORIES.map(c => ({ value: c, label: c.replace(/_/g, " ") }))} />
              </Field>
              <Field label="Content Rating">
                <Select name="content_rating" value={form.content_rating} onChange={set("content_rating")} options={[
                  { value: "EVERYONE", label: "Everyone (3+)" },
                  { value: "EVERYONE_10_PLUS", label: "Everyone 10+" },
                  { value: "TEEN", label: "Teen (13+)" },
                  { value: "MATURE_17_PLUS", label: "Mature (17+)" },
                ]} />
              </Field>
            </div>

            <InfoBox>
              The IARC content rating questionnaire must be completed manually in the Play Console. This setting is a reference only — the official rating is assigned by Google's review.
            </InfoBox>
          </div>
        )}

        {/* Step 4 — Distribution */}
        {step === 4 && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: ".3rem" }}>Distribution</h2>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.5rem" }}>Control who can access this app and on which track.</p>

            <Field label="Release Track" hint="Start with 'internal' for testing. Promote to production when ready.">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: ".6rem" }}>
                {TRACKS.map(t => (
                  <button key={t} type="button" onClick={() => set("release_track")(t)} style={{
                    padding: ".7rem .5rem", borderRadius: 10, border: `2px solid ${form.release_track === t ? "var(--indigo)" : "var(--border)"}`,
                    background: form.release_track === t ? "var(--indigo-light)" : "#fff",
                    color: form.release_track === t ? "var(--indigo)" : "var(--muted)",
                    fontWeight: 700, fontSize: ".82rem", cursor: "pointer", textTransform: "capitalize", transition: "all .15s",
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.2rem", fontSize: ".83rem", color: "var(--muted)", marginTop: ".5rem" }}>
              {form.release_track === "internal" && "🔒 Internal testing — only up to 100 internal testers. No review required."}
              {form.release_track === "alpha" && "🔬 Closed testing — invite specific testers. Requires brief review."}
              {form.release_track === "beta" && "🧪 Open testing — anyone can join. Requires review."}
              {form.release_track === "production" && "🌍 Production — available to all users worldwide. Full review required."}
            </div>

            <InfoBox>
              Country targeting is configured per-track in the Play Console. By default, your app will be available in all countries permitted under your developer account.
            </InfoBox>
          </div>
        )}

        {/* Step 5 — Contact & Legal */}
        {step === 5 && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: ".3rem" }}>Contact & Legal</h2>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.5rem" }}>Required by Google Play for all published apps.</p>

            <Field label="Developer Email" required hint="Public support email shown on the store listing.">
              <Input name="email" type="email" value={form.email} onChange={set("email")} placeholder="support@acme.com" />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </Field>

            <Field label="Website URL" hint="Your app or company website (shown on store page).">
              <Input name="website_url" value={form.website_url} onChange={set("website_url")} placeholder="https://acme.com" />
            </Field>

            <Field label="Phone Number" hint="Optional — support phone number.">
              <Input name="phone" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
            </Field>

            <Field label="Privacy Policy URL" required hint="Required by Google Play — must be publicly accessible.">
              <Input name="privacy_policy_url" value={form.privacy_policy_url} onChange={set("privacy_policy_url")} placeholder="https://acme.com/privacy" />
              {errors.privacy_policy_url && <p className="field-error">{errors.privacy_policy_url}</p>}
            </Field>

            <InfoBox>
              Google Play requires a valid, publicly accessible privacy policy for all apps. It must describe what user data your app collects and how it is used.
            </InfoBox>
          </div>
        )}

        {/* Step 6 — Review */}
        {step === 6 && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: ".3rem" }}>Review & Create</h2>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.5rem" }}>Confirm the details before creating the app record.</p>

            {submitError && <div className="form-alert err" style={{ marginBottom: "1rem" }}>{submitError}</div>}

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "1.2rem 1.5rem", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--muted-2)", marginBottom: ".8rem" }}>Identity</div>
              {[
                ["Tenant", form.tenant_name],
                ["App Name", form.app_display_name],
                ["Package", form.package_name],
              ].map(([l, v]) => (
                <div key={l} className="review-row"><span className="review-label">{l}</span><span className="review-val">{v}</span></div>
              ))}
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "1.2rem 1.5rem", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--muted-2)", marginBottom: ".8rem" }}>Store Listing</div>
              {[
                ["Category", form.category.replace(/_/g, " ")],
                ["Language", form.default_language],
                ["Track", form.release_track],
                ["Short Desc", form.short_description.slice(0, 60) + (form.short_description.length > 60 ? "…" : "")],
              ].map(([l, v]) => (
                <div key={l} className="review-row"><span className="review-label">{l}</span><span className="review-val">{v}</span></div>
              ))}
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "1.2rem 1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--muted-2)", marginBottom: ".8rem" }}>Colors</div>
              <div className="review-row">
                <span className="review-label">Primary</span>
                <span className="review-val" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, background: form.primary_color, border: "1px solid rgba(0,0,0,.1)" }} />
                  {form.primary_color}
                </span>
              </div>
              <div className="review-row">
                <span className="review-label">Secondary</span>
                <span className="review-val" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, background: form.secondary_color, border: "1px solid rgba(0,0,0,.1)" }} />
                  {form.secondary_color}
                </span>
              </div>
            </div>

            <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 12, padding: "1rem 1.2rem", fontSize: ".83rem", color: "#92400e", marginBottom: "1rem" }}>
              <strong>📋 After creating this app record, you still need to:</strong>
              <ol style={{ paddingLeft: "1.2rem", marginTop: ".5rem", lineHeight: 2 }}>
                <li>Manually create the app in Play Console (new app creation cannot be automated)</li>
                <li>Complete the IARC content rating questionnaire</li>
                <li>Accept Play App Signing enrollment</li>
                <li>Upload the app icon and feature graphic</li>
                <li>Complete the store listing in Play Console</li>
              </ol>
            </div>
          </div>
        )}

        <div className="wizard-footer">
          <button type="button" onClick={back} disabled={step === 1} className="btn-secondary" style={{ opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? "none" : "auto", fontSize: ".88rem", padding: ".6rem 1.2rem" }}>
            <ArrowLeft size={15} /> Back
          </button>

           <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
            <button type="button" onClick={saveDraft} disabled={savingDraft} className="btn-secondary" style={{ fontSize: ".88rem", padding: ".6rem 1.2rem", display: "flex", alignItems: "center", gap: ".35rem" }}>
              {savingDraft ? <><Loader2 size={14} className="spin" /> Saving…</> : draftSaved ? <><Check size={14} /> Saved!</> : <>Save Draft</>}
            </button>
            {step < 6 ? (
              <button type="button" onClick={next} className="btn-primary" style={{ fontSize: ".88rem", padding: ".6rem 1.4rem" }}>
                Next <ArrowRight size={15} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} className="btn-primary" disabled={submitting} style={{ fontSize: ".88rem", padding: ".6rem 1.4rem" }}>
                {submitting ? <><Loader2 size={15} className="spin" /> Creating…</> : <><Check size={15} /> Create App</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
