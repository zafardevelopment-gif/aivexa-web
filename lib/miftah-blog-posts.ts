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
  {
    slug: "wudu-ka-tarika-step-by-step",
    title: "Wudu Ka Tarika (वुज़ू का तरीका) Step by Step: 4 Fara'id, Sunnah Method & What Breaks Wudu",
    description:
      "How to make wudu step by step — the 4 fara'id of wudu (Hanafi), the sunnah method from Sahih Bukhari and Muslim, the du'a after wudu and what breaks wudu. In English with Hindi/Urdu terms.",
    date: "2026-10-03",
    category: "Islamic Tools",
    readTime: "5 min read",
    cta: "miftah",
    content: `
Wudu (वुज़ू / وضو) is the washing a Muslim does before salah, tawaf and touching the Mushaf. Allah says: *"When you rise for prayer, wash your faces and your arms up to the elbows, wipe your heads and wash your feet up to the ankles."* (Al-Ma'idah 5:6)

## The 4 fara'id of wudu (वुज़ू के 4 फ़र्ज़)

These four are **fard** in the Hanafi school, followed by most Muslims in India and Pakistan. If one is missed, the wudu is not valid.

| # | Fard | Detail |
|---|---|---|
| 1 | Wash the whole face once | Hairline to chin, ear to ear |
| 2 | Wash both arms | Including the elbows |
| 3 | Masah of the head | Wipe at least a quarter of the head |
| 4 | Wash both feet | Including the ankles |

Other schools (Shafi'i, Hanbali) also count intention and the order of steps as fard — follow your local scholar.

## Sunnah method, step by step

This is the wudu of Uthman ؓ as he showed the Prophet ﷺ made it (Bukhari 159, Muslim 226):

1. **Intention and Bismillah** — intend wudu in your heart and say *Bismillah* (Abu Dawud 101).
2. **Wash the hands** up to the wrists, 3 times, between the fingers too.
3. **Rinse the mouth** 3 times — use miswak if you can.
4. **Rinse the nose** 3 times — water in with the right hand, out with the left.
5. **Wash the face** 3 times *(fard)*. Men run wet fingers through the beard.
6. **Wash the arms** to and including the elbows, 3 times, right first *(fard)*.
7. **Masah** — wipe the head front to back and back once, then the ears *(fard: a quarter of the head)*.
8. **Wash the feet** including the ankles and between the toes, 3 times, right first *(fard)*.

## Du'a after wudu

**أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ**

*Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh.*

"I bear witness that none has the right to be worshipped but Allah alone, without partner, and that Muhammad is His servant and Messenger." The Prophet ﷺ said the eight gates of Jannah are opened for whoever says it (Muslim 234).

## What breaks wudu (वुज़ू किन चीज़ों से टूटता है)

- Passing urine, stool or wind
- Blood or pus flowing from the body
- Vomiting a mouthful
- Sleeping lying down or leaning
- Losing consciousness
- Laughing aloud during salah

These follow the Hanafi school; details differ in other schools.

## Learn it in the app

[Miftah](/miftah) has a free **Namaz & Wudu guide** with a small diagram for every step, the fara'id highlighted, and the du'as with their references — in English, Hindi (हिन्दी), Urdu, Arabic and Indonesian.
`,
  },
  {
    slug: "namaz-ka-tarika-step-by-step",
    title: "Namaz Ka Tarika (नमाज़ का तरीका) Step by Step: 6 Conditions, 6 Arkan & Rak'ahs of 5 Prayers",
    description:
      "How to pray namaz step by step with the du'a of each position — the 6 conditions (sharait) and 6 arkan of salah (Hanafi), and a table of rak'ahs for Fajr, Zuhr, Asr, Maghrib and Isha.",
    date: "2026-10-03",
    category: "Islamic Tools",
    readTime: "7 min read",
    cta: "miftah",
    content: `
The five daily prayers are fard on every adult Muslim. The Prophet ﷺ said: *"Pray as you have seen me praying."* (Bukhari 631). This guide follows the Hanafi school, the common practice in India and Pakistan.

## Before salah — 6 conditions (नमाज़ की शर्तें)

1. Purity of the body — wudu, or ghusl when it is required
2. Clean clothes
3. Clean place
4. Covering the satr
5. Facing the qiblah
6. The prayer's time has begun — and the intention (niyyah) in the heart

## Inside salah — 6 arkan (नमाज़ के फ़र्ज़)

1. Takbir at-tahrimah (the opening *Allahu Akbar*)
2. Qiyam — standing
3. Qira'ah — reciting the Qur'an
4. Ruku' — bowing
5. Both sajdahs
6. Qa'dah akhirah — the final sitting for tashahhud

## How to pray, step by step

| Step | Position | What to say |
|---|---|---|
| 1 | **Takbir** — raise hands to the ears | اللَّهُ أَكْبَرُ *Allahu Akbar* (Abu Dawud 61) |
| 2 | **Qiyam** — fold the hands | Thana: سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ… (Abu Dawud 775), then A'udhu billah, Bismillah, Surah al-Fatihah and another surah |
| 3 | **Ruku'** — hands on knees, back straight | سُبْحَانَ رَبِّيَ الْعَظِيمِ *Subhana Rabbiyal-'Azim* ×3 (Muslim 772) |
| 4 | **Qawmah** — stand straight | سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا لَكَ الْحَمْدُ (Bukhari 789) |
| 5 | **Sajdah** — forehead, nose, palms, knees and toes on the ground | سُبْحَانَ رَبِّيَ الْأَعْلَى *Subhana Rabbiyal-A'la* ×3 (Muslim 772; Bukhari 812) |
| 6 | **Jalsah**, then the second sajdah | رَبِّ اغْفِرْ لِي *Rabbighfir li* (Abu Dawud 874) |
| 7 | **Qa'dah** — after every 2 rak'ahs | Tashahhud: التَّحِيَّاتُ لِلَّهِ… (Bukhari 831, Muslim 402) |
| 8 | **Final sitting** | Tashahhud, then Durood Ibrahim (Bukhari 3370) and a du'a |
| 9 | **Salam** — turn right, then left | السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ (Abu Dawud 996) |

Steps 2–6 make one rak'ah.

## Rak'ahs of the five prayers (पाँच नमाज़ों की रकअतें)

| Prayer | Rak'ahs |
|---|---|
| Fajr | 2 sunnah · 2 fard |
| Zuhr | 4 sunnah · 4 fard · 2 sunnah |
| Asr | 4 fard |
| Maghrib | 3 fard · 2 sunnah |
| Isha | 4 fard · 2 sunnah · 3 witr (wajib) |

The 12 sunnah rak'ahs (2 before Fajr, 4 before and 2 after Zuhr, 2 after Maghrib, 2 after Isha) earn a house in Jannah (Muslim 728, Tirmidhi 415).

## Learn it with diagrams

[Miftah](/miftah) shows every step of namaz with a small posture diagram (takbir, qiyam, ruku', sajdah, jalsah, tashahhud, salam) and the Arabic, transliteration and translation of each du'a — in English, Hindi (हिन्दी), Urdu, Arabic and Indonesian. It also gives accurate namaz times and Azan alerts.
`,
  },
  {
    slug: "ghusl-aur-tayammum-ka-tarika",
    title: "Ghusl & Tayammum Ka Tarika (ग़ुस्ल और तयम्मुम का तरीका): Fara'id and Sunnah Method",
    description:
      "When ghusl becomes fard, its 3 fara'id and the sunnah method (Bukhari 248, 249); and how to do tayammum when there is no water — its 3 fara'id and steps (Qur'an 4:43, 5:6).",
    date: "2026-10-03",
    category: "Islamic Tools",
    readTime: "5 min read",
    cta: "miftah",
    content: `
## Ghusl (ग़ुस्ल / غسل)

Ghusl is the full ritual bath. It becomes **fard** after janabah, and when menstruation or post-natal bleeding ends. *"If you are in a state of janabah, then purify yourselves."* (Al-Ma'idah 5:6)

### 3 fara'id of ghusl (Hanafi)

1. Rinse the whole mouth (gargle, unless fasting)
2. Rinse the nose up to the soft bone
3. Wash the entire body so that not a hair's breadth stays dry

### Sunnah method

Based on how Aisha ؓ and Maimunah ؓ described the Prophet's ﷺ ghusl (Bukhari 248, 249):

1. Intention and *Bismillah*
2. Wash both hands up to the wrists, 3 times
3. Wash the private parts and remove any impurity
4. Make wudu as for salah — rinsing mouth and nose fully
5. Pour water over the head 3 times so it reaches the roots of the hair
6. Wash the whole body, right side then left, rubbing — navel, ears, under the arms and between the toes too
7. Wash the feet (move aside if water collected where you stood)

## Tayammum (तयम्मुम / تيمم)

When there is no water, or using it would cause harm (for example in illness), purify with clean earth. *"…and you find no water, then seek clean earth and wipe your faces and hands."* (An-Nisa 4:43)

### 3 fara'id of tayammum (Hanafi)

1. Intention
2. Wiping the whole face
3. Wiping both arms including the elbows

### Method

1. Intend tayammum (in place of wudu or ghusl) and say *Bismillah*
2. Place both palms on clean earth or dust, then shake off the excess
3. Wipe the whole face once
4. Strike again and wipe the right arm to the elbow with the left hand, then the left arm

The Hanafi school uses two strikes; the hadith of Ammar ؓ (Bukhari 338, Muslim 368) describes the method in general.

## In the app

[Miftah](/miftah) has a free guide for Wudu, Namaz, Ghusl, Tayammum and Roza with a diagram for each step and the fara'id highlighted — in English, Hindi (हिन्दी), Urdu, Arabic and Indonesian. Please ask your local scholar where schools differ.
`,
  },
  {
    slug: "daily-sunnah-habits-list-with-hadith",
    title: "16 Daily Sunnah Habits With Hadith References (रोज़ की सुन्नतें)",
    description:
      "A simple list of daily sunnahs of the Prophet ﷺ — miswak, Bismillah, salam, 12 sunnah rak'ahs, tasbih after salah, sleeping du'as, Friday sunnahs — each with its hadith reference.",
    date: "2026-10-03",
    category: "Islamic Tools",
    readTime: "4 min read",
    cta: "miftah",
    content: `
Small sunnahs, done every day, add up. Here are 16 easy ones with the hadith they come from.

| # | Sunnah | Reference |
|---|---|---|
| 1 | Use miswak, especially at wudu and before salah | Bukhari 887, Muslim 252 |
| 2 | Begin with the right — shoes, clothes, combing, wudu, entering the masjid | Bukhari 168, Muslim 268 |
| 3 | Say *Bismillah* and eat with the right hand, from what is in front of you | Bukhari 5376, Muslim 2022 |
| 4 | Drink sitting, in three breaths | Muslim 2024, 2028 |
| 5 | Spread salam — to those you know and those you don't | Muslim 54 |
| 6 | Smile — it is charity | Tirmidhi 1956 (hasan) |
| 7 | Du'a before entering the toilet | Bukhari 142, Muslim 375 |
| 8 | Du'a when leaving home: *Bismillah, tawakkaltu 'alallah…* | Abu Dawud 5095, Tirmidhi 3426 |
| 9 | 12 sunnah rak'ahs every day | Muslim 728, Tirmidhi 415 |
| 10 | Tasbih after every salah: 33 SubhanAllah, 33 Alhamdulillah, 33 Allahu Akbar + 1 | Muslim 597 |
| 11 | Send durood often — Allah sends ten blessings in return | Muslim 408 |
| 12 | When you sneeze, say *Alhamdulillah* | Bukhari 6224 |
| 13 | Recite Surah al-Mulk at night | Tirmidhi 2892 |
| 14 | Recite Ayat al-Kursi before sleep | Bukhari 2311 |
| 15 | Sleep with wudu, on the right side, with the sleeping du'a | Bukhari 247, Muslim 2710, Bukhari 6324 |
| 16 | Friday: ghusl, Surah al-Kahf and abundant durood | Bukhari 877; al-Hakim (Kahf) |

## Make it a habit

Pick three to start with, and add one more each week. [Miftah](/miftah) has a free **Daily Sunnah checklist** with all 16 habits and their du'as — tick them off each day; the list resets every morning. Available in English, Hindi (हिन्दी), Urdu, Arabic and Indonesian.
`,
  },
];
