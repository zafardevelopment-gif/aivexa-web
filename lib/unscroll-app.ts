/**
 * Single source of truth for Unscroll facts on aivexallp.com (landing page, nav, sitemap, llms.txt).
 * Keep every claim TRUE to the shipped Android app.
 * Set UNSCROLL_ON_PLAY = true once the Play Store listing is live — the page then shows the Play badge.
 */

export const UNSCROLL_PACKAGE = "com.unscroll.app";
export const UNSCROLL_ON_PLAY = false;

export const unscrollPlayUrl = (source = "website") =>
  `https://play.google.com/store/apps/details?id=${UNSCROLL_PACKAGE}&referrer=${encodeURIComponent(
    `utm_source=aivexallp.com&utm_medium=${source}&utm_campaign=unscroll`
  )}`;

export const UNSCROLL_PLAY_URL_CLEAN = `https://play.google.com/store/apps/details?id=${UNSCROLL_PACKAGE}`;

export const unscroll = {
  name: "Unscroll",
  tagline: "Screen time control & parental control for Indian families",
  oneLiner:
    "Unscroll is an Android app by AIVEXA LLP that helps you and your children use the phone less — app-wise time limits, focus and bedtime schedules, a strict mode with no easy bypass, website blocking in every browser, app lock with PIN or fingerprint, and a family mode where parents set the rules for their children's phones.",
  platform: "Android (Google Play)",
  price: "Free to download. Pro ₹49/month or ₹299/year · Family ₹99/month or ₹599/year (incl. GST, up to 5 children's phones).",
  supportEmail: "support@aivexallp.com",

  features: [
    { icon: "⏱️", title: "App-wise time limits", text: "Give YouTube 1 hour, Instagram 30 minutes and games 20 minutes. When time is up the app pauses on its own — no shouting, no snatching the phone." },
    { icon: "👨‍👩‍👧", title: "Family mode for parents", text: "Link your child's phone with a code and set limits, schedules and blocked apps from your own phone. Changes reach the child's phone automatically." },
    { icon: "🙋", title: "Extra-time requests", text: "Your child can ask for 15 more minutes with a reason. You approve or decline with one tap, wherever you are." },
    { icon: "🌐", title: "Websites blocked too", text: "When YouTube or Instagram is paused, youtube.com and instagram.com stay closed in Chrome and every other browser as well." },
    { icon: "🔒", title: "Strict mode & app lock", text: "Rules can't be loosened in the middle of a session. Unscroll itself is locked with a PIN or fingerprint so nobody changes the rules quietly." },
    { icon: "🛡️", title: "Uninstall protection", text: "On a child's phone, Unscroll can't be removed or switched off without the parent — and tricks like picture-in-picture video are blocked." },
    { icon: "🎯", title: "Focus & bedtime schedules", text: "Study time, office hours and bedtime: distracting apps pause on a schedule while calls, maps and study apps keep working." },
    { icon: "📊", title: "Daily summary & insights", text: "A short evening summary of where the time went, which app took the most, and how today compares with yesterday." },
    { icon: "🕌", title: "Prayer mode (optional)", text: "Pause apps during namaz, puja or any prayer time you choose. Off by default — turn it on only if you want it." },
    { icon: "⏳", title: "Floating timer", text: "A small timer on screen shows how much time is left in an app, so the limit never comes as a surprise." },
  ],

  steps: [
    { title: "Install and choose a mode", text: "Install Unscroll and pick 'For myself' or 'Family'. Allow the permissions — each one says why it is needed." },
    { title: "Set your limits", text: "Tap any app to set a daily limit, or create focus, study and bedtime schedules." },
    { title: "Link your child's phone", text: "In Family mode you get a code. Enter it on your child's phone — now you control its rules from yours." },
    { title: "See the change", text: "Check the daily summary, approve extra-time requests and adjust limits as habits improve." },
  ],

  audience: [
    "Parents who want to control their child's phone time without daily fights",
    "Students preparing for board exams, NEET, JEE or UPSC who keep getting pulled into Reels",
    "Working professionals who want focused office hours",
    "Anyone who loses hours to YouTube Shorts and Instagram Reels at night",
    "Families who want phone-free dinner and prayer time",
    "Parents who found that their child simply opens YouTube in Chrome",
  ],

  faqs: [
    { q: "What is Unscroll?", a: "Unscroll is a screen time and parental control app for Android made by AIVEXA LLP in India. It sets app-wise time limits, schedules and website blocks — for your own phone or, in Family mode, for your child's phone from yours." },
    { q: "Can my child simply open YouTube in the browser instead?", a: "No. With 'Block websites too' switched on, the website of a paused app (for example youtube.com) is blocked in every browser until the allowed time starts again." },
    { q: "Can my child uninstall Unscroll?", a: "On a child's phone linked to a parent, Unscroll turns on uninstall protection, and the app and its settings are locked with the parent's PIN or fingerprint." },
    { q: "Is Unscroll free?", a: "Yes, the basic app is free. Pro costs ₹49 a month or ₹299 a year, and Family costs ₹99 a month or ₹599 a year for a parent and up to 5 children's phones (prices include GST)." },
    { q: "Does Unscroll read my child's messages or photos?", a: "No. Unscroll only uses which apps were used and for how long, to apply the rules. It does not read messages, photos, calls or browsing content." },
    { q: "Does it work on all Android phones?", a: "It works on Android phones including OnePlus, Oppo, Vivo, Realme, Xiaomi and Samsung. On some brands you must allow Unscroll to run in the background — the app shows you exactly where." },
    { q: "Is prayer mode compulsory?", a: "No. Prayer mode is optional and off by default. You can use it for namaz, puja or any prayer time you set yourself." },
    { q: "Is Unscroll available on iPhone?", a: "Not yet — Unscroll is currently for Android only." },
    { q: "Who makes Unscroll?", a: "Unscroll is built by AIVEXA LLP, an Indian software company in Darbhanga, Bihar. Support: support@aivexallp.com." },
  ],
} as const;
