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
- Blog: `lib/miftah-blog-posts.ts` (10 Islamic guides incl. khatam plan, hifz method, sunnah fasting, Noorani Qaida).

## 3. Other
- `public/pay/calivo.html` = CALIVO Razorpay checkout (must stay on aivexallp.com; Razorpay blocks unregistered domains).
- `app/(site)/miftah/impact.json/route.ts` reads `miftah_impact` table (madrasa fund) — edited from admin App Analytics.
- Miftah Juma Khutba: table `miftah_khutbas` (supabase/migrations/004_miftah_khutbas.sql — run once in the SQL editor),
  admin page `app/admin/(panel)/khutba/page.tsx` + `app/admin/khutba-actions.ts` (sidebar "Miftah Khutba"),
  public JSON `app/(site)/miftah/khutba.json/route.ts` (list) and `app/(site)/miftah/khutba/[id]/route.ts` (full text).
  The app reads these; add each Friday's Makkah + Madinah khutba there.
- Admin App Analytics: `app/admin/(panel)/app-analytics/page.tsx`, `app/admin/app-actions.ts`.
- Typecheck: `node_modules/.bin/tsc --noEmit -p .`
