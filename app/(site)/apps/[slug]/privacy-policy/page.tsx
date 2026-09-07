// Auto-generated privacy policy for branded apps.
// Content is rendered from the app's record in the admin panel —
// URL pattern: /apps/<last-package-segment>/privacy-policy
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 3600;

async function getApp(slug: string) {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data } = await db
    .from("branded_apps")
    .select("app_display_name, package_name, email, updated_at")
    .ilike("package_name", `%.${slug.toLowerCase()}`)
    .limit(1)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = await getApp(slug);
  return {
    title: app ? `Privacy Policy — ${app.app_display_name} | AIVEXA` : "Privacy Policy | AIVEXA",
    description: app
      ? `Privacy policy for ${app.app_display_name}, operated by AIVEXA LLP.`
      : "Privacy policy for an AIVEXA LLP application.",
  };
}

export default async function AutoPrivacyPolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = await getApp(slug);
  if (!app) notFound();

  const updated = new Date(app.updated_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="section-label" style={{ justifyContent: "center" }}>Legal</div>
          <h1 className="section-title">
            Privacy Policy for <span className="accent">{app.app_display_name}</span>
          </h1>
          <p className="legal-update">Last updated: {updated}</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>{app.app_display_name} Privacy Policy</span>
          </div>
        </div>
      </section>

      <section className="legal-page-content">
        <p>
          {app.app_display_name} (&ldquo;the app&rdquo;, package <code>{app.package_name}</code>) is
          operated by AIVEXA LLP and is built privacy-first. This page explains how the app handles
          your data.
        </p>

        <h3>1. Data we collect</h3>
        <p>
          The app does not require an account and does not collect personal information on our
          servers. Core app data — your settings, activity within the app, and any content you
          create — is stored locally on your device and remains under your control.
        </p>

        <h3>2. Device permissions</h3>
        <p>
          The app requests only the permissions it needs for its features to work (for example
          notifications, and — where a feature requires it — location or sensors). Each permission
          is used solely to power the feature it belongs to, is processed on your device, and can be
          revoked at any time from your device settings.
        </p>

        <h3>3. What we never do</h3>
        <ul>
          <li>Sell or share your personal data with third parties.</li>
          <li>Track you across other apps or websites.</li>
          <li>Show third-party advertising networks access to your data.</li>
        </ul>

        <h3>4. Purchases</h3>
        <p>
          Any in-app purchases are processed directly by Google Play Billing. We do not receive or
          store your payment details.
        </p>

        <h3>5. Children&rsquo;s privacy</h3>
        <p>
          The app is not directed at children and does not knowingly collect any data from children.
        </p>

        <h3>6. Changes to this policy</h3>
        <p>
          If the app&rsquo;s data practices change, this page will be updated and the &ldquo;Last
          updated&rdquo; date above will reflect the change.
        </p>

        <h3>7. Contact</h3>
        <p>
          Questions about this policy can be sent to: <strong>{app.email || "aivexallp@gmail.com"}</strong>
        </p>
      </section>
    </main>
  );
}
