import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SUGGEST_HOSTS = [
  "https://suggestqueries-clients6.youtube.com/complete/search",
  "https://suggestqueries.google.com/complete/search",
];

async function fetchSuggestions(q: string, region: string): Promise<string[]> {
  const params = new URLSearchParams({
    client: "firefox",
    ds: "yt",
    gl: region,
    q,
  });
  for (const host of SUGGEST_HOSTS) {
    try {
      const res = await fetch(`${host}?${params}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        // cache identical queries for an hour
        next: { revalidate: 3600 },
      });
      if (!res.ok) continue;
      const data = JSON.parse(await res.text());
      if (Array.isArray(data?.[1])) return data[1] as string[];
    } catch {
      // try next host
    }
  }
  return [];
}

function clean(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[#"<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(req: NextRequest) {
  const query = clean(req.nextUrl.searchParams.get("q") ?? "");
  const region = (req.nextUrl.searchParams.get("gl") ?? "IN").slice(0, 2).toUpperCase();

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  // Fan out: base query + a-z / how / best style expansions (like rapidtags)
  const variants = [
    query,
    `${query} `,
    `how to ${query}`,
    `best ${query}`,
    `${query} tutorial`,
    `${query} for beginners`,
    `${query} 2026`,
    ...["a", "b", "c", "e", "i", "m", "s", "t", "v"].map((c) => `${query} ${c}`),
  ];

  const results = await Promise.all(
    variants.map((v) => fetchSuggestions(v, region))
  );

  const seen = new Set<string>();
  const tags: string[] = [query];
  seen.add(query);

  for (const list of results) {
    for (const raw of list) {
      const tag = clean(raw);
      if (!tag || seen.has(tag) || tag.length > 60) continue;
      seen.add(tag);
      tags.push(tag);
    }
  }

  return NextResponse.json({ query, tags: tags.slice(0, 45) });
}
