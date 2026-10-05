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
  tagline: "Prayer Times, Azan, Quran with Tafseer, complete Hadith books and a Namaz & Wudu guide — in English, Hindi, Urdu, Bangla, Malayalam, Arabic and Indonesian",
  oneLiner:
    "Miftah is a free, privacy-first Android app by AIVEXA LLP for Muslims: accurate offline prayer (namaz) times, Azan and Iqamah notifications, a Qibla compass, the Holy Quran with word-by-word meanings, your choice of translator and tafseer (Ibn Kathir, Ma'ariful Qur'an, Bayan-ul-Qur'an and more), complete hadith books (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah, Muwatta), Qur'an and hadith search, a step-by-step Namaz & Wudu guide with diagrams, a Daily Sunnah checklist, a salah tracker, and a gentle app blocker that pauses distracting apps during prayer time. Available in English, Hindi, Urdu, Bangla, Malayalam, Arabic and Indonesian.",
  languages: ["English", "Hindi", "Urdu", "Bangla", "Malayalam", "Arabic", "Indonesian"],
  platform: "Android (Google Play)",
  price:
    "Free to download. Prayer times, Azan, Qibla, Quran, du'a, hadith and the salah tracker are free forever; optional Premium adds extra reciters, offline audio, Quran recitation check and more.",

  features: [
    { icon: "🕌", title: "Accurate prayer times", text: "GPS-based Fajr, Dhuhr, Asr, Maghrib and Isha times that work offline, with all major calculation methods (MWL, Karachi, Umm al-Qura, ISNA, Egypt and more) and Hanafi or Shafi'i Asr. Adjust any time to match your local masjid." },
    { icon: "🔔", title: "Azan, Iqamah & before-prayer alerts", text: "A reminder a few minutes before each prayer, the Azan notification at prayer time with a normal or “Allahu Akbar” sound, and an Iqamah reminder for congregation — scheduled a week ahead so you never miss one." },
    { icon: "📖", title: "Holy Quran", text: "Full Mushaf in Indo-Pak script with pinch-to-zoom, right in the bottom bar. Word-by-word meanings and full translation in Urdu (Nastaliq), Hindi, English, Arabic and Indonesian, famous reciters, bookmarks and surah search. Resume from your last page in one tap." },
    { icon: "📚", title: "Complete hadith books & tafseer", text: "A Books tab with Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawud, Jami' at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah, Muwatta Malik and 40-hadith collections — every chapter with full Arabic, translation, number and grade — plus tafseer books like Ibn Kathir, Ma'ariful Qur'an, Bayan-ul-Qur'an, Tazkirul Qur'an and Fi Zilal al-Qur'an." },
    { icon: "🔎", title: "Search Qur'an & hadith", text: "Type a word like namaz, roza, sabr or jannat (English, Arabic or Roman Hindi/Urdu) to find every ayah or hadith about it, or jump straight to an ayah (2:255) or a mushaf page." },
    { icon: "🎧", title: "Listen to everything", text: "Every du'a, hadith, azkar and guide step can be read aloud — the Arabic first, then the translation in your language. Qur'an recitation by famous qaris, and your choice of Qur'an translator in any language." },
    { icon: "🧎", title: "Namaz & Wudu guide", text: "The fara'id and step-by-step method of Wudu, Namaz, Ghusl, Tayammum and Roza, with a small diagram for every step and salah posture, the du'a of each step with its reference, what breaks wudu and the fast, and the rak'ahs of the five prayers." },
    { icon: "☀️", title: "Daily Sunnah checklist", text: "A daily checklist of sunnah habits — miswak, Bismillah, spreading salam, the 12 sunnah rak'ahs, tasbih after salah, sleeping du'as, Friday sunnahs and more — each with its hadith reference. It resets every day." },
    { icon: "🌐", title: "Hindi, Urdu, Bangla & Malayalam", text: "Use the app in English, Hindi, Urdu, Bangla, Malayalam, Arabic or Indonesian, with Qur'an translations in each language — e.g. Azizul Haque al-Umari (Hindi), Junagarhi and Maududi (Urdu), Taisirul Quran (Bangla), Abdul Hameed & Kunhi Mohammed (Malayalam)." },
    { icon: "🎙️", title: "Quran recitation check (Premium)", text: "Recite an ayah and Miftah checks it word by word — wrong or skipped words are highlighted, and you hear each one corrected in your chosen qari's voice. Jump to any surah and ayah." },
    { icon: "🔒", title: "Lock-to-Pray app blocker", text: "Pick apps like social media, games or YouTube to pause during each salah window. Miftah shows an ayah, hadith or du'a instead and lets you continue after you pray — with gentle, medium or strict modes and an emergency bypass." },
    { icon: "✅", title: "Salah tracker & streaks", text: "Tick each prayer as prayed from the home screen, build a daily streak, see a weekly chart, and keep a qada list of missed prayers. Excused mode for women with no streak penalty." },
    { icon: "🧭", title: "Qibla compass & masjid finder", text: "Find the Qibla with a compass or the AR camera view, and find nearby masjids with directions in Google Maps." },
    { icon: "🤲", title: "Du'a, hadith & dhikr", text: "400 authentic hadith from Sahih Bukhari and Sahih Muslim — browse by book and chapter, each with its source and number — plus du'as, morning and evening azkar, the 99 Names of Allah and a digital tasbih counter." },
    { icon: "🌙", title: "Ramadan & Islamic tools", text: "Ramadan mode with Sehri and Iftar times, Hijri date, an Umrah guide with authentic du'as, a Zakat calculator and an Islamic inheritance (Faraid) calculator." },
    { icon: "🛡️", title: "Privacy first", text: "No account and no ads during worship. Prayer data stays on your phone and nothing is sold. The accessibility service only detects which app is open — never your screen content." },
  ],

  steps: [
    { title: "Install & choose your language", text: "Download Miftah free from Google Play and pick English, Hindi, Urdu, Bangla, Malayalam, Arabic or Indonesian — translation language can be different from the app language." },
    { title: "Allow location & notifications", text: "Miftah calculates prayer times on your phone from your location and schedules the before-prayer, Azan and Iqamah alerts for the week ahead." },
    { title: "Pick apps to pause (optional)", text: "Choose which apps Miftah should gently pause during each prayer window, and how strict the pause should be." },
    { title: "Pray, learn & track", text: "Tick prayers on the home screen, read the Quran from where you stopped, learn the right way of wudu and namaz, and tick off your daily sunnahs." },
  ],

  audience: [
    "Muslims who want reliable prayer times and Azan notifications on Android",
    "Anyone who keeps getting pulled into their phone and misses salah on time",
    "People who want to read the Quran daily and resume where they left off",
    "Learners who want to check and improve their Quran recitation",
    "Families who prefer Hindi, Urdu, Bangla, Malayalam, Arabic or Indonesian over English",
    "Students of knowledge who want hadith books and tafseer on their phone",
    "New learners and children who want to learn wudu, namaz and ghusl step by step",
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
    { q: "Is Miftah available in Hindi?", a: "Yes. You can choose Hindi as the app language and as the translation language. The Quran translation, word-by-word meanings, du'as, azkar, the 99 Names and the Umrah guide are in Hindi. Hadith are shown in English, Urdu or Indonesian because no authentic Hindi hadith source is available yet." },
    { q: "Does Miftah teach how to pray and make wudu?", a: "Yes. The Namaz & Wudu guide shows the fara'id and the step-by-step method of Wudu, Namaz, Ghusl, Tayammum and Roza with a small diagram for each step and salah posture, and the du'a of each step with its reference. The fara'id follow the Hanafi school, as practised in India and Pakistan." },
    { q: "Which hadith books and tafseer are in Miftah?", a: "The Books tab has Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawud, Jami' at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah, Muwatta Malik, 40 Hadith an-Nawawi, 40 Hadith Qudsi and Shah Waliullah Dehlawi's 40 Hadith, plus tafseer such as Ibn Kathir, Ma'ariful Qur'an, Bayan-ul-Qur'an, Tazkirul Qur'an, Fi Zilal al-Qur'an and Ahsanul Bayaan. Books are read online from open datasets (hadith-api, Quran.com)." },
    { q: "Can I search the Qur'an for a topic like namaz?", a: "Yes. Type a word such as namaz, roza, zakat or sabr (or the English/Arabic word) and Miftah lists every matching ayah with its translation. You can also type 2:255 or 'page 50' to jump there." },
    { q: "Is Miftah available in Bangla and Malayalam?", a: "Yes. Besides English, Hindi, Urdu, Arabic and Indonesian, the app and Qur'an translation are available in Bangla and Malayalam; hadith books are available in Bangla too." },
    { q: "Is Miftah available on iPhone?", a: "Currently Miftah is available on Android through Google Play." },
    { q: "Who makes Miftah?", a: "Miftah is built by AIVEXA LLP, an Indian product studio. Support: info@aivexallp.com." },
  ],

  /** Store screenshots in /public/miftah/ — add files here once exported. */
  screenshots: [
    { src: "/miftah/screens/01_home.jpg", alt: "Miftah home screen with next prayer countdown and today's 5 prayers" },
    { src: "/miftah/screens/02_quran.jpg", alt: "Full Quran Mushaf in Indo-Pak script" },
    { src: "/miftah/screens/03_wordbyword.jpg", alt: "Word-by-word Quran meanings in Urdu" },
    { src: "/miftah/screens/04_recitation.jpg", alt: "Quran recitation check" },
    { src: "/miftah/screens/05_basics.jpg", alt: "Namaz and Wudu guide with fara'id and diagrams" },
    { src: "/miftah/screens/06_hadith.jpg", alt: "Authentic hadith by book and chapter" },
    { src: "/miftah/screens/07_features.jpg", alt: "Quick access to Qibla, masjids, Zakat, Umrah and more" },
    { src: "/miftah/screens/08_settings.jpg", alt: "Azan, Iqamah and reminder settings" },
  ] as { src: string; alt: string }[],

  supportEmail: "info@aivexallp.com",
};
