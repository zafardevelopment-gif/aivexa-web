import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CALIVO AI | AIVEXA",
  description:
    "Privacy policy for CALIVO AI — Your AI Calorie & Health Coach, operated by AIVEXA LLP.",
};

export default function CalivoPrivacyPolicyPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="section-label" style={{ justifyContent: "center" }}>
            Legal
          </div>
          <h1 className="section-title">
            Privacy Policy for <span className="accent">CALIVO AI</span>
          </h1>
          <p className="legal-update">Last updated: August 11, 2026</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>CALIVO AI Privacy Policy</span>
          </div>
        </div>
      </section>

      <section className="legal-page-content">
        <p>
          CALIVO AI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;the app&rdquo;) is operated by
          AIVEXA LLP. This policy explains what data we collect through the CALIVO AI mobile
          application, how we use it, and the choices you have.
        </p>
        <p>
          By using CALIVO AI, you agree to the collection and use of information as described in
          this policy.
        </p>

        <h3>1. Information We Collect</h3>

        <p><strong>Account information</strong></p>
        <ul>
          <li>Email address</li>
          <li>Name (derived from your email, or from your Google account if you sign in with Google)</li>
          <li>Profile picture (only if provided via Google sign-in)</li>
        </ul>

        <p><strong>Health and fitness profile (provided by you, optional)</strong></p>
        <ul>
          <li>Age, gender, height, current weight, target weight</li>
          <li>Activity level and fitness/weight goals</li>
          <li>Dietary preference and faith-based dietary requirements</li>
          <li>Health conditions, allergies, injuries or physical limitations</li>
          <li>Pregnancy/postpartum status</li>
        </ul>

        <p><strong>App activity and logs</strong></p>
        <ul>
          <li>Meals logged (name, calories, protein, carbohydrates, fat, fiber, sugar, sodium, cooking method)</li>
          <li>Workouts logged (type, duration, calories burned)</li>
          <li>Water intake</li>
          <li>Weight history</li>
          <li>Chat messages sent to the AI coach</li>
          <li>Daily and weekly progress data, streaks, and achievement badges</li>
        </ul>

        <p><strong>Photos</strong></p>
        <p>
          Food photos and restaurant menu photos you choose to submit for AI-based nutrition
          analysis. These images are sent to our AI processing provider at the time of the scan to
          generate a nutrition estimate. We do not permanently store the raw photo after the scan
          result is generated.
        </p>

        <p><strong>Notification data</strong></p>
        <ul>
          <li>Push notification token (only if you enable notifications), used solely to deliver reminders and coach updates you&apos;ve opted into</li>
          <li>Your notification preferences (which reminder types are enabled)</li>
        </ul>

        <p><strong>Subscription and payment data</strong></p>
        <ul>
          <li>Subscription plan and status (free / premium, monthly / yearly)</li>
          <li>Payment confirmation data from our payment processor (we do not receive or store your full card number, UPI ID, or other sensitive payment credentials — these are handled entirely by our payment processor)</li>
        </ul>

        <p><strong>Technical data</strong></p>
        <ul>
          <li>Authentication tokens (to keep you signed in)</li>
          <li>Device language/locale setting, used to serve the app in your preferred language (English, Hindi, or Arabic)</li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>We use the information above to:</p>
        <ul>
          <li>Create and manage your account</li>
          <li>Calculate your personalized daily calorie target and health score</li>
          <li>Provide AI-generated food recognition, nutrition estimates, meal plans, grocery lists, recipe calculations, and coaching guidance</li>
          <li>Track your progress, streaks, and badges over time</li>
          <li>Send you reminders and updates you&apos;ve opted into</li>
          <li>Process your subscription and manage premium access</li>
          <li>Improve and maintain the reliability of the app</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your personal data to anyone, and we do not use your
          health data for advertising.
        </p>

        <h3>3. Third-Party Services We Use</h3>
        <p>
          CALIVO AI relies on the following third-party services to operate. Each processes only
          the data necessary for its specific function:
        </p>
        <ul>
          <li><strong>OpenRouter (AI provider, e.g. Google Gemini models):</strong> analyzes food/menu photos and generates coaching text, meal plans, and nutrition estimates. Shares photos you submit for scanning and relevant profile context (goal, dietary preference, health conditions) needed to personalize the response.</li>
          <li><strong>Razorpay:</strong> processes subscription payments. Shares payment amount and subscription plan; Razorpay handles your card/UPI details directly — we never receive or store them.</li>
          <li><strong>MongoDB Atlas:</strong> our database provider; stores your account and app data securely, as described in Section 1.</li>
          <li><strong>Google Sign-In</strong> (if you choose to sign in with Google): authentication. Shares your Google account email, name, and profile picture.</li>
          <li><strong>Expo Push Notification service:</strong> delivers push notifications. Shares your device&apos;s push notification token.</li>
          <li><strong>Open Food Facts:</strong> public database used to look up packaged food nutrition by barcode. Shares only the barcode number you enter — no personal data sent.</li>
        </ul>
        <p>
          We do not permit these providers to use your data for their own advertising or unrelated
          purposes.
        </p>

        <h3>4. Data Retention</h3>
        <p>
          We retain your account and app data for as long as your account is active. If you
          request account deletion (see Section 6), we will delete your personal data within 30
          days, except where we are required to retain certain records for legal or accounting
          purposes (e.g. payment records).
        </p>

        <h3>5. Data Security</h3>
        <p>
          All data transmitted between the app and our servers is encrypted in transit
          (HTTPS/TLS). Passwords are stored using industry-standard one-way hashing (bcrypt) — we
          never store your password in plain text. Access to our database is restricted and
          authenticated.
        </p>
        <p>
          While we take reasonable steps to protect your data, no method of transmission or
          storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h3>6. Your Rights and Choices</h3>
        <ul>
          <li><strong>Access and correction:</strong> You can view and update your profile information at any time within the app.</li>
          <li><strong>Notification control:</strong> You can enable or disable water, meal, and workout reminders at any time from the app&apos;s notification settings.</li>
          <li>
            <strong>Account deletion:</strong> You may request deletion of your account and all
            associated personal data by emailing us at{" "}
            <a href="mailto:aivexallp@gmail.com">aivexallp@gmail.com</a> with the subject line
            &ldquo;Account Deletion Request&rdquo; from the email address associated with your
            account. We will process your request within 30 days.
          </li>
          <li><strong>Subscription cancellation:</strong> You can cancel your premium subscription at any time from within the app; cancellation stops future billing but does not retroactively refund past charges except as required by law or our refund policy.</li>
        </ul>

        <h3>7. Medical Disclaimer</h3>
        <p>
          CALIVO AI provides general wellness estimates, nutrition information, and coaching
          guidance for informational purposes only.{" "}
          <strong>It is not a substitute for professional medical advice, diagnosis, or
          treatment.</strong> Calorie and nutrition estimates generated by AI from photos are
          approximations and may not be fully accurate. Always consult a qualified doctor or
          registered dietitian before making significant changes to your diet or exercise
          routine, especially if you have a pre-existing medical condition, are pregnant or
          postpartum, or have any food allergies.
        </p>

        <h3>8. Children&apos;s Privacy</h3>
        <p>
          CALIVO AI is not directed at, and is not intended for use by, children under the age of
          13. We do not knowingly collect personal information from children under 13. If we
          become aware that a child under 13 has provided us with personal data, we will delete
          it promptly.
        </p>

        <h3>9. International Users</h3>
        <p>
          CALIVO AI is available to users globally. By using the app, you consent to your
          information being transferred to and processed in countries where our service providers
          operate, including the United States and India, which may have data protection laws
          different from those in your country of residence.
        </p>

        <h3>10. Changes to This Policy</h3>
        <p>
          We may update this privacy policy from time to time to reflect changes in our practices
          or for legal, operational, or regulatory reasons. We will update the &ldquo;Last
          updated&rdquo; date at the top of this policy when changes are made. Continued use of
          the app after changes are posted constitutes your acceptance of the updated policy.
        </p>

        <h3>11. Contact Us</h3>
        <p>
          If you have any questions, concerns, or requests regarding this privacy policy or your
          personal data, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:aivexallp@gmail.com">aivexallp@gmail.com</a>
          <br />
          <strong>App:</strong> CALIVO AI — Your AI Calorie &amp; Health Coach
        </p>
      </section>
    </main>
  );
}
