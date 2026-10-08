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

  {
    slug: "how-to-complete-quran-in-30-days-khatam-plan",
    title: "How to Complete the Quran in 30 Days (or Any Target): A Simple Khatam Plan",
    description:
      "How many pages a day to finish the Quran in 7, 15, 30, 40, 60 or 90 days, how to split it around the five prayers, and how to catch up after a missed day.",
    date: "2026-10-08",
    category: "Islamic Tools",
    readTime: "5 min read",
    cta: "miftah",
    content: `
The common 15-line (Madani / Indo-Pak) mushaf has **604 pages** and 30 juz of about **20 pages** each. Finishing the Quran is simply a matter of reading a fixed number of pages every day.

## Pages per day for each target

| Finish in | Pages a day | About |
|---|---|---|
| 7 days | 87 | 4½ juz |
| 15 days | 41 | 2 juz |
| 30 days (one Ramadan) | 21 | 1 juz |
| 40 days | 16 | ¾ juz |
| 60 days | 11 | ½ juz |
| 90 days | 7 | ⅓ juz |
| 1 year | 2 | 2 pages |

A page takes most readers 2–3 minutes, so **one juz a day is about 45–60 minutes**.

## Split it around the five prayers

For a 30-day khatam, read **4 pages after each salah** — Fajr, Dhuhr, Asr, Maghrib and Isha — and you finish one juz a day without a single long sitting. For 60 days, 2 pages after each prayer is enough.

## Missed a day? Spread it out

Don't double up the next day — that is how most plans break. Divide the pages you are behind by the days left and add a little to each day. Example: on day 10 of a 30-day plan you are 21 pages behind; adding 1 extra page a day for the remaining 21 days closes the gap.

## Keep it going

- Fix a place and a time (after Fajr is easiest for many).
- Track a **streak** — a small daily win keeps you consistent.
- When you finish, make du'a; many begin the next khatam right away.

## Track it in Miftah

[Miftah](/miftah) has a free **Khatam planner**: choose 7, 30, 40, 60 days or your own target and it shows today's portion, counts pages automatically as you read the mushaf in the app (or lets you mark a portion read from a printed Quran), keeps your streak, tells you if you are ahead or behind, and reminds you each day at your chosen time.
`,
  },
  {
    slug: "how-to-memorize-quran-hifz-method-at-home",
    title: "How to Memorise the Quran at Home: A Simple Hifz Method That Works",
    description:
      "A practical hifz routine for adults and children: listen and repeat, the 3 × 10 method, new lesson (sabaq), recent revision (sabqi) and old revision (manzil), and where to start.",
    date: "2026-10-08",
    category: "Islamic Tools",
    readTime: "6 min read",
    cta: "miftah",
    content: `
Memorising the Quran is less about talent and more about a **steady daily routine** and **constant revision**. The method below is the one most hifz teachers use, adapted for learning at home.

## 1. Start small and short

Begin with **Juz 'Amma** (the 30th juz) — short surahs like An-Nas, Al-Falaq, Al-Ikhlas and Al-Kawthar. Quick wins build confidence, and these surahs are recited in salah every day.

## 2. Listen before you read

Play one ayah by a clear qari **5–10 times** while following the text. Listening first fixes the correct pronunciation and rhythm in your ear before mistakes can settle in.

## 3. The 3 × 10 method

1. Read the ayah **10 times** looking at the text.
2. Recite it **10 times** without looking.
3. Join it to the previous ayah and recite both **10 times**.

Then move to the next ayah. At the end, recite the whole new portion three times without looking.

## 4. Three parts every day

| Part | What | How much |
|---|---|---|
| Sabaq (new) | New ayahs | 3–5 ayahs or ¼ page to start |
| Sabqi (recent) | The last 7 days of new lessons | Every day |
| Manzil (old) | Everything memorised before | A fixed amount daily, so all of it is revised every 1–2 weeks |

Skipping revision is the most common reason memorisation fades. **Revision matters more than new lessons.**

## 5. Test yourself and get checked

Hide the text and recite, then check. Recite to a teacher, parent or friend at least once a week — someone else hears mistakes you can't.

## Practise with Miftah

[Miftah](/miftah) has a free **Hifz mode**: pick a surah, hide the text or show only the first word, repeat each ayah 1–20 times and loop a range with your chosen qari, tick ayahs as memorised, and see which surahs are due for revision. Premium adds a word-by-word **recitation check**. It supports your teacher — it doesn't replace one.
`,
  },
  {
    slug: "sunnah-fasting-days-ayyam-al-bid-monday-thursday-arafah-ashura",
    title: "Sunnah Fasting Days: Ayyam al-Bid, Monday & Thursday, Arafah, Ashura and Shawwal",
    description:
      "The recommended (sunnah) fasts with their hadith references — the white days, Mondays and Thursdays, Arafah, Ashura, six days of Shawwal — and the days on which fasting is not allowed.",
    date: "2026-10-08",
    category: "Islamic Tools",
    readTime: "4 min read",
    cta: "miftah",
    content: `
Besides Ramadan, the Prophet ﷺ encouraged several voluntary fasts. Here they are with their references.

| Fast | When | Reference |
|---|---|---|
| Ayyam al-Bid ("white days") | 13th, 14th and 15th of every Hijri month | Jami' at-Tirmidhi 761 |
| Monday | Every Monday — the day the Prophet ﷺ was born | Sahih Muslim 1162 |
| Monday & Thursday | Deeds are presented to Allah on these days | Jami' at-Tirmidhi 747 |
| Day of Arafah | 9 Dhul Hijjah (for those not on Hajj) — expiates two years | Sahih Muslim 1162 |
| Ashura | 10 Muharram, with the 9th — expiates the past year | Sahih Muslim 1162, 1134 |
| Six days of Shawwal | Any six days after Eid al-Fitr — like fasting the whole year | Sahih Muslim 1164 |
| First 9 days of Dhul Hijjah | The best days for good deeds | Sahih al-Bukhari 969 |

## Days you must not fast

- **Eid al-Fitr** (1 Shawwal) and **Eid al-Adha** (10 Dhul Hijjah).
- The **days of Tashreeq** (11, 12, 13 Dhul Hijjah) — "days of eating, drinking and remembering Allah" (Sahih Muslim 1141).

So in Dhul Hijjah the white-day fast is kept on the 14th and 15th only.

## The Hijri date and moon sighting

Sunnah fasts follow the **Hijri calendar**, which starts with the new moon. Calculated calendars can differ by a day from local moon sighting (in India the date is often one day behind Saudi Arabia), so follow your local announcement.

## Get reminded

[Miftah](/miftah) has a free **Islamic calendar** that marks all of these days, lets you adjust the Hijri date by ±2 days for your area, and can remind you **the evening before** so you can make the intention and set a sehri alarm. Monday/Thursday reminders are optional, and a Friday reminder for Surah al-Kahf and durood is included.
`,
  },
  {
    slug: "noorani-qaida-for-kids-arabic-letters-six-kalimas",
    title: "Noorani Qaida for Kids: Teaching Arabic Letters, Harakat and the Six Kalimas at Home",
    description:
      "How to start your child on the Noorani Qaida — the 29 Arabic letters, fatha, kasra and damma — plus the six kalimas with meaning and tips to keep children interested.",
    date: "2026-10-08",
    category: "Islamic Tools",
    readTime: "5 min read",
    cta: "miftah",
    content: `
The **Noorani Qaida** is the beginner's book most children in India, Pakistan and Bangladesh use before they start reading the Quran. Its first lessons can be taught at home in a few minutes a day.

## Lesson 1: the letters (huroof)

There are 29 letters in the order taught by the Qaida:

ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن و ه ء ي

Teach 3–4 letters a day. Say the letter's **name** (Alif, Baa, Taa…), let the child repeat it, then point to letters at random. Arabic is read **right to left** — show this early.

## Lesson 2: the short vowels (harakat)

| Mark | Name (Urdu/Hindi) | Sound | Example |
|---|---|---|---|
| ـَ above | Fatha (zabar) | a | بَ = ba |
| ـِ below | Kasra (zer) | i | بِ = bi |
| ـُ above | Damma (pesh) | u | بُ = bu |

Go letter by letter: بَ بِ بُ, تَ تِ تُ … Children enjoy it when it becomes a chant.

## The six kalimas

1. **Tayyibah** — There is no god but Allah, Muhammad is the Messenger of Allah.
2. **Shahadah** — bearing witness to Allah's oneness and the Prophet's ﷺ messengership.
3. **Tamjeed** — glorifying Allah: SubhanAllah, Alhamdulillah, La ilaha illallah, Allahu Akbar.
4. **Tawheed** — Allah alone gives life and death; all good is in His hand.
5. **Astaghfar** — seeking forgiveness for every sin, known and unknown.
6. **Radd-e-Kufr** — seeking refuge from shirk and every sin.

Teach one kalima a week, a line at a time, with its meaning.

## Tips that work

- Keep sessions to **10–15 minutes**, same time daily.
- Praise effort, not just correct answers.
- Use sound and colour — children learn by hearing.
- For correct pronunciation (makharij), a teacher is still best.

## Practise with Miftah

[Miftah](/miftah) has a free **Kids corner**: tap any letter or letter-with-harakah to hear it, read the six kalimas with transliteration and meaning, and play a 12-question quiz about Islam. It uses the phone's Arabic voice, so it is a practice aid alongside a teacher.
`,
  },
];
