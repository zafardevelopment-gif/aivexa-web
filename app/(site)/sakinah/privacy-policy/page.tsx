import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Sakinah | AIVEXA",
  description:
    "Privacy policy for Sakinah — Lock to Pray, the privacy-first Islamic prayer companion by AIVEXA LLP.",
};

export default function SakinahPrivacyPolicyPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="section-label" style={{ justifyContent: "center" }}>
            Legal
          </div>
          <h1 className="section-title">
            Privacy Policy for <span className="accent">Sakinah</span>
          </h1>
          <p className="legal-update">Last updated: September 7, 2026</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Sakinah Privacy Policy</span>
          </div>
        </div>
      </section>

      <section className="legal-page-content">
        <p>
          Sakinah — Lock to Pray (&ldquo;the app&rdquo;, package{" "}
          <code>com.aivexallp.sakinah</code>) is operated by AIVEXA LLP and is built
          privacy-first. This page explains what the app accesses on your device, what it never
          accesses, and what — if anything — ever leaves your device.
        </p>

        <h3>1. What we access, and why</h3>
        <ul>
          <li>
            <strong>Foreground app name only.</strong> To detect when you open an app you&rsquo;ve
            chosen to pause during prayer time, Sakinah uses Android&rsquo;s Accessibility Service.
            It reads only the package name of the app currently on screen — it cannot read
            on-screen text or content, by design.
          </li>
          <li>
            <strong>Location.</strong> Used to calculate your local prayer times and qibla
            direction, processed entirely on your device. The one exception: if you open the
            Nearby (masjid/halal finder) screen, your coordinates and a search radius are sent to
            the free, public OpenStreetMap Overpass API to find nearby places — only while that
            screen is open.
          </li>
          <li>
            <strong>Compass/orientation sensor.</strong> Used only to power the qibla direction
            view.
          </li>
          <li>
            <strong>Camera.</strong> Used only while the Qibla AR screen is open, to show a live
            camera preview with a qibla arrow overlaid. No photo or video is ever captured, saved,
            or transmitted.
          </li>
          <li>
            <strong>Installed app list.</strong> Used only to show a picker so you can choose which
            apps to pause during prayer time. Only the app id and display name are read — never
            usage history or content.
          </li>
          <li>
            <strong>Notifications &amp; exact alarms.</strong> Used to deliver the adhan (prayer
            call) notification at the precise calculated prayer time.
          </li>
        </ul>

        <h3>2. What we never access</h3>
        <ul>
          <li>Message content, keystrokes, clipboard, or on-screen content of any other app.</li>
          <li>Contacts, call logs, or the microphone.</li>
          <li>Browsing history or in-app activity, beyond the foreground app&rsquo;s package identifier as described above.</li>
          <li>Photos or video — the camera is only ever shown live, never recorded.</li>
        </ul>

        <h3>3. What we never do</h3>
        <ul>
          <li>Sell or share your data with third parties.</li>
          <li>Transmit foreground-app detections off your device.</li>
          <li>Show ads during a pause or prayer moment.</li>
          <li>Use dark patterns to block cancellation, hide settings, or force upgrades.</li>
        </ul>

        <h3>4. Data storage</h3>
        <p>
          All core data — prayer logs, settings, bundled Qur&rsquo;an/content, family mode profiles
          — is stored locally on your device and works fully offline. There is no account system
          and no server-side sync. If analytics are ever introduced, they will be strictly opt-in
          and privacy-respecting; none are enabled today.
        </p>

        <h3>5. Third-party services</h3>
        <ul>
          <li>
            <strong>OpenStreetMap Overpass API</strong> — only when you open the Nearby screen,
            your current coordinates and a search radius are sent as a plain request. No account,
            device identifier, or other app data is included.
          </li>
          <li>
            <strong>Platform app stores</strong> — in-app purchases go directly through
            Google&rsquo;s own Play Billing. Sakinah does not use any third-party purchase or
            analytics backend.
          </li>
        </ul>

        <h3>6. Children&rsquo;s privacy</h3>
        <p>
          Sakinah&rsquo;s optional Family mode lets a parent add family member profiles and prayer
          logs, stored locally on the parent&rsquo;s own device only. There is no account system,
          no data collection about children, and no data leaves the device through this feature.
        </p>

        <h3>7. Changes to this policy</h3>
        <p>
          If Sakinah&rsquo;s data practices change, this page will be updated and the &ldquo;Last
          updated&rdquo; date above will reflect the change.
        </p>

        <h3>8. Contact</h3>
        <p>
          Questions about this policy can be sent to: <strong>aivexallp@gmail.com</strong>
        </p>
      </section>
    </main>
  );
}
