import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – CALIVO AI",
  description:
    "Privacy policy for CALIVO AI — Your AI Calorie & Health Coach, operated by AIVEXA LLP.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-sm leading-relaxed text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy for CALIVO AI</h1>
      <p className="text-gray-500 mb-10">Last updated: August 11, 2026</p>

      <p className="mb-6">
        CALIVO AI ("we", "our", "the app") is operated by AIVEXA LLP. This policy explains what
        data we collect through the CALIVO AI mobile application, how we use it, and the choices you
        have.
      </p>
      <p className="mb-10">
        By using CALIVO AI, you agree to the collection and use of information as described in this
        policy.
      </p>

      <hr className="mb-10" />

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>

        <h3 className="font-semibold text-gray-800 mb-2">Account information</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Email address</li>
          <li>Name (derived from your email, or from your Google account if you sign in with Google)</li>
          <li>Profile picture (only if provided via Google sign-in)</li>
        </ul>

        <h3 className="font-semibold text-gray-800 mb-2">Health and fitness profile (provided by you, optional)</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Age, gender, height, current weight, target weight</li>
          <li>Activity level and fitness/weight goals</li>
          <li>Dietary preference and faith-based dietary requirements</li>
          <li>Health conditions, allergies, injuries or physical limitations</li>
          <li>Pregnancy/postpartum status</li>
        </ul>

        <h3 className="font-semibold text-gray-800 mb-2">App activity and logs</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Meals logged (name, calories, protein, carbohydrates, fat, fiber, sugar, sodium, cooking method)</li>
          <li>Workouts logged (type, duration, calories burned)</li>
          <li>Water intake</li>
          <li>Weight history</li>
          <li>Chat messages sent to the AI coach</li>
          <li>Daily and weekly progress data, streaks, and achievement badges</li>
        </ul>

        <h3 className="font-semibold text-gray-800 mb-2">Photos</h3>
        <p className="mb-4">
          Food photos and restaurant menu photos you choose to submit for AI-based nutrition
          analysis. These images are sent to our AI processing provider at the time of the scan to
          generate a nutrition estimate. We do not permanently store the raw photo after the scan
          result is generated.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">Notification data</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Push notification token (only if you enable notifications), used solely to deliver reminders and coach updates you've opted into</li>
          <li>Your notification preferences (which reminder types are enabled)</li>
        </ul>

        <h3 className="font-semibold text-gray-800 mb-2">Subscription and payment data</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Subscription plan and status (free / premium, monthly / yearly)</li>
          <li>Payment confirmation data from our payment processor (we do not receive or store your full card number, UPI ID, or other sensitive payment credentials — these are handled entirely by our payment processor)</li>
        </ul>

        <h3 className="font-semibold text-gray-800 mb-2">Technical data</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Authentication tokens (to keep you signed in)</li>
          <li>Device language/locale setting, used to serve the app in your preferred language (English, Hindi, or Arabic)</li>
        </ul>
      </section>

      <hr className="mb-10" />

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
        <p className="mb-3">We use the information above to:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Create and manage your account</li>
          <li>Calculate your personalized daily calorie target and health score</li>
          <li>Provide AI-generated food recognition, nutrition estimates, meal plans, grocery lists, recipe calculations, and coaching guidance</li>
          <li>Track your progress, streaks, and badges over time</li>
          <li>Send you reminders and updates you've opted into</li>
          <li>Process your subscription and manage premium access</li>
          <li>Improve and maintain the reliability of the app</li>
        </ul>
        <p className="font-medium">
          We do <strong>not</strong> sell your personal data to anyone, and we do not use your health data for advertising.
        </p>
      </section>

      <hr className="mb-10" />

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Third-Party Services We Use</h2>
        <p className="mb-4">
          CALIVO AI relies on the following third-party services to operate. Each processes only the
          data necessary for its specific function:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-800 border-b">Service</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-800 border-b">Purpose</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-800 border-b">Data shared</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 font-medium">OpenRouter (AI provider, e.g. Google Gemini models)</td>
                <td className="px-4 py-3">Analyzes food/menu photos and generates coaching text, meal plans, and nutrition estimates</td>
                <td className="px-4 py-3">Photos you submit for scanning; relevant profile context needed to personalize the response</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Razorpay</td>
                <td className="px-4 py-3">Processes subscription payments</td>
                <td className="px-4 py-3">Payment amount, subscription plan; Razorpay handles your card/UPI details directly</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">MongoDB Atlas</td>
                <td className="px-4 py-3">Our database provider; stores your account and app data securely</td>
                <td className="px-4 py-3">All account and app data described in Section 1</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Google Sign-In</td>
                <td className="px-4 py-3">Authentication (if you choose to sign in with Google)</td>
                <td className="px-4 py-3">Your Google account email, name, and profile picture</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Expo Push Notification service</td>
                <td className="px-4 py-3">Delivers push notifications</td>
                <td className="px-4 py-3">Your device's push notification token</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Open Food Facts</td>
                <td className="px-4 py-3">Public database used to look up packaged food nutrition by barcode</td>
                <td className="px-4 py-3">The barcode number you enter (no personal data sent)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          We do not permit these providers to use your data for their own advertising or unrelated purposes.
        </p>
      </section>

      <hr className="mb-10" />

      {/* Section 4 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
        <p>
          We retain your account and app data for as long as your account is active. If you request
          account deletion (see Section 6), we will delete your personal data within 30 days, except
          where we are required to retain certain records for legal or accounting purposes (e.g.
          payment records).
        </p>
      </section>

      <hr className="mb-10" />

      {/* Section 5 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
        <p className="mb-3">
          All data transmitted between the app and our servers is encrypted in transit (HTTPS/TLS).
          Passwords are stored using industry-standard one-way hashing (bcrypt) — we never store
          your password in plain text. Access to our database is restricted and authenticated.
        </p>
        <p>
          While we take reasonable steps to protect your data, no method of transmission or storage
          is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <hr className="mb-10" />

      {/* Section 6 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Access and correction:</strong> You can view and update your profile information at any time within the app.</li>
          <li><strong>Notification control:</strong> You can enable or disable water, meal, and workout reminders at any time from the app's notification settings.</li>
          <li>
            <strong>Account deletion:</strong> You may request deletion of your account and all
            associated personal data by emailing us at{" "}
            <a href="mailto:aivexallp@gmail.com" className="text-blue-600 underline">
              aivexallp@gmail.com
            </a>{" "}
            with the subject line "Account Deletion Request" from the email address associated with
            your account. We will process your request within 30 days.
          </li>
          <li><strong>Subscription cancellation:</strong> You can cancel your premium subscription at any time from within the app; cancellation stops future billing but does not retroactively refund past charges except as required by law or our refund policy.</li>
        </ul>
      </section>

      <hr className="mb-10" />

      {/* Section 7 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Medical Disclaimer</h2>
        <p>
          CALIVO AI provides general wellness estimates, nutrition information, and coaching guidance
          for informational purposes only.{" "}
          <strong>
            It is not a substitute for professional medical advice, diagnosis, or treatment.
          </strong>{" "}
          Calorie and nutrition estimates generated by AI from photos are approximations and may not
          be fully accurate. Always consult a qualified doctor or registered dietitian before making
          significant changes to your diet or exercise routine, especially if you have a pre-existing
          medical condition, are pregnant or postpartum, or have any food allergies.
        </p>
      </section>

      <hr className="mb-10" />

      {/* Section 8 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
        <p>
          CALIVO AI is not directed at, and is not intended for use by, children under the age of
          13. We do not knowingly collect personal information from children under 13. If we become
          aware that a child under 13 has provided us with personal data, we will delete it promptly.
        </p>
      </section>

      <hr className="mb-10" />

      {/* Section 9 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">9. International Users</h2>
        <p>
          CALIVO AI is available to users globally. By using the app, you consent to your information
          being transferred to and processed in countries where our service providers operate,
          including the United States and India, which may have data protection laws different from
          those in your country of residence.
        </p>
      </section>

      <hr className="mb-10" />

      {/* Section 10 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time to reflect changes in our practices or
          for legal, operational, or regulatory reasons. We will update the "Last updated" date at
          the top of this policy when changes are made. Continued use of the app after changes are
          posted constitutes your acceptance of the updated policy.
        </p>
      </section>

      <hr className="mb-10" />

      {/* Section 11 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
        <p className="mb-2">
          If you have any questions, concerns, or requests regarding this privacy policy or your
          personal data, please contact us at:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:aivexallp@gmail.com" className="text-blue-600 underline">
            aivexallp@gmail.com
          </a>
        </p>
        <p>
          <strong>App:</strong> CALIVO AI — Your AI Calorie &amp; Health Coach
        </p>
      </section>
    </main>
  );
}
