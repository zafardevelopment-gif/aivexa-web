# AIVEXA Web — Next.js + Supabase

AI-themed dynamic website for AIVEXA. All content (settings, products, how-it-works
steps, why-us cards, legal pages) is served from Supabase tables prefixed `aivexa_`,
with built-in fallback content so the site renders even before the database is wired up.

## Products

- **AI Munim** — WhatsApp accounting assistant
- **Clinic Voice** — AI voice receptionist for clinics (new)
- **AI Hospital** — appointment booking system
- **AI Camp** — event registration system

## Setup

1. **Supabase** — create a project at [supabase.com](https://supabase.com), open
   *SQL Editor* and run [`supabase/schema.sql`](supabase/schema.sql). This creates and
   seeds all `aivexa_` tables with RLS enabled (public read for content; insert-only
   for `aivexa_messages`).

2. **Env vars** — copy `.env.local.example` to `.env.local` and fill in
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (Supabase Dashboard → Project Settings → API).

3. **Run**

   ```bash
   npm install
   npm run dev      # http://localhost:3000
   npm run build    # production build
   ```

## Tables

| Table | Purpose |
|---|---|
| `aivexa_settings` | Site name, hero text, contact/legal details |
| `aivexa_products` | Product cards + detail pages (`/products/[slug]`) |
| `aivexa_steps` | "How It Works" section |
| `aivexa_why` | "Why AIVEXA" cards |
| `aivexa_pages` | Legal pages (`/privacy`, `/terms`, `/data-deletion`) |
| `aivexa_messages` | Contact form submissions |

Content edits in Supabase appear on the site within 60 seconds (ISR `revalidate = 60`).

## Deploy

Vercel is the easiest: import the repo, set the two env vars, deploy. Any Node host
(e.g. a Hostinger VPS) also works via `npm run build && npm start`.
