import type { BlogPost } from "./blog-posts";

/**
 * Islamic-practice cluster supporting the Miftah app page (/miftah).
 * Each post answers one real search question, stays religiously neutral
 * (no fatwas — points to local scholars / masjid where opinions differ),
 * links to /miftah and ends with the Miftah download box (cta: "miftah").
 */
export const miftahPosts: BlogPost[] = [
  {
    slug: "namaz-time-calculation-methods-hanafi-shafi-asr",
    title: "How Namaz Times Are Calculated: Fajr & Isha Angles, Hanafi vs Shafi'i Asr Explained",
    description:
      "Why prayer apps show different Fajr, Asr and Isha times — calculation methods (MWL, Karachi, Umm al-Qura, ISNA), twilight angles and the Hanafi vs Shafi'i Asr rule, in simple words.",
    date: "2026-10-02",
    category: "Islamic Tools",
    readTime: "6 min read",
    cta: "miftah",
    content: `
Two prayer apps on the same phone can show Fajr 10 minutes apart. Neither is "broken" — they are using **different calculation methods**. This guide explains what those settings mean so you can pick the one your local masjid follows.

## Prayer times come from the sun's position

Each salah is tied to a point in the sun's daily path:

| Prayer | Begins when |
|---|---|
| Fajr | First light of true dawn appears (sun a set angle below the horizon) |
| Sunrise | Fajr time ends |
| Dhuhr | Just after the sun passes its highest point (zawal) |
| Asr | An object's shadow reaches a set length (see Hanafi vs Shafi'i below) |
| Maghrib | Just after sunset |
| Isha | Evening twilight disappears (sun a set angle below the horizon) |

Your latitude, longitude, date and time zone decide when these moments happen. That is why a good app needs your **location** — and why times can be calculated on the phone, **without internet**.

## Why methods differ: the Fajr and Isha angles

Scholars and organisations have chosen slightly different sun angles for dawn and dusk. Common methods:

| Method | Fajr angle | Isha | Commonly used in |
|---|---|---|---|
| University of Islamic Sciences, Karachi | 18° | 18° | India, Pakistan, Bangladesh |
| Muslim World League (MWL) | 18° | 17° | Europe, parts of Asia |
| Umm al-Qura, Makkah | 18.5° | 90 min after Maghrib | Saudi Arabia |
| ISNA (North America) | 15° | 15° | USA, Canada |
| Egyptian General Authority | 19.5° | 17.5° | Egypt, parts of Africa |

A bigger angle means an **earlier Fajr** and a **later Isha**. In India most masjids follow the Karachi method — but always check your local timetable.

## Hanafi vs Shafi'i Asr

This is the difference people notice most.

- **Shafi'i, Maliki, Hanbali (standard):** Asr begins when an object's shadow equals its own length (plus the shadow at noon).
- **Hanafi:** Asr begins when the shadow is **twice** the object's length.

So the Hanafi Asr time is usually **40–60 minutes later** than the standard time. If you follow the Hanafi madhab, as most Muslims in India and Pakistan do, choose Hanafi Asr in your app.

## Why your masjid's time may still differ

Masjid timetables often add a few minutes of caution (ihtiyat), or fix jamaat times for convenience. The **Azan time** an app shows is when the prayer window starts; the **Iqamah (jamaat) time** is set by your masjid. That is why it helps if your app lets you:

- adjust each prayer by a few minutes to match your masjid, and
- set a separate Iqamah reminder.

## Quick checklist for correct times

1. Turn on location (or pick your city).
2. Choose the calculation method your masjid uses (Karachi for most of South Asia).
3. Choose Hanafi or Shafi'i Asr.
4. Compare with your masjid timetable for a day and adjust by ±minutes if needed.
5. For jamaat, follow the masjid's Iqamah time.

When in doubt about which opinion to follow, ask a scholar or the imam of your local masjid.

[Miftah](/miftah) supports all of the methods above, Hanafi or Shafi'i Asr, per-prayer adjustments and an Iqamah reminder — and calculates times on your phone, so they work offline.
`,
  },
  {
    slug: "how-to-stop-missing-namaz-phone-distraction",
    title: "How to Stop Missing Namaz Because of Your Phone: 7 Practical Steps",
    description:
      "Practical, gentle ways to pray on time when Instagram, YouTube and games keep pulling you in — reminders before Azan, Iqamah alerts, pausing apps during salah and tracking your prayers.",
    date: "2026-10-02",
    category: "Islamic Tools",
    readTime: "5 min read",
    cta: "miftah",
    content: `
"I'll pray after this video" — and then Asr is almost over. If this sounds familiar, you are not alone. Phones are designed to keep us scrolling. The good news: small changes to *how* your phone behaves at prayer time make a big difference.

## 1. Get a reminder *before* the Azan, not only at it

An alert exactly at prayer time is easy to swipe away. A reminder **10–15 minutes before** gives you time to finish what you are doing, make wudu and get ready. Set one for each prayer.

## 2. Add an Iqamah reminder for jamaat

If you pray at the masjid, the Azan is not the deadline — the Iqamah is. A second alert a few minutes before jamaat stops you from arriving after the first rak'ah.

## 3. Pause your most distracting apps during the prayer window

Willpower is weakest when the app is already open. Instead, decide **in advance** which apps (social media, YouTube, games) should be paused during each salah window. When you open one, you see a short ayah, hadith or du'a instead of the feed — and you continue after you pray.

Keep it kind to yourself: use a gentle mode first, and make sure there is an emergency bypass for calls, maps or work.

## 4. Keep the phone away from the musalla

Put the phone in another room or face-down on silent while praying. Notifications during salah break focus (khushu) even if you don't pick the phone up.

## 5. Track your prayers — without shame

Ticking each prayer as prayed builds a habit. A simple streak and weekly chart show progress. If you miss one, add it to a **qada list** and make it up — the goal is consistency, not guilt.

## 6. Anchor prayers to things you already do

- Fajr → before checking the phone in the morning
- Dhuhr → before lunch
- Asr → when you finish work or classes
- Maghrib → as soon as the sun sets, before dinner
- Isha → before your evening screen time

## 7. Replace the scroll with something better

When the urge to scroll comes, open the Quran instead — even one page. Resuming from your last page makes this a 2-minute habit.

## A simple setup that works

| Setting | Suggestion |
|---|---|
| Before-prayer reminder | 10–15 minutes |
| Azan notification | On (sound or silent) |
| Iqamah reminder | Masjid jamaat time − 5 minutes |
| Paused apps | Instagram, YouTube, games, browser |
| Mode | Start gentle, move to medium after 2 weeks |

[Miftah](/miftah) does all of this in one free app: before-prayer, Azan and Iqamah alerts, a Lock-to-Pray app pause with an ayah, hadith or du'a, a salah tracker with qada list, and the Holy Quran that opens where you stopped.
`,
  },
];
