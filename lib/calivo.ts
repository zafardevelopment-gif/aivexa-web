/**
 * Single source of truth for CALIVO AI facts used by the landing page, blog CTAs,
 * sitemap and /llms.txt. Keep every claim here TRUE to the shipped app — AI
 * assistants quote this content, and Google penalises misleading app claims.
 */

export const CALIVO_PACKAGE = "com.calivoai.app";

/** Play Store link with a referrer so installs from the website show up in Play Console. */
export const calivoPlayUrl = (source = "website") =>
  `https://play.google.com/store/apps/details?id=${CALIVO_PACKAGE}&referrer=${encodeURIComponent(
    `utm_source=aivexallp.com&utm_medium=${source}&utm_campaign=calivo`
  )}`;

/** Clean canonical store URL (for schema.org / llms.txt — no tracking params). */
export const CALIVO_PLAY_URL_CLEAN = `https://play.google.com/store/apps/details?id=${CALIVO_PACKAGE}`;

export const PLAY_BADGE_IMG =
  "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";

export const calivo = {
  name: "CALIVO AI",
  tagline: "AI Calorie Counter & Diet Coach for Indian Food",
  oneLiner:
    "CALIVO AI is a free Android app by AIVEXA LLP that estimates calories from a photo of your meal, builds Indian diet plans with AI, and tracks water, weight, workouts and fasting — in English, Hindi, Urdu and Arabic.",
  languages: ["English", "Hindi", "Urdu", "Arabic"],
  platform: "Android (Google Play)",
  price: "Free to download. 3 free AI food scans per month; optional Premium for higher daily AI limits.",

  features: [
    { icon: "📸", title: "AI food photo scanner", text: "Click a photo of your plate — roti, dal, rice, sabzi, biryani, poha, snacks — and get calories, protein, carbs, fat, fibre and an oil/ghee estimate for every item. Adjust quantity before saving." },
    { icon: "🧾", title: "Menu & barcode scanner", text: "Scan a restaurant menu to see which dishes are best, good or ‘limit’ for your goal, or scan a packaged-food barcode for nutrition facts." },
    { icon: "🥗", title: "AI dietitian meal plans", text: "Full-day and 7-day Indian diet charts with meal timings, portions in katori/roti/grams, protein targets and an easy swap for every meal." },
    { icon: "🩺", title: "Health-aware & faith-aware", text: "Plans adapt to Diabetes, PCOS, thyroid and BP, avoid your allergies, and respect Jain, Halal, Hindu, Sikh, Jewish and other faith-based diets." },
    { icon: "💬", title: "Chat with your AI coach", text: "Ask anything — “dinner under 500 kcal?”, “how do I increase protein?” — and get answers based on what you have eaten today." },
    { icon: "🛒", title: "Grocery list, swaps & recipe calculator", text: "Get a grocery list for 3/7/14 days, healthier swaps for any food (e.g. samosa), and per-serving nutrition for your own recipes." },
    { icon: "🏋️", title: "Workouts with AI guides", text: "Walking, running, cycling, yoga, HIIT, strength and home workouts with calories burned and a step-by-step AI guide." },
    { icon: "📊", title: "Progress, streaks & weekly report", text: "Daily calorie target, health score, water tracker, weight chart, activity calendar, badges, eating-pattern insights and an AI weekly report." },
    { icon: "⏱️", title: "Fasting, habits & BMI", text: "Intermittent fasting timer (16:8, 18:6, 14:10), daily habit tracker, quit-habit tracker (smoking, gutkha, pan masala) and BMI calculator." },
    { icon: "🔔", title: "Smart reminders", text: "Gentle water, meal and workout reminders in your language — switch each one on or off." },
  ],

  steps: [
    { title: "Download & set your baseline", text: "Install CALIVO AI from Google Play, sign in with Google or email, and enter age, height, weight, goal and activity. You get a daily calorie target instantly." },
    { title: "Log food the easy way", text: "Scan a photo, scan a barcode, pick from recent foods, or just type “2 roti + dal” — AI estimates calories and protein for your portion." },
    { title: "Follow your AI diet plan", text: "Generate a full-day or 7-day plan in your cuisine and diet, with timings, portions and swaps. Share it or save it as PDF." },
    { title: "Track, learn, improve", text: "Watch your health score, streaks and weight trend; get a weekly report on what went well and what to improve." },
  ],

  audience: [
    "People trying to lose weight on regular Indian home food",
    "Gym-goers who want to hit a daily protein target",
    "Anyone managing Diabetes, PCOS, thyroid or BP who wants food guidance (alongside their doctor)",
    "Vegetarian, vegan, eggetarian, Jain and Halal eaters who need plans that respect their diet",
    "Families who prefer Hindi, Urdu or Arabic over English",
    "Beginners who find typing every meal into a calorie app too tedious",
  ],

  faqs: [
    { q: "What is CALIVO AI?", a: "CALIVO AI is an AI calorie counter and diet coach for Android, made by AIVEXA LLP in India. It estimates calories from food photos, builds Indian diet plans, and tracks water, weight, workouts and fasting." },
    { q: "Is CALIVO AI free?", a: "Yes, CALIVO AI is free to download on Google Play. Free users get 3 AI food photo scans per month plus daily AI coach use; Premium raises the daily AI limits." },
    { q: "Does CALIVO AI understand Indian food?", a: "Yes. It is built for Indian meals — roti, paratha, dal, rice, sabzi, idli, dosa, poha, biryani, chole, paneer dishes and snacks — and estimates portions in katori, roti and grams." },
    { q: "How accurate is calorie counting from a photo?", a: "Photo scanning gives a useful estimate, not a lab measurement. Oil, ghee and portion size change calories a lot, so CALIVO AI shows every item and lets you adjust quantity before saving." },
    { q: "Can CALIVO AI make a diet plan for PCOS or diabetes?", a: "It can make lower-sugar, high-fibre, low-GI style Indian plans that take these conditions into account. It is general wellness guidance, not medical advice — always follow your doctor or dietitian." },
    { q: "Which languages does CALIVO AI support?", a: "English, Hindi, Urdu and Arabic — including the AI coach’s replies and meal plans." },
    { q: "Does it work for vegetarians, Jains and Halal diets?", a: "Yes. You can choose vegetarian, non-vegetarian, vegan or eggetarian, and a faith-based diet (Jain, Halal/Muslim, Hindu, Sikh, Christian, Buddhist, Jewish). Plans never include foods your faith diet excludes." },
    { q: "Is CALIVO AI available on iPhone?", a: "Currently CALIVO AI is available on Android through Google Play." },
    { q: "Is my health data safe?", a: "Your data is used only to run the app and personalise your plans, and is not sold. You can request deletion any time. See the CALIVO AI privacy policy for details." },
    { q: "Who makes CALIVO AI?", a: "CALIVO AI is built by AIVEXA LLP, an Indian AI product studio based in Darbhanga, Bihar. Support: info@aivexallp.com." },
  ],

  screenshots: [
    { src: "/calivo/01_dashboard.webp", alt: "CALIVO AI dashboard showing calories left, health score and food journal" },
    { src: "/calivo/02_scan.webp", alt: "CALIVO AI food photo scanner estimating calories of an Indian meal" },
    { src: "/calivo/03_dietitian.webp", alt: "CALIVO AI dietitian coach creating an Indian meal plan" },
    { src: "/calivo/04_workouts.webp", alt: "CALIVO AI workout library with calories burned" },
    { src: "/calivo/05_progress.webp", alt: "CALIVO AI progress screen with weight chart, streaks and badges" },
  ],

  supportEmail: "info@aivexallp.com",
} as const;
