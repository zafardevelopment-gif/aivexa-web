import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete your account — Unscroll",
  description:
    "How to delete your Unscroll account and data. Unscroll is a screen time and parental control app for Android by AIVEXA LLP.",
  alternates: { canonical: "/unscroll/delete-account" },
};

export default function UnscrollDeleteAccountPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="section-label" style={{ justifyContent: "center" }}>
            Your data
          </div>
          <h1 className="section-title">
            Delete your <span className="accent">Unscroll</span> account
          </h1>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/unscroll">Unscroll</Link>
            <span>›</span>
            <span>Delete account</span>
          </div>
        </div>
      </section>

      <section className="legal-page-content">
        <p>
          This page explains how to delete your account and data in <strong>Unscroll</strong>, the screen time and
          parental control app for Android developed by <strong>AIVEXA LLP</strong>.
        </p>

        <h3>Option 1: Delete in the app</h3>
        <ol>
          <li>Open Unscroll on your phone.</li>
          <li>Go to <strong>Settings › Your data</strong>.</li>
          <li>Tap <strong>Delete account</strong> and confirm.</li>
        </ol>
        <p>
          The same screen also lets you delete only your usage history, without deleting your account.
        </p>

        <h3>Option 2: Request deletion by email</h3>
        <p>
          Email <a href="mailto:support@aivexallp.com?subject=Delete%20my%20Unscroll%20account">support@aivexallp.com</a>{" "}
          from the email address you use to sign in, with the subject &ldquo;Delete my Unscroll account&rdquo;. We complete
          the request within 30 days.
        </p>

        <h3>What is deleted</h3>
        <ul>
          <li>Your account and email address</li>
          <li>Your family, children&rsquo;s profiles and linked phones</li>
          <li>Rules, schedules, extra-time requests, alerts and usage history</li>
          <li>Push notification tokens</li>
        </ul>

        <h3>What is kept</h3>
        <ul>
          <li>
            Payment and invoice records (payment ID, plan and amount) are kept for as long as Indian tax law requires.
            Card and UPI details are never stored by us; they stay with our payment processor, Razorpay.
          </li>
        </ul>
        <p>Uninstalling the app deletes everything stored on the phone itself.</p>

        <p>
          See the full <Link href="/unscroll/privacy-policy">privacy policy</Link> for more details.
        </p>
      </section>
    </main>
  );
}
