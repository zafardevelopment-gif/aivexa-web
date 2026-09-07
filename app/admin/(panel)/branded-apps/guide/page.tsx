import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export const metadata = { title: "Publishing Guide — Branded Apps | AIVEXA Admin" };

const S = {
  h2: { fontSize: "1.15rem", fontWeight: 700, margin: "2.2rem 0 .5rem", color: "var(--text)" } as const,
  ol: { paddingLeft: "1.25rem", lineHeight: 1.7 } as const,
  fig: { border: "1px solid var(--border)", borderRadius: 10, padding: ".6rem", margin: "1rem 0", background: "var(--panel, #fff)" } as const,
  cap: { fontSize: ".78rem", color: "var(--muted)", paddingTop: ".45rem" } as const,
  code: { fontFamily: "monospace", fontSize: ".85em", background: "rgba(0,0,0,.06)", padding: ".08em .35em", borderRadius: 5 } as const,
  note: { background: "#fbf3e2", border: "1px solid #e3ce9c", borderRadius: 9, padding: ".7rem 1rem", fontSize: ".9rem", margin: "1rem 0" } as const,
};

export default function BrandedAppsGuidePage() {
  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.2rem" }}>
        <Link href="/admin/branded-apps" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".84rem", color: "var(--muted)", textDecoration: "none", border: "1px solid var(--border)", borderRadius: 9, padding: ".4rem .8rem" }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="admin-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <BookOpen size={20} /> App Publishing Guide
        </h1>
      </div>
      <p style={{ color: "var(--muted)" }}>
        Follow these 7 steps whenever you publish a new app. The backend setup (database, storage,
        Google service account, Play Console access) is already complete — it never needs to be repeated.
      </p>

      <h2 style={S.h2}>1 · Build the AAB</h2>
      <p>Set a unique package name in <code style={S.code}>android/app/build.gradle</code> → <code style={S.code}>applicationId</code> (pattern <code style={S.code}>com.aivexallp.&lt;appname&gt;</code>), then run <code style={S.code}>flutter build appbundle --release</code>. Output: <code style={S.code}>build/app/outputs/bundle/release/app-release.aab</code>.</p>

      <h2 style={S.h2}>2 · Put the privacy policy live</h2>
      <ol style={S.ol}>
        <li>Copy <code style={S.code}>app/(site)/sakinah/privacy-policy/page.tsx</code> to <code style={S.code}>app/(site)/&lt;appname&gt;/privacy-policy/</code></li>
        <li>Edit app name, package, permissions and contact email, then commit &amp; push</li>
        <li>URL goes live at <code style={S.code}>aivexallp.com/&lt;appname&gt;/privacy-policy</code></li>
      </ol>

      <h2 style={S.h2}>3 · Fill the wizard (up to draft)</h2>
      <ol style={S.ol}>
        <li><b>Identity</b> — Tenant, App Display Name, exact Package Name (wait for “✓ Valid package name”)</li>
        <li><b>Branding</b> — brand colors + default language (live preview updates)</li>
        <li><b>Store Listing</b> — short description (≤80 chars), full description, category, content rating</li>
        <li><b>Distribution</b> — start on the <b>Internal</b> track (no Google review, up to 100 testers)</li>
        <li><b>Contact &amp; Legal</b> — developer email, website, privacy policy URL from step 2</li>
        <li><b>Review</b> — then <b>Save Draft</b> (continue later) or <b>✓ Create App</b></li>
      </ol>
      <p><b>Save Draft</b> works on every step — progress is never lost. Watch the recorded demo:</p>
      <figure style={S.fig}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/guides/new-app-draft-process-demo.gif" alt="Recorded demo — wizard from start to saved draft" style={{ maxWidth: "100%", borderRadius: 6 }} />
        <figcaption style={S.cap}>Recorded demo: the full wizard from start to a saved draft (Sakinah New).</figcaption>
      </figure>
      <figure style={S.fig}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/guides/wizard_done.jpg" alt="App detail page after Create App" style={{ maxWidth: "100%", borderRadius: 6 }} />
        <figcaption style={S.cap}>After Create App — the app detail page.</figcaption>
      </figure>

      <h2 style={S.h2}>4 · Upload the AAB</h2>
      <p>App detail page → <b>Upload AAB</b> → pick the file from step 1. Large files (60&nbsp;MB+) are fine. Wait for “AAB uploaded successfully” — the button changes to <b>Replace AAB</b>.</p>
      <figure style={S.fig}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/guides/aab_uploaded.jpg" alt="AAB uploaded successfully" style={{ maxWidth: "100%", borderRadius: 6 }} />
        <figcaption style={S.cap}>Upload complete.</figcaption>
      </figure>

      <h2 style={S.h2}>5 · Create the app shell in Play Console (one-time per app)</h2>
      <p>Google’s API cannot create new apps, so this one step is manual: Play Console → <b>Create app</b> → same app name and the <b>exact same package name</b> → App · Free · both declarations → Create. Complete the App content items (IARC, data safety, accessibility, screenshots) using the answer sheet kept in the SAKINAH store-assets folder, and accept Play App Signing on the first upload.</p>
      <figure style={S.fig}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/guides/play_list.jpg" alt="Play Console list with the new app in Draft" style={{ maxWidth: "100%", borderRadius: 6 }} />
        <figcaption style={S.cap}>Play Console — the new app appears with “Draft” status.</figcaption>
      </figure>

      <h2 style={S.h2}>6 · Publish Now</h2>
      <p>Back on the app detail page, click <b>Publish Now</b>. The pipeline runs automatically (validate → download AAB → create edit → upload bundle → listing → track → commit) and every step is logged in the Publishing Jobs panel. Success shows “Submitted to Google Play (version code X)”.</p>

      <h2 style={S.h2}>7 · Future updates</h2>
      <p>Bump the version in <code style={S.code}>pubspec.yaml</code> (the <code style={S.code}>+N</code> build number must increase), build a new AAB, then <b>Replace AAB</b> → <b>Publish Now</b>.</p>

      <div style={S.note}>
        <b>If something fails:</b> check the Publishing Jobs step log first (details are kept server-side).
        A 401/403 right after a settings change usually resolves in 5–10 minutes. “Package not found”
        means step 5 wasn’t completed or the package name doesn’t match exactly. After any environment
        variable change on Vercel, always redeploy.
      </div>
    </div>
  );
}
