// Push every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver...).
// ChatGPT search and Copilot rely heavily on Bing's index, so this gets new pages
// into AI answers much faster. Run after each deploy:  node scripts/indexnow.mjs
const SITE = "https://www.aivexallp.com";
const KEY = "18f2e21c19ba5da36f7db7c0424eec12"; // must match public/18f2e21c19ba5da36f7db7c0424eec12.txt

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urls.length) { console.error("No URLs found in sitemap"); process.exit(1); }

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(0, 10000) }),
});
console.log(`IndexNow: submitted ${urls.length} URLs → HTTP ${res.status} ${res.status === 200 || res.status === 202 ? "(accepted)" : await res.text()}`);
