import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Unscroll",
  description:
    "Privacy policy for Unscroll — screen time and parental control app for Android, operated by AIVEXA LLP.",
  alternates: { canonical: "/unscroll/privacy-policy" },
};

export default function UnscrollPrivacyPolicyPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="section-label" style={{ justifyContent: "center" }}>
            Legal
          </div>
          <h1 className="section-title">
            Privacy Policy for <span className="accent">Unscroll</span>
          </h1>
          <p className="legal-update">Last updated: November 26, 2026</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/unscroll">Unscroll</Link>
            <span>›</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </section>

      <section className="legal-page-content">
        <p>
          Unscroll (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;the app&rdquo;) is a screen time and parental control app
          for Android, operated by AIVEXA LLP, Darbhanga, Bihar, India. This policy explains what data the app uses, what
          leaves your phone, why, and the choices you have.
        </p>
        <p>
          <strong>In short:</strong> Unscroll works mostly on your phone. It does not read your messages, photos, calls,
          contacts or the content of websites you visit, does not sell your data and does not show ads. Data is sent to
          our server only when you use Family mode, sign in, or buy a plan — plus an anonymous count of app opens.
        </p>

        <h3>1. Data that stays on your phone</h3>
        <ul>
          <li>
            <strong>App usage time</strong> (which apps were open and for how long), read with Android&apos;s Usage
            Access permission, to show your screen time and to apply your limits.
          </li>
          <li>Your limits, schedules, focus sessions, strict-mode and prayer-mode settings, and the city you choose for prayer times (we do not use GPS location).</li>
          <li>
            Your app-lock PIN, stored only as a one-way hash. Fingerprint unlock is handled by Android — Unscroll never
            receives your fingerprint.
          </li>
          <li>Daily insights and history shown in the app.</li>
        </ul>

        <h3>2. How Unscroll uses Android permissions</h3>
        <ul>
          <li><strong>Usage Access:</strong> to measure how long each app is used and to pause it when its limit is reached.</li>
          <li><strong>Display over other apps:</strong> to show the &ldquo;time is up&rdquo; screen and the optional floating timer.</li>
          <li><strong>Notifications:</strong> for limit warnings, daily summaries, optional prayer reminders and family alerts.</li>
          <li><strong>Battery optimisation exemption &amp; foreground service:</strong> so the limits keep working in the background.</li>
          <li>
            <strong>VPN (only if you turn on &ldquo;Block websites too&rdquo;):</strong> a local VPN on your phone checks
            only the website <em>names</em> your phone looks up (DNS) and blocks the ones that belong to a paused app, such
            as youtube.com. It runs only while an app is paused. No browsing data or website content is recorded or sent
            anywhere; all other traffic goes to the internet as normal.
          </li>
          <li>
            <strong>Device administrator (child phones linked to a parent):</strong> used only for uninstall protection,
            so the app cannot be removed without the parent. Unscroll does not use it to lock, wipe or read the phone.
          </li>
        </ul>

        <h3>3. Data sent to our server</h3>
        <p><strong>If you sign in (parents, or anyone who buys a plan)</strong></p>
        <ul>
          <li>Email address (used to send a one-time sign-in code) and an optional display name.</li>
          <li>Your plan and subscription status.</li>
        </ul>
        <p><strong>Family mode (a parent links a child&apos;s phone)</strong></p>
        <ul>
          <li>The child&apos;s first name or nickname and, optionally, birth year — entered by the parent.</li>
          <li>The rules the parent sets (limits, schedules, blocked apps).</li>
          <li>
            From the child&apos;s phone: daily time per app (app name, package name, minutes, opens), whether protection is
            running and which permissions are on, the phone model and app version.
          </li>
          <li>Extra-time requests (app, minutes and the reason the child types) and the parent&apos;s decision.</li>
          <li>Alerts shown to the parent (for example &ldquo;limit reached&rdquo; or &ldquo;phone not syncing&rdquo;).</li>
          <li>A push-notification token for the parent&apos;s and child&apos;s phones, to deliver these alerts.</li>
        </ul>
        <p><strong>Anonymous app-open count (everyone)</strong></p>
        <p>
          When the app is opened (at most once every 15 minutes) it sends a random install id created by the app, the
          app mode (self, parent or child) and the app version. This contains no name, email, phone number or usage
          details and is used only to count how many people use the app.
        </p>
        <p><strong>Payments</strong></p>
        <p>
          Plans are paid on our website through Razorpay (UPI Autopay, cards, net banking). We receive the payment and
          subscription ids, plan and amount. Your card, UPI or bank details are handled by Razorpay and never reach us.
        </p>

        <h3>4. How we use the data</h3>
        <ul>
          <li>To apply limits and schedules on your phone or your child&apos;s phone.</li>
          <li>To show parents their child&apos;s usage, requests and alerts, and to send daily summaries.</li>
          <li>To sign you in, keep your plan active and provide support.</li>
          <li>To count active users and keep the service reliable.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell personal data, do not use it for advertising and do not share it with anyone
          except the service providers below.
        </p>

        <h3>5. Service providers</h3>
        <ul>
          <li><strong>AIVEXA servers (Hostinger VPS):</strong> host our database and API.</li>
          <li><strong>Firebase Cloud Messaging (Google):</strong> delivers push notifications using the device token.</li>
          <li><strong>Resend:</strong> sends the sign-in code email.</li>
          <li><strong>Razorpay:</strong> processes payments.</li>
        </ul>

        <h3>6. Children</h3>
        <p>
          Unscroll can be installed on a child&apos;s phone only by, or with the permission of, a parent or guardian, who
          links it to their own account. The parent provides the child&apos;s name and controls the rules. We collect only
          the usage information described above, which is needed to show the parent and to apply the rules. A child&apos;s
          phone does not need an email address or an account. Parents can remove a child and all of its data at any time.
        </p>

        <h3>7. Retention and deletion</h3>
        <ul>
          <li>Child usage history is kept for up to 90 days and then deleted.</li>
          <li>
            In the app, <strong>Settings › Your data</strong> lets you export your data, delete your usage history or delete
            your account. Deleting an account removes the family, children, linked phones, rules, requests and alerts.
          </li>
          <li>You can also email <a href="mailto:support@aivexallp.com">support@aivexallp.com</a> from your account email to request deletion; we act within 30 days.</li>
          <li>Payment records are kept as long as Indian tax law requires.</li>
          <li>Uninstalling the app deletes everything stored on the phone.</li>
        </ul>

        <h3>8. Security</h3>
        <p>
          All data between the app and our server is encrypted with HTTPS. Sign-in codes and device keys are stored only
          as hashes, and access to the database is restricted. No system is 100% secure, but we take reasonable steps to
          protect your data.
        </p>

        <h3>9. Changes to this policy</h3>
        <p>
          We may update this policy when the app changes. The &ldquo;Last updated&rdquo; date above will change, and
          important changes will be shown in the app.
        </p>

        <h3>10. Contact</h3>
        <p>
          <strong>Email:</strong> <a href="mailto:support@aivexallp.com">support@aivexallp.com</a>
          <br />
          <strong>Company:</strong> AIVEXA LLP, Darbhanga, Bihar, India
          <br />
          <strong>App:</strong> <Link href="/unscroll">Unscroll — screen time &amp; parental control</Link>
        </p>
      </section>
    </main>
  );
}
