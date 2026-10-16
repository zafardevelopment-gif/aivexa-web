import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────
// Miftah › "Ask" search. The app sends the user's question (any language,
// typed or spoken). A free OpenRouter model ONLY turns it into search
// terms + Qur'an verse references — it never writes an answer. The app
// then shows real ayat (Quran.com) and real hadith (hadith-api) for those
// terms, and links to fatwa sites; nothing the model writes is shown as
// religious content.
//
// Server env (in .env.local on the VPS, never in the app):
//   OPENROUTER_API_KEY   required
//   MIFTAH_AI_MODELS     optional, comma list; default "openrouter/free"
// ─────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

const SYSTEM = `You convert a Muslim's question into search terms for the Qur'an and hadith collections.
Rules:
- Do NOT answer the question, do NOT give rulings or opinions, do NOT write any religious text.
- Output ONLY one JSON object, no prose, with exactly these keys:
  "topic_en": short English topic (max 6 words),
  "keywords_en": 2-6 English words/short phrases as used in Qur'an/hadith translations (e.g. "patience", "parents", "backbiting"),
  "keywords_ar": 1-4 Arabic words,
  "quran_refs": up to 8 Qur'an verse keys "surah:ayah" that are well known to be directly about this topic (only if you are confident; else []),
  "fatwa_query": the question shortened to a search query in the SAME language and script the user wrote.
- If the text is not a religious question, still return keywords for it.`;

type Ask = {
  topic_en: string;
  keywords_en: string[];
  keywords_ar: string[];
  quran_refs: string[];
  fatwa_query: string;
};

// Ayah counts per surah (1–114) to validate model output.
const AYAHS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];

function validRef(r: unknown): string | null {
  if (typeof r !== "string") return null;
  const m = r.trim().match(/^(\d{1,3}):(\d{1,3})$/);
  if (!m) return null;
  const s = Number(m[1]);
  const a = Number(m[2]);
  if (s < 1 || s > 114 || a < 1 || a > AYAHS[s - 1]) return null;
  return `${s}:${a}`;
}

const strList = (v: unknown, max: number) =>
  (Array.isArray(v) ? v : [])
    .filter((x) => typeof x === "string" && x.trim())
    .map((x) => (x as string).trim().slice(0, 60))
    .slice(0, max);

function clean(raw: Record<string, unknown>, q: string): Ask {
  return {
    topic_en: typeof raw.topic_en === "string" ? raw.topic_en.slice(0, 80) : "",
    keywords_en: strList(raw.keywords_en, 6),
    keywords_ar: strList(raw.keywords_ar, 4),
    quran_refs: [...new Set(strList(raw.quran_refs, 12).map(validRef).filter(Boolean) as string[])].slice(0, 8),
    fatwa_query: typeof raw.fatwa_query === "string" && raw.fatwa_query.trim() ? raw.fatwa_query.slice(0, 200) : q,
  };
}

function parseJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

// Small in-memory cache + per-IP limit (single PM2 process on the VPS).
const cache = new Map<string, { at: number; data: Ask }>();
const hits = new Map<string, number[]>();
const CACHE_MS = 7 * 24 * 3600 * 1000;
const LIMIT_PER_10MIN = 15;

function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 600_000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > LIMIT_PER_10MIN;
}

export async function POST(req: Request) {
  let q = "";
  try {
    const body = await req.json();
    q = typeof body?.q === "string" ? body.q.trim().slice(0, 400) : "";
  } catch {
    // ignore
  }
  if (q.length < 2) return NextResponse.json({ error: "empty" }, { status: 400 });

  const key = q.toLowerCase().replace(/\s+/g, " ");
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) return NextResponse.json({ ...cached.data, cached: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const models = (process.env.MIFTAH_AI_MODELS || "openrouter/free")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  for (const model of models) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 25_000);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://aivexallp.com/miftah",
          "X-Title": "Miftah",
        },
        body: JSON.stringify({
          model,
          temperature: 0,
          max_tokens: 400,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: q },
          ],
        }),
      });
      clearTimeout(timer);
      if (!res.ok) continue;
      const j = await res.json();
      const text: string = j?.choices?.[0]?.message?.content ?? "";
      const raw = parseJson(text);
      if (!raw) continue;
      const data = clean(raw, q);
      if (!data.keywords_en.length && !data.quran_refs.length) continue;
      cache.set(key, { at: Date.now(), data });
      if (cache.size > 3000) cache.delete(cache.keys().next().value as string);
      return NextResponse.json(data);
    } catch {
      // try the next model
    }
  }
  return NextResponse.json({ error: "ai_unavailable" }, { status: 502 });
}
