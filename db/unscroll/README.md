# Unscroll family backend — setup on the VPS

API: `https://www.aivexallp.com/api/unscroll/v1/*` (code: `lib/unscroll/`, route: `app/api/unscroll/v1/[...path]/route.ts`).
The Unscroll app points here via `API_BASE_URL=https://www.aivexallp.com/api/unscroll` in its `.env`.

## 1. Database (once)
```bash
sudo -u postgres psql -c "CREATE USER unscroll WITH PASSWORD 'CHOOSE_A_STRONG_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL ON DATABASE aivexa TO unscroll;"          # or your existing DB name
sudo -u postgres psql -d aivexa -c "GRANT ALL ON SCHEMA public TO unscroll;"
psql "postgres://unscroll:PASSWORD@127.0.0.1:5432/aivexa" -f db/unscroll/001_unscroll.sql
```
(Re-running the SQL file is safe.)

## 2. `.env.local` on the server
```
UNSCROLL_DATABASE_URL=postgres://unscroll:PASSWORD@127.0.0.1:5432/aivexa
UNSCROLL_CRON_SECRET=<long random string>
UNSCROLL_FCM_SERVICE_ACCOUNT_FILE=/var/www/aivexa-web/secrets/unscroll-firebase.json
UNSCROLL_UNLOCK_ALL=true
```
`RESEND_API_KEY` (already set for the store) sends the sign-in codes.

## 3. Firebase (push notifications)
1. console.firebase.google.com → Add project "Unscroll" → Add Android app, package `com.aivexallp.unscroll`.
2. Download `google-services.json` → put it in the app repo at `android/app/google-services.json`.
3. Project settings → Service accounts → Generate new private key → upload the JSON to the server
   at the path in `UNSCROLL_FCM_SERVICE_ACCOUNT_FILE` (chmod 600, never commit it).

## 4. Deploy
```bash
cd /var/www/aivexa-web && git pull && npm install && npm run build && pm2 restart aivexa-web-app --update-env
curl https://www.aivexallp.com/api/unscroll/health      # → {"ok":true,"db":true,...}
```

## 5. Daily summaries (crontab -e)
```
30 21 * * * curl -s -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" https://www.aivexallp.com/api/unscroll/cron/daily >/dev/null
```
Sends parents "Ali used the phone 1h less yesterday" style summaries and "phone not syncing" alerts.
