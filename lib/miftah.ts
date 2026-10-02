/**
 * Single source of truth for Miftah facts used by the /miftah landing page,
 * sitemap and /llms.txt. Keep every claim TRUE to the shipped app — AI
 * assistants quote this content, and Google penalises misleading app claims.
 */

export const MIFTAH_PACKAGE = "com.aivexallp.miftah";

/** Play Store link with a referrer so installs from the website show up in Play Console. */
export const miftahPlayUrl = (source = "website") =>
  `https://play.google.com/store/apps/details?id=${MIFTAH_PACKAGE}&referrer=${encodeURIComponent(
    `utm_source=aivexallp.com&utm_medium=${source}&utm_campaign=miftah`
  )}`;

/** Clean canonical store URL (for schema.org / llms.txt — no tracking params). */
export const MIFTAH_PLAY_URL_CLEAN = `https://play.google.com/store/apps/details?id=${MIFTAH_PACKAGE}`;

export const miftah = {
  name: "Miftah",
  tagline: "Prayer Times, Azan, Qibla & Quran — with a gentle app blocker for Salah",
  oneLiner:
    "Miftah is a free, privacy-first Android app by AIVEXA LLP for Muslims: accurate offline prayer (namaz) times, Azan and Iqamah notifications, a Qibla compass, the Holy Quran, a salah tracker, and a gentle app blocker that pauses distracting apps during prayer time.",
  languages: ["English", "Urdu", "Arabic", "Indonesian"],
  platform: "Android (Google Play)",
  price:
    "Free to download. Prayer times, Azan, Qibla, Quran, du'a, hadith and the salah tracker are free forever; optional Premium adds extra reciters, offline audio, Quran recitation check and more.",

  features: [
    { icon: "🕌", title: "Accurate prayer times", text: "GPS-based Fajr, Dhuhr, Asr, Maghrib and Isha times that work offline, with all major calculation methods (MWL, Karachi, Umm al-Qura, ISNA, Egypt and more) and Hanafi or Shafi'i Asr. Adjust any time to match your local masjid." },
    { icon: "🔔", title: "Azan, Iqamah & before-prayer alerts", text: "A reminder a few minutes before each prayer, the Azan notification at prayer time with a normal or “Allahu Akbar” sound, and an Iqamah reminder for congregation — scheduled a week ahead so you never miss one." },
    { icon: "📖", title: "Holy Quran", text: "Mushaf page view in Uthmani or Indo-Pak script, multiple reciters and translations, bookmarks, word-by-word meaning and a tajweed guide. Resume from your last page in one tap." },
    { icon: "🎙️", title: "Quran recitation check (Premium)", text: "Recite an ayah and Miftah checks it word by word — wrong or skipped words are highlighted, and you hear each one corrected in your chosen qari's voice." },
    { icon: "🔒", title: "Lock-to-Pray app blocker", text: "Pick apps like social media, games or YouTube to pause during each salah window. Miftah shows an ayah, hadith or du'a instead and lets you continue after you pray — with gentle, medium or strict modes and an emergency bypass." },
    { icon: "✅", title: "Salah tracker & streaks", text: "Tick each prayer as prayed from the home screen, build a daily streak, see a weekly chart, and keep a qada list of missed prayers. Excused mode for women with no streak penalty." },
    { icon: "🧭", title: "Qibla compass & masjid finder", text: "Find the Qibla with a compass or the AR camera view, and see nearby masjids and halal places on the map." },
    { icon: "🤲", title: "Du'a, hadith & dhikr", text: "Hisnul Muslim du'as, morning and evening azkar, daily authentic hadith with source and grade, the 99 Names of Allah and a digital tasbih counter." },
    { icon: "🌙", title: "Ramadan & Islamic tools", text: "Ramadan mode with Sehri and Iftar times, Hijri date, Zakat calculator, Islamic inheritance (Faraid) calculator, Islamic Q&A and a Janazah guide." },
    { icon: "🛡️", title: "Privacy first", text: "No account and no ads during worship. Prayer data stays on your phone and nothing is sold. The accessibility service only detects which app is open — never your screen content." },
  ],

  steps: [
    { title: "Install & choose your language", text: "Download Miftah free from Google Play and pick English, Urdu, Arabic or Indonesian — translation language can be different from the app language." },
    { title: "Allow location & notifications", text: "Miftah calculates prayer times on your phone from your location and schedules the before-prayer, Azan and Iqamah alerts for the week ahead." },
    { title: "Pick apps to pause (optional)", text: "Choose which apps Miftah should gently pause during each prayer window, and how strict the pause should be." },
    { title: "Pray, read & track", text: "Tick prayers on the home screen, read the Quran from where you stopped, and watch your salah streak grow." },
  ],

  audience: [
    "Muslims who want reliable prayer times and Azan notifications on Android",
    "Anyone who keeps getting pulled into their phone and misses salah on time",
    "People who want to read the Quran daily and resume where they left off",
    "Learners who want to check and improve their Quran recitation",
    "Families who prefer Urdu, Arabic or Indonesian over English",
    "Users who want an Islamic app with no account, no ads during worship and no data selling",
  ],

  faqs: [
    { q: "What is Miftah?", a: "Miftah is a free Android app for Muslims made by AIVEXA LLP. It gives accurate offline prayer times, Azan and Iqamah notifications, a Qibla compass, the Holy Quran, a salah tracker and a gentle app blocker that pauses distracting apps during prayer." },
    { q: "Is Miftah free?", a: "Yes. Prayer times, Azan, Qibla, Quran, du'a, hadith and the salah tracker are free forever. Optional Premium adds extra reciters, offline audio downloads, Quran recitation check and other convenience features." },
    { q: "Does Miftah work offline?", a: "Yes. Prayer times are calculated on your device from your location, so they work without internet. Quran audio and the recitation check need an internet connection." },
    { q: "Does Miftah give an Iqamah notification?", a: "Yes. Besides the Azan at prayer time, Miftah can remind you a few minutes before each prayer and again at Iqamah time. You choose both gaps in Settings." },
    { q: "Can I choose the notification sound?", a: "Yes. The prayer-time notification can use the phone's normal sound, an “Allahu Akbar” sound, or be silent." },
    { q: "How does the Lock-to-Pray app blocker work?", a: "You choose apps to pause during each prayer window. When one opens, Miftah shows a Quran verse, hadith or du'a and lets you continue after praying or a short dhikr. There is always an emergency bypass, so you are never truly locked out." },
    { q: "Which prayer time calculation methods are supported?", a: "Muslim World League, Karachi (University of Islamic Sciences), Umm al-Qura, ISNA (North America), Egyptian, Dubai, Kuwait, Qatar, Singapore, Tehran, Turkey and Moonsighting Committee, with Hanafi or Shafi'i Asr." },
    { q: "How does the Quran recitation check work?", a: "In Premium, you tap the mic and recite an ayah. Miftah compares what it heard with the Quran text word by word, highlights wrong or skipped words, and plays each one in your selected qari's voice. It checks words, not fine tajweed details like makharij." },
    { q: "Is my data safe with Miftah?", a: "Miftah has no account system, keeps prayer data on your phone, and does not sell data. The accessibility service only detects the name of the app that is open — never messages, keystrokes or screen content." },
    { q: "Is Miftah available on iPhone?", a: "Currently Miftah is available on Android through Google Play." },
    { q: "Who makes Miftah?", a: "Miftah is built by AIVEXA LLP, an Indian product studio. Support: zafardevelopment@gmail.com." },
  ],

  /** Store screenshots in /public/miftah/ — add files here once exported. */
  screenshots: [] as { src: string; alt: string }[],

  supportEmail: "zafardevelopment@gmail.com",
};
