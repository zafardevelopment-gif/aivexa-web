# AIVEXA website (aivexa-next) — Project Memory

Next.js 15 site for aivexallp.com. Last updated: 11 Oct 2026.

## 1. Hosting & deploy (moved from Vercel → Hostinger Ubuntu VPS)
- Server folder: `/var/www/aivexa-web` (user `deploy`). Runs under **PM2 process `aivexa-web-app`**.
- Other PM2 apps on the same server: aimunim-app, myrentsaathi-app, testsaathi-app, tentsaathi-app,
  nsa-app, nursecare-app, payroll-app.
- Deploy:
  ```bash
  # local (PowerShell 5 has no &&, run one by one)
  git add -A; git commit -m "..."; git push
  # server
  cd /var/www/aivexa-web
  git pull
  npm run build && pm2 restart aivexa-web-app --update-env
  ```
- Env file on server: `.env.local` (must contain everything that used to be in Vercel, e.g.
  CALIVO_SUPABASE_URL / CALIVO_SUPABASE_SERVICE_KEY for admin App Analytics).
- `vercel.json` / `@sparticuz/chromium` were for Vercel — the PDF/screenshot API may need system Chromium on the VPS (not yet verified).

## 2. App landing pages
- Miftah: `lib/miftah.ts` (English facts, features, FAQs) + `lib/i18n/miftah-content.ts` (hi, ur, bn, ml, ar, id;
  extra features merged via `EXTRA` + `withExtra`). Pages `/miftah` and `/miftah/[lang]` with hreflang.
- CALIVO AI: `lib/calivo.ts` + `lib/i18n/calivo-content.ts` (en, hi, ur, ar).
- Shared component `components/LocalizedAppLanding.tsx`, strings `lib/landing-i18n.ts`, metadata `lib/i18n/app-landing.ts`.
- Keep every claim TRUE to the shipped app (Play production version), AI assistants quote it.
- `app/llms.txt/route.ts`: AI-assistant summary incl. Miftah feature lines and "Also relevant for" phrases.
- Miftah is fully FREE (no Premium) since Oct 2026 — optional Hadiya only; never write 'Premium' for Miftah. New features on the page: Understanding Qur'an, Makkah & Madinah Live, Madinah Mushaf script, Home cards.
- Blog: `lib/miftah-blog-posts.ts` (11 Islamic guides incl. 'understand-quran-arabic-most-frequent-words'; incl. khatam plan, hifz method, sunnah fasting, Noorani Qaida).

## 3. Other
- `public/pay/calivo.html` = CALIVO Razorpay checkout (must stay on aivexallp.com; Razorpay blocks unregistered domains).
- `app/(site)/miftah/impact.json/route.ts` reads `miftah_impact` table (madrasa fund) — edited from admin App Analytics.
- Miftah Juma Khutba admin/feed was built then removed (no official Haramain API; owner chose not to enter khutbas manually).
- Admin App Analytics: `app/admin/(panel)/app-analytics/page.tsx`, `app/admin/app-actions.ts`.
- Typecheck: `node_modules/.bin/tsc --noEmit -p .`

## 4. Unscroll family backend (Nov 2026)
- API for the Unscroll app at `/api/unscroll/v1/*` (catch-all route → `lib/unscroll/router.ts` → `lib/unscroll/handlers.ts`).
- PostgreSQL on the VPS via `pg` (`UNSCROLL_DATABASE_URL`), schema `db/unscroll/001_unscroll.sql`; push via FCM HTTP v1 (`lib/unscroll/push.ts`).
- Daily cron `POST /api/unscroll/cron/daily` (Bearer `UNSCROLL_CRON_SECRET`); health check `/api/unscroll/health`.
- Setup steps: `db/unscroll/README.md`.
- Website: landing `/unscroll` (+ `/unscroll/hi`) from `lib/unscroll-app.ts` + `lib/i18n/unscroll-content.ts`; privacy `/unscroll/privacy-policy`.
  Not on Play yet → `UNSCROLL_ON_PLAY=false` (shows "Coming soon") and `play: null` in `lib/product-lineup.ts`; flip both at launch.
- Payments: Razorpay subscriptions (`lib/unscroll/billing.ts`, plans + prices in PLANS, incl. GST). App → `POST /v1/billing/razorpay/checkout`
  → opens `/pay/unscroll.html` → Razorpay → `POST /api/unscroll/pay/return` (signature check, unlock) → `/pay/unscroll-done.html`.
  Renewals/cancellations via the shared webhook `/api/payments/razorpay-webhook` (notes.product = "unscroll").
  `UNSCROLL_UNLOCK_ALL=true` keeps everything free for testing; set false when paid plans go live.
- Admin App Analytics → Unscroll tab (`getUnscrollStats`): anonymous app opens (`POST /v1/app/ping` → unscroll_daily_active / unscroll_app_opens) + family/account counts.
- DB setup/upgrade on the VPS: `bash db/unscroll/setup-unscroll-db.sh` (DB "unscroll" inside the aivexa-db Supabase container, port 6002; re-run after SQL changes).
- Pairing: (a) QR — child phone `POST /v1/devices/pair-requests` → shows `unscroll://pair?code=…`, polls `/devices/pair-requests/:code/poll`; parent scans (Google code scanner) → `POST /v1/family/pair-requests/claim {code, name|childId}`. (b) 8-character code (alphabet without 0/O/1/I/L) — same format as the app.
