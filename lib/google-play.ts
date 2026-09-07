// SERVER-ONLY. Google Play Developer API (androidpublisher v3) client.
// Auth: service-account JSON from env GOOGLE_PLAY_SERVICE_ACCOUNT_JSON
// (raw JSON or base64). The key NEVER reaches the frontend, logs, or Git.
import crypto from "crypto";

const SCOPE = "https://www.googleapis.com/auth/androidpublisher";
const BASE = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications";
const UPLOAD_BASE = "https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications";

type ServiceAccount = { client_email: string; private_key: string; token_uri?: string };

function loadServiceAccount(): ServiceAccount {
  let raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_PLAY_SERVICE_ACCOUNT_JSON is not set");
  raw = raw.trim();
  if (!raw.startsWith("{")) raw = Buffer.from(raw, "base64").toString("utf8");
  const sa = JSON.parse(raw);
  if (!sa.client_email || !sa.private_key) throw new Error("Service account JSON missing fields");
  return sa;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

let cachedToken: { token: string; exp: number } | null = null;

export async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token;

  const sa = loadServiceAccount();
  const aud = sa.token_uri || "https://oauth2.googleapis.com/token";
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud, iat: now, exp: now + 3600 }));
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const sig = signer.sign(sa.private_key).toString("base64url");
  const assertion = `${header}.${claims}.${sig}`;

  const res = await fetch(aud, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token exchange failed: ${data.error_description || data.error || res.status}`);
  cachedToken = { token: data.access_token, exp: now + (data.expires_in || 3600) };
  return data.access_token;
}

async function api(method: string, path: string, body?: unknown) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE}/${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`Play API ${method} ${path} → ${res.status}: ${data?.error?.message || text.slice(0, 300)}`);
  return data;
}

export const playEdits = {
  insert: (pkg: string) => api("POST", `${pkg}/edits`),
  commit: (pkg: string, editId: string) =>
    api("POST", `${pkg}/edits/${editId}:commit?changesNotSentForReview=false`),
  validate: (pkg: string, editId: string) => api("POST", `${pkg}/edits/${editId}:validate`),
  delete: (pkg: string, editId: string) => api("DELETE", `${pkg}/edits/${editId}`).catch(() => null),
  updateListing: (pkg: string, editId: string, lang: string, listing: { title: string; shortDescription: string; fullDescription: string }) =>
    api("PUT", `${pkg}/edits/${editId}/listings/${lang}`, { language: lang, ...listing }),
  updateTrack: (pkg: string, editId: string, track: string, versionCode: number) =>
    api("PUT", `${pkg}/edits/${editId}/tracks/${track}`, {
      track,
      releases: [{ status: "completed", versionCodes: [String(versionCode)] }],
    }),
};

export async function uploadBundle(pkg: string, editId: string, aab: Buffer): Promise<{ versionCode: number }> {
  const token = await getAccessToken();
  const res = await fetch(`${UPLOAD_BASE}/${pkg}/edits/${editId}/bundles?uploadType=media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/octet-stream" },
    body: new Uint8Array(aab),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Bundle upload failed → ${res.status}: ${data?.error?.message || "unknown"}`);
  return { versionCode: Number(data.versionCode) };
}
