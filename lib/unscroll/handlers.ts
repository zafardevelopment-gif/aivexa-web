import { randomBytes } from "crypto";
import { one, q, tx } from "./db";
import { HttpError, body, int, noContent, ok, str } from "./http";
import { issueSession, newDeviceToken, normalisePairing, pairingCode8, refreshSession, requireDevice, requireParent, requireUser, sha256, sixDigits, type UserRow } from "./auth";
import { sendCodeEmail } from "./email";
import { createAlert } from "./alerts";
import { pushToChild } from "./push";
import { emptyRules, familyTimeZone, loadRules, sanitizeRules, saveRules } from "./rules";
import { dayKeyIn, fmtDuration } from "./time";
import { cancelAtPeriodEnd, isPlanKey, publicPlans, startCheckout } from "./billing";

type Params = Record<string, string>;
type H = (req: Request, p: Params, url: URL) => Promise<Response>;

/* ---------- small in-memory rate limiter (per process) ---------- */
const hits = new Map<string, number[]>();
function limit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  if (arr.length >= max) throw new HttpError(429, "Too many attempts. Please wait a few minutes.");
  arr.push(now);
  hits.set(key, arr);
}
const ip = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";

const profile = (u: UserRow) => ({
  id: u.id,
  displayName: u.display_name || u.email.split("@")[0],
  email: u.email,
  familyId: u.family_id,
  role: u.role,
});

async function ownChild(familyId: string, childId: string) {
  const c = await one<{ id: string; name: string }>(`SELECT id, name FROM unscroll_children WHERE id = $1 AND family_id = $2`, [childId, familyId]);
  if (!c) throw new HttpError(404, "Child not found");
  return c;
}

const reqRow = (r: { id: string; child_id: string; child_name: string; package_name: string; label: string; minutes: number; reason: string | null; created_at: Date; status: string }) => ({
  id: r.id, childId: r.child_id, childName: r.child_name, packageName: r.package_name, label: r.label,
  minutes: r.minutes, reason: r.reason, createdAtMs: new Date(r.created_at).getTime(), status: r.status,
});

/* ================= Auth ================= */

const startEmail: H = async req => {
  const b = await body<{ email?: string }>(req);
  const email = str(b.email, "email", 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Enter a valid email address");
  limit(`email:${email}`, 5, 60 * 60_000);
  limit(`emailip:${ip(req)}`, 20, 60 * 60_000);
  // Google Play review account: reviewers cannot read our sign-in emails, so this one
  // address signs in with a fixed code set on the server (both env vars must be set).
  const reviewEmail = (process.env.UNSCROLL_REVIEW_EMAIL ?? "").trim().toLowerCase();
  const reviewCode = (process.env.UNSCROLL_REVIEW_CODE ?? "").replace(/\D/g, "");
  const isReview = !!reviewEmail && reviewCode.length === 6 && email === reviewEmail;
  const code = isReview ? reviewCode : sixDigits();
  const row = await one<{ id: string }>(
    `INSERT INTO unscroll_email_challenges (email, code_hash, expires_at) VALUES ($1, $2, now() + interval '10 minutes') RETURNING id`,
    [email, sha256(`${email}:${code}`)],
  );
  if (isReview) return ok({ challengeId: row!.id });
  try {
    await sendCodeEmail(email, code);
  } catch (e) {
    console.error("[unscroll] email", e);
    throw new HttpError(502, "Could not send the email. Please try again.");
  }
  return ok({ challengeId: row!.id });
};

const verifyEmail: H = async req => {
  const b = await body<{ challengeId?: string; code?: string }>(req);
  const id = str(b.challengeId, "challengeId", 64);
  const code = str(b.code, "code", 12).replace(/\D/g, "");
  limit(`verify:${id}`, 8, 15 * 60_000);
  const c = await one<{ email: string; code_hash: string; attempts: number }>(
    `UPDATE unscroll_email_challenges SET attempts = attempts + 1
     WHERE id = $1 AND used_at IS NULL AND expires_at > now() AND attempts < 5
     RETURNING email, code_hash, attempts`,
    [id],
  );
  if (!c) throw new HttpError(400, "This code has expired. Ask for a new one.");
  if (sha256(`${c.email}:${code}`) !== c.code_hash) throw new HttpError(400, "That code is not right");
  await q(`UPDATE unscroll_email_challenges SET used_at = now() WHERE id = $1`, [id]);
  const user = await tx(async c2 => {
    const u = (await c2.query<UserRow>(
      `INSERT INTO unscroll_users (email, last_seen_at) VALUES ($1, now())
       ON CONFLICT (email) DO UPDATE SET last_seen_at = now()
       RETURNING id, email, display_name, role, family_id`, [c.email])).rows[0];
    if (!u.family_id) {
      const f = (await c2.query<{ id: string }>(`INSERT INTO unscroll_families (owner_id) VALUES ($1) RETURNING id`, [u.id])).rows[0];
      await c2.query(`UPDATE unscroll_users SET family_id = $1, role = 'parent' WHERE id = $2`, [f.id, u.id]);
      return { ...u, family_id: f.id, role: "parent" as const };
    }
    return u;
  });
  return ok({ tokens: await issueSession(user.id), user: profile(user) });
};

const refresh: H = async req => {
  const b = await body<{ refreshToken?: string }>(req);
  return ok({ tokens: await refreshSession(str(b.refreshToken, "refreshToken", 200)) });
};

const signOut: H = async req => {
  const u = await requireUser(req);
  await q(`UPDATE unscroll_sessions SET revoked_at = now() WHERE id = $1`, [u.sessionId]);
  return noContent();
};

/* ================= Me ================= */

const me: H = async req => ok(profile(await requireUser(req)));

const updateMe: H = async req => {
  const u = await requireUser(req);
  const b = await body<{ displayName?: string; timeZone?: string }>(req);
  if (typeof b.displayName === "string") await q(`UPDATE unscroll_users SET display_name = $1 WHERE id = $2`, [b.displayName.trim().slice(0, 60), u.id]);
  if (typeof b.timeZone === "string" && u.family_id) {
    try { new Intl.DateTimeFormat("en", { timeZone: b.timeZone }); await q(`UPDATE unscroll_families SET time_zone = $1 WHERE id = $2`, [b.timeZone, u.family_id]); } catch { /* unknown tz */ }
  }
  return ok(profile((await one<UserRow>(`SELECT id, email, display_name, role, family_id FROM unscroll_users WHERE id = $1`, [u.id]))!));
};

const deleteMe: H = async req => {
  const u = await requireUser(req);
  await tx(async c => {
    await c.query(`DELETE FROM unscroll_families WHERE owner_id = $1`, [u.id]);
    await c.query(`DELETE FROM unscroll_users WHERE id = $1`, [u.id]);
  });
  return noContent();
};

const deleteUsage: H = async req => {
  const u = await requireParent(req);
  await q(`DELETE FROM unscroll_usage_days WHERE child_id IN (SELECT id FROM unscroll_children WHERE family_id = $1)`, [u.family_id]);
  return noContent();
};

const exportMe: H = async req => {
  const u = await requireUser(req);
  console.info("[unscroll] data export requested", u.id);
  return ok({ requestId: randomBytes(8).toString("hex") });
};

const userPushToken: H = async req => {
  const u = await requireUser(req);
  const b = await body<{ token?: string; platform?: string }>(req);
  const t = str(b.token, "token", 4096);
  await q(`INSERT INTO unscroll_push_tokens (token, user_id, device_id, platform, updated_at) VALUES ($1, $2, NULL, $3, now())
           ON CONFLICT (token) DO UPDATE SET user_id = $2, device_id = NULL, updated_at = now()`, [t, u.id, b.platform === "ios" ? "ios" : "android"]);
  return noContent();
};

/* ================= Family (parent) ================= */

const listChildren: H = async req => {
  const u = await requireParent(req);
  const rows = await q<{ id: string; name: string; birth_year: number | null; device_id: string | null; model: string | null; last_sync_at: Date | null; guard_running: boolean | null }>(
    `SELECT c.id, c.name, c.birth_year, d.id AS device_id, d.model, d.last_sync_at, d.guard_running
     FROM unscroll_children c
     LEFT JOIN LATERAL (SELECT * FROM unscroll_devices WHERE child_id = c.id AND revoked_at IS NULL ORDER BY created_at DESC LIMIT 1) d ON true
     WHERE c.family_id = $1 ORDER BY c.created_at`, [u.family_id]);
  return ok(rows.map(r => ({
    id: r.id, name: r.name, birthYear: r.birth_year,
    device: r.device_id ? { id: r.device_id, model: r.model ?? "", lastSyncMs: r.last_sync_at ? new Date(r.last_sync_at).getTime() : null, guardRunning: r.guard_running } : null,
  })));
};

const createChild: H = async req => {
  const u = await requireParent(req);
  const b = await body<{ name?: string; birthYear?: number | null }>(req);
  const name = str(b.name, "name", 40);
  const birthYear = b.birthYear == null ? null : int(b.birthYear, "birthYear", 1990, new Date().getFullYear());
  const n = await one<{ n: string }>(`SELECT count(*) AS n FROM unscroll_children WHERE family_id = $1`, [u.family_id]);
  if (Number(n?.n ?? 0) >= 5) throw new HttpError(409, "A family can have up to 5 children");
  const c = await one<{ id: string }>(`INSERT INTO unscroll_children (family_id, name, birth_year) VALUES ($1, $2, $3) RETURNING id`, [u.family_id, name, birthYear]);
  await saveRules(c!.id, emptyRules(), null);
  return ok({ id: c!.id, name, birthYear, device: null }, 201);
};

const removeChild: H = async (req, p) => {
  const u = await requireParent(req);
  await ownChild(u.family_id, p.childId);
  await q(`DELETE FROM unscroll_children WHERE id = $1`, [p.childId]);
  return noContent();
};

const pairingCode: H = async (req, p) => {
  const u = await requireParent(req);
  await ownChild(u.family_id, p.childId);
  await q(`DELETE FROM unscroll_pairing_codes WHERE child_id = $1 OR expires_at < now() - interval '1 day'`, [p.childId]);
  for (let i = 0; i < 5; i++) {
    const code = pairingCode8();
    const row = await one<{ expires_at: Date }>(
      `INSERT INTO unscroll_pairing_codes (code, child_id, expires_at) VALUES ($1, $2, now() + interval '15 minutes')
       ON CONFLICT (code) DO NOTHING RETURNING expires_at`, [code, p.childId]);
    if (row) return ok({ code, expiresAtMs: new Date(row.expires_at).getTime() }, 201);
  }
  throw new HttpError(503, "Please try again");
};

const childUsage: H = async (req, p, url) => {
  const u = await requireParent(req);
  await ownChild(u.family_id, p.childId);
  const from = url.searchParams.get("from") ?? "0000-00-00";
  const to = url.searchParams.get("to") ?? "9999-99-99";
  const rows = await q<{ day_key: string; total_ms: string; unlocks: number | null; apps: unknown[] }>(
    `SELECT day_key, total_ms, unlocks, apps FROM unscroll_usage_days WHERE child_id = $1 AND day_key BETWEEN $2 AND $3 ORDER BY day_key`,
    [p.childId, from, to]);
  return ok({ childId: p.childId, source: "server", days: rows.map(r => ({ dayKey: r.day_key, totalMs: Number(r.total_ms), unlocks: r.unlocks, apps: r.apps, source: "server" })) });
};

const getChildRules: H = async (req, p) => {
  const u = await requireParent(req);
  await ownChild(u.family_id, p.childId);
  const { today: _t, ...payload } = await loadRules(p.childId, u.family_id);
  return ok(payload);
};

const putChildRules: H = async (req, p) => {
  const u = await requireParent(req);
  const child = await ownChild(u.family_id, p.childId);
  const b = await body<{ rules?: unknown }>(req);
  const rules = sanitizeRules(b.rules);
  const today = dayKeyIn(await familyTimeZone(u.family_id));
  await saveRules(p.childId, rules, Object.keys(rules.bonusMinutes).length ? today : null);
  void pushToChild(p.childId, { title: "Your rules were updated", body: `A parent changed ${child.name}'s screen-time rules.`, data: { type: "rules_updated" } });
  const { today: _t, ...payload } = await loadRules(p.childId, u.family_id);
  return ok(payload);
};

const listRequests: H = async req => {
  const u = await requireParent(req);
  const rows = await q<Parameters<typeof reqRow>[0]>(
    `SELECT r.*, c.name AS child_name FROM unscroll_extra_time_requests r JOIN unscroll_children c ON c.id = r.child_id
     WHERE c.family_id = $1 ORDER BY r.created_at DESC LIMIT 50`, [u.family_id]);
  return ok(rows.map(reqRow));
};

const decideRequest: H = async (req, p) => {
  const u = await requireParent(req);
  const b = await body<{ approve?: boolean; minutes?: number }>(req);
  const r = await one<Parameters<typeof reqRow>[0]>(
    `SELECT r.*, c.name AS child_name FROM unscroll_extra_time_requests r JOIN unscroll_children c ON c.id = r.child_id
     WHERE r.id = $1 AND c.family_id = $2`, [p.requestId, u.family_id]);
  if (!r) throw new HttpError(404, "Request not found");
  if (r.status !== "pending") throw new HttpError(409, "This request was already answered");
  const approve = b.approve === true;
  const minutes = approve ? int(b.minutes ?? r.minutes, "minutes", 1, 600) : 0;
  await q(`UPDATE unscroll_extra_time_requests SET status = $1, granted_minutes = $2, decided_at = now() WHERE id = $3`,
    [approve ? "approved" : "denied", approve ? minutes : null, r.id]);
  if (approve) {
    const { rules, today } = await loadRules(r.child_id, u.family_id);
    rules.bonusMinutes[r.package_name] = (rules.bonusMinutes[r.package_name] ?? 0) + minutes;
    await saveRules(r.child_id, rules, today);
  }
  void pushToChild(r.child_id, approve
    ? { title: "Extra time approved", body: `+${minutes} min for ${r.label} today.`, data: { type: "rules_updated" } }
    : { title: "Request not approved", body: `No extra time for ${r.label} right now.`, data: { type: "request_denied" } });
  return ok(reqRow({ ...r, status: approve ? "approved" : "denied", minutes: approve ? minutes : r.minutes }));
};

const listAlerts: H = async req => {
  const u = await requireParent(req);
  const rows = await q<{ id: string; child_id: string | null; kind: string; title: string; body: string; read: boolean; created_at: Date }>(
    `SELECT id, child_id, kind, title, body, read, created_at FROM unscroll_alerts WHERE family_id = $1 ORDER BY created_at DESC LIMIT 100`, [u.family_id]);
  await q(`UPDATE unscroll_alerts SET read = true WHERE family_id = $1 AND read = false`, [u.family_id]);
  return ok(rows.map(a => ({ id: a.id, childId: a.child_id ?? "", kind: a.kind, title: a.title, body: a.body, read: a.read, createdAtMs: new Date(a.created_at).getTime() })));
};

/* ================= Child device ================= */

const pairDevice: H = async req => {
  limit(`pair:${ip(req)}`, 10, 10 * 60_000);
  const b = await body<{ code?: string; device?: { model?: string; os?: string; appVersion?: string } }>(req);
  const code = normalisePairing(str(b.code, "code", 40));
  const token = newDeviceToken();
  const result = await tx(async c => {
    const pc = (await c.query<{ child_id: string }>(
      `UPDATE unscroll_pairing_codes SET used_at = now() WHERE code = $1 AND used_at IS NULL AND expires_at > now() RETURNING child_id`, [code])).rows[0];
    if (!pc) throw new HttpError(400, "That code is wrong or has expired. Ask your parent for a new one.");
    const child = (await c.query<{ id: string; name: string; family_id: string }>(`SELECT id, name, family_id FROM unscroll_children WHERE id = $1`, [pc.child_id])).rows[0];
    await c.query(`UPDATE unscroll_devices SET revoked_at = now() WHERE child_id = $1 AND revoked_at IS NULL`, [child.id]);
    await c.query(`INSERT INTO unscroll_devices (child_id, token_hash, model, os, app_version, last_sync_at) VALUES ($1, $2, $3, $4, $5, now())`,
      [child.id, sha256(token), String(b.device?.model ?? "").slice(0, 80), String(b.device?.os ?? "android").slice(0, 20), String(b.device?.appVersion ?? "").slice(0, 20)]);
    return child;
  });
  await createAlert({ familyId: result.family_id, childId: result.id, kind: "device_paired", title: `${result.name}'s phone is connected`, body: "You can now set limits and see usage from your phone." });
  return ok({ familyId: result.family_id, childId: result.id, childName: result.name, deviceToken: token });
};

/* ---------- QR pairing: child shows a QR, parent scans it ---------- */

let pairTableReady = false;
async function ensurePairTable() {
  if (pairTableReady) return;
  await q(`CREATE TABLE IF NOT EXISTS unscroll_pair_requests (
    code text PRIMARY KEY, secret_hash text NOT NULL, model text NOT NULL DEFAULT '', os text NOT NULL DEFAULT 'android',
    app_version text NOT NULL DEFAULT '', child_id uuid REFERENCES unscroll_children(id) ON DELETE CASCADE, device_token text,
    claimed_at timestamptz, delivered_at timestamptz, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`);
  pairTableReady = true;
}

/** Child phone: start a QR pairing request. The QR shows `code`; `secret` stays on the child phone. */
const createPairRequest: H = async req => {
  limit(`pairreq:${ip(req)}`, 20, 10 * 60_000);
  await ensurePairTable();
  const b = await body<{ device?: { model?: string; os?: string; appVersion?: string } }>(req);
  const secret = randomBytes(24).toString("base64url");
  await q(`DELETE FROM unscroll_pair_requests WHERE expires_at < now() - interval '1 day'`);
  for (let i = 0; i < 5; i++) {
    const code = pairingCode8() + pairingCode8();
    const row = await one<{ expires_at: Date }>(
      `INSERT INTO unscroll_pair_requests (code, secret_hash, model, os, app_version, expires_at) VALUES ($1, $2, $3, $4, $5, now() + interval '15 minutes')
       ON CONFLICT (code) DO NOTHING RETURNING expires_at`,
      [code, sha256(secret), String(b.device?.model ?? "").slice(0, 80), String(b.device?.os ?? "android").slice(0, 20), String(b.device?.appVersion ?? "").slice(0, 20)]);
    if (row) return ok({ code, secret, qr: `unscroll://pair?code=${code}`, expiresAtMs: new Date(row.expires_at).getTime() }, 201);
  }
  throw new HttpError(503, "Please try again");
};

/** Child phone: poll until the parent has scanned. Returns the device credential exactly once. */
const pollPairRequest: H = async (req, p) => {
  limit(`pairpoll:${ip(req)}`, 400, 10 * 60_000);
  await ensurePairTable();
  const b = await body<{ secret?: string }>(req);
  const secret = str(b.secret, "secret", 100);
  const r = await one<{ code: string; secret_hash: string; child_id: string | null; device_token: string | null; expires_at: Date; delivered_at: Date | null }>(
    `SELECT code, secret_hash, child_id, device_token, expires_at, delivered_at FROM unscroll_pair_requests WHERE code = $1`, [normalisePairing(p.code)]);
  if (!r || r.secret_hash !== sha256(secret)) throw new HttpError(404, "Not found");
  if (!r.child_id) {
    if (new Date(r.expires_at).getTime() < Date.now()) return ok({ status: "expired" });
    return ok({ status: "waiting" });
  }
  if (!r.device_token) return ok({ status: "done" });
  const child = await one<{ id: string; name: string; family_id: string }>(`SELECT id, name, family_id FROM unscroll_children WHERE id = $1`, [r.child_id]);
  if (!child) throw new HttpError(404, "Not found");
  await q(`UPDATE unscroll_pair_requests SET device_token = NULL, delivered_at = now() WHERE code = $1`, [r.code]);
  return ok({ status: "paired", claim: { familyId: child.family_id, childId: child.id, childName: child.name, deviceToken: r.device_token } });
};

/** Parent: scanned the child's QR. Links that phone to an existing child, or creates the child. */
const claimPairRequest: H = async req => {
  const u = await requireParent(req);
  await ensurePairTable();
  const b = await body<{ code?: string; childId?: string | null; name?: string | null }>(req);
  let code = str(b.code, "code", 200);
  const m = /code=([0-9A-Za-z-]+)/.exec(code);
  if (m) code = m[1];
  code = normalisePairing(code);
  const token = newDeviceToken();
  const child = await tx(async c => {
    const r = (await c.query<{ code: string; model: string; os: string; app_version: string }>(
      `SELECT code, model, os, app_version FROM unscroll_pair_requests WHERE code = $1 AND child_id IS NULL AND expires_at > now() FOR UPDATE`, [code])).rows[0];
    if (!r) throw new HttpError(400, "This QR code has expired or was already used. Open Unscroll on your child's phone for a new one.");
    let ch: { id: string; name: string; family_id: string } | undefined;
    if (b.childId) {
      ch = (await c.query<{ id: string; name: string; family_id: string }>(`SELECT id, name, family_id FROM unscroll_children WHERE id = $1 AND family_id = $2`, [b.childId, u.family_id])).rows[0];
      if (!ch) throw new HttpError(404, "Child not found");
    } else {
      const name = str(b.name, "name", 40);
      const n = (await c.query<{ n: string }>(`SELECT count(*) AS n FROM unscroll_children WHERE family_id = $1`, [u.family_id])).rows[0];
      if (Number(n?.n ?? 0) >= 5) throw new HttpError(409, "A family can have up to 5 children");
      ch = (await c.query<{ id: string; name: string; family_id: string }>(`INSERT INTO unscroll_children (family_id, name) VALUES ($1, $2) RETURNING id, name, family_id`, [u.family_id, name])).rows[0];
    }
    if (!ch) throw new HttpError(500, "Could not create the child");
    await c.query(`UPDATE unscroll_devices SET revoked_at = now() WHERE child_id = $1 AND revoked_at IS NULL`, [ch.id]);
    await c.query(`INSERT INTO unscroll_devices (child_id, token_hash, model, os, app_version, last_sync_at) VALUES ($1, $2, $3, $4, $5, now())`,
      [ch.id, sha256(token), r.model, r.os, r.app_version]);
    await c.query(`UPDATE unscroll_pair_requests SET child_id = $2, device_token = $3, claimed_at = now() WHERE code = $1`, [r.code, ch.id, token]);
    return ch;
  });
  if (!(await one(`SELECT 1 FROM unscroll_rules WHERE child_id = $1`, [child.id]))) await saveRules(child.id, emptyRules(), null);
  await createAlert({ familyId: child.family_id, childId: child.id, kind: "device_paired", title: `${child.name}'s phone is connected`, body: "You can now set limits and see usage from your phone." });
  return ok({ childId: child.id, childName: child.name });
};

const deviceRules: H = async req => {
  const d = await requireDevice(req);
  await q(`UPDATE unscroll_devices SET last_sync_at = now() WHERE id = $1`, [d.deviceId]);
  const { today: _t, ...payload } = await loadRules(d.childId, d.familyId);
  return ok(payload);
};

interface DayIn { dayKey: string; totalMs: number; unlocks: number | null; apps: Array<{ packageName: string; label: string; category?: string; foregroundMs: number; launches?: number; hourlyMs?: number[] }> }

const uploadUsage: H = async req => {
  const d = await requireDevice(req);
  const b = await body<{ days?: DayIn[] }>(req);
  const days = (Array.isArray(b.days) ? b.days : []).filter(x => x && /^\d{4}-\d{2}-\d{2}$/.test(x.dayKey)).slice(-14);
  for (const day of days) {
    const apps = (Array.isArray(day.apps) ? day.apps : []).slice(0, 300).map(a => ({
      packageName: String(a.packageName).slice(0, 200), label: String(a.label ?? a.packageName).slice(0, 100), category: String(a.category ?? "other").slice(0, 20),
      foregroundMs: Math.max(0, Number(a.foregroundMs) || 0), launches: Math.max(0, Number(a.launches) || 0),
      hourlyMs: Array.isArray(a.hourlyMs) ? a.hourlyMs.slice(0, 24).map(n => Math.max(0, Number(n) || 0)) : [],
    }));
    await q(
      `INSERT INTO unscroll_usage_days (child_id, day_key, total_ms, unlocks, apps, source, updated_at) VALUES ($1, $2, $3, $4, $5, 'server', now())
       ON CONFLICT (child_id, day_key) DO UPDATE SET total_ms = EXCLUDED.total_ms, unlocks = EXCLUDED.unlocks, apps = EXCLUDED.apps, updated_at = now()`,
      [d.childId, day.dayKey, Math.max(0, Math.round(Number(day.totalMs) || 0)), day.unlocks == null ? null : Math.round(Number(day.unlocks)), JSON.stringify(apps)]);
  }
  await q(`UPDATE unscroll_devices SET last_sync_at = now() WHERE id = $1`, [d.deviceId]);
  await limitAlerts(d.childId, d.childName, d.familyId, days);
  return noContent();
};

/** "Limit reached" alerts for today's upload (once per app per day). */
async function limitAlerts(childId: string, childName: string, familyId: string, days: DayIn[]) {
  const { rules, today } = await loadRules(childId, familyId);
  const day = days.find(x => x.dayKey === today);
  if (!day) return;
  for (const l of rules.appLimits) {
    const used = day.apps.find(a => a.packageName === l.packageName)?.foregroundMs ?? 0;
    const limitMs = (l.dailyLimitMinutes + (rules.bonusMinutes[l.packageName] ?? 0)) * 60_000;
    if (used >= limitMs) {
      await createAlert({ familyId, childId, kind: "limit_reached", title: `${childName} reached the ${l.label} limit`,
        body: `${fmtDuration(used)} on ${l.label} today (limit ${fmtDuration(limitMs)}). ${rules.mode === "strict" ? "It is paused until tomorrow." : "This was a reminder only."}`,
        dedupeKey: `limit:${childId}:${today}:${l.packageName}` });
    }
  }
  if (rules.dailyLimitMinutes && day.totalMs >= rules.dailyLimitMinutes * 60_000) {
    await createAlert({ familyId, childId, kind: "limit_reached", title: `${childName} reached today's screen-time limit`,
      body: `${fmtDuration(day.totalMs)} of screen time today.`, dedupeKey: `daily:${childId}:${today}` });
  }
}

const deviceStatus: H = async req => {
  const d = await requireDevice(req);
  const b = await body<{ guardRunning?: boolean; permissions?: Record<string, boolean> }>(req);
  const perms = b.permissions && typeof b.permissions === "object" ? b.permissions : {};
  await q(`UPDATE unscroll_devices SET guard_running = $1, permissions = $2, last_sync_at = now() WHERE id = $3`,
    [typeof b.guardRunning === "boolean" ? b.guardRunning : null, JSON.stringify(perms), d.deviceId]);
  const today = dayKeyIn(await familyTimeZone(d.familyId));
  const off = Object.entries(perms).filter(([, v]) => v === false).map(([k]) => k);
  if (off.includes("uninstallProtection")) {
    await createAlert({ familyId: d.familyId, childId: d.childId, kind: "permission_removed", title: `Uninstall protection is off on ${d.childName}'s phone`,
      body: "Unscroll could be uninstalled. Ask to switch it back on from the banner in Unscroll on the phone.",
      dedupeKey: `admin:${d.childId}:${today}` });
  }
  if (off.includes("usageAccess") || off.includes("overlay") || b.guardRunning === false) {
    await createAlert({ familyId: d.familyId, childId: d.childId, kind: "permission_removed", title: `Check ${d.childName}'s phone`,
      body: b.guardRunning === false ? "Unscroll's protection is not running on the phone." : "A permission Unscroll needs was switched off on the phone.",
      dedupeKey: `perm:${d.childId}:${today}` });
  }
  return noContent();
};

const childRequest: H = async req => {
  const d = await requireDevice(req);
  limit(`req:${d.deviceId}`, 20, 60 * 60_000);
  const b = await body<{ packageName?: string; label?: string; minutes?: number; reason?: string | null }>(req);
  const packageName = str(b.packageName, "packageName", 200);
  const label = str(b.label ?? packageName, "label", 100);
  const minutes = int(b.minutes, "minutes", 5, 240);
  const reason = typeof b.reason === "string" && b.reason.trim() ? b.reason.trim().slice(0, 300) : null;
  const r = await one<Parameters<typeof reqRow>[0]>(
    `INSERT INTO unscroll_extra_time_requests (child_id, package_name, label, minutes, reason) VALUES ($1, $2, $3, $4, $5)
     RETURNING *, $6::text AS child_name`, [d.childId, packageName, label, minutes, reason, d.childName]);
  await createAlert({ familyId: d.familyId, childId: d.childId, kind: "extra_time_request", title: `${d.childName} asks for ${minutes} more minutes`,
    body: `${label}${reason ? ` — “${reason}”` : ""}. Open Unscroll to approve or decline.` });
  return ok(reqRow(r!), 201);
};

const childRequests: H = async req => {
  const d = await requireDevice(req);
  const rows = await q<Parameters<typeof reqRow>[0]>(
    `SELECT r.*, $2::text AS child_name FROM unscroll_extra_time_requests r WHERE r.child_id = $1 ORDER BY r.created_at DESC LIMIT 20`, [d.childId, d.childName]);
  return ok(rows.map(reqRow));
};

const devicePushToken: H = async req => {
  const d = await requireDevice(req);
  const b = await body<{ token?: string; platform?: string }>(req);
  const t = str(b.token, "token", 4096);
  await q(`INSERT INTO unscroll_push_tokens (token, user_id, device_id, platform, updated_at) VALUES ($1, NULL, $2, $3, now())
           ON CONFLICT (token) DO UPDATE SET user_id = NULL, device_id = $2, updated_at = now()`, [t, d.deviceId, b.platform === "ios" ? "ios" : "android"]);
  return noContent();
};

/* ================= Subscription & insights ================= */

const subscription: H = async req => {
  const u = await requireUser(req);
  const s = await one<{ tier: string; status: string; expires_at: Date | null; verified_at: Date | null; plan_key: string | null; cancel_at_period_end: boolean | null; provider: string | null }>(
    `SELECT tier, status, expires_at, verified_at, plan_key, cancel_at_period_end, provider FROM unscroll_subscriptions WHERE user_id = $1`, [u.id]);
  const paidActive = !!s && s.status === "active" && (!s.expires_at || new Date(s.expires_at).getTime() > Date.now());
  const extra = { planKey: s?.plan_key ?? null, cancelAtPeriodEnd: !!s?.cancel_at_period_end, provider: s?.provider ?? null, paid: paidActive };
  // Owner build: everything unlocked until paid plans are switched on (UNSCROLL_UNLOCK_ALL=false).
  if (process.env.UNSCROLL_UNLOCK_ALL !== "false" && !paidActive) {
    return ok({ tier: "family_premium", status: "active", expiresAtMs: null, verifiedAtMs: Date.now(), ...extra });
  }
  if (!s || !paidActive) {
    return ok({ tier: "free", status: s?.expires_at ? "expired" : "none", expiresAtMs: s?.expires_at ? new Date(s.expires_at).getTime() : null, verifiedAtMs: Date.now(), ...extra });
  }
  return ok({ tier: s.tier, status: "active", expiresAtMs: s.expires_at ? new Date(s.expires_at).getTime() : null, verifiedAtMs: Date.now(), ...extra });
};

const billingPlans: H = async () => ok({ plans: await publicPlans() });

const razorpayCheckout: H = async req => {
  const u = await requireUser(req);
  const b = await body<{ plan?: string }>(req);
  if (!isPlanKey(b.plan)) throw new HttpError(400, "Choose a valid plan");
  limit(`checkout:${u.id}`, 10, 60 * 60_000);
  return ok(await startCheckout({ id: u.id, email: u.email }, b.plan));
};

const razorpayCancel: H = async req => {
  const u = await requireUser(req);
  await cancelAtPeriodEnd(u.id);
  return noContent();
};

const verifyPurchase: H = async req => {
  await requireUser(req);
  throw new HttpError(501, "In-app purchases are not enabled yet");
};

const weeklyInsights: H = async req => {
  await requireUser(req);
  return ok({ items: [] });
};

/* ================= Anonymous app-open ping (admin analytics) ================= */

/** Counts an app open at most once per 15 minutes per install. No account, no personal data. */
const appPing: H = async req => {
  const b = await body<{ installId?: string; mode?: string; version?: string }>(req);
  const installId = str(b.installId, "installId", 64);
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(installId)) throw new HttpError(400, "Invalid installId");
  const mode = b.mode === "parent" || b.mode === "child" ? b.mode : "individual";
  const version = typeof b.version === "string" ? b.version.slice(0, 20) : null;
  limit(`ping:${ip(req)}`, 120, 60 * 60_000);
  const day = dayKeyIn("Asia/Kolkata");
  const row = await one<{ counted: boolean }>(
    `INSERT INTO unscroll_daily_active (install_id, day, mode, app_version)
       VALUES ($1, $2::date, $3, $4)
     ON CONFLICT (install_id, day) DO UPDATE SET
       mode = EXCLUDED.mode,
       app_version = COALESCE(EXCLUDED.app_version, unscroll_daily_active.app_version),
       opens = unscroll_daily_active.opens + CASE WHEN unscroll_daily_active.last_at < now() - interval '15 minutes' THEN 1 ELSE 0 END,
       last_at = CASE WHEN unscroll_daily_active.last_at < now() - interval '15 minutes' THEN now() ELSE unscroll_daily_active.last_at END
     RETURNING (last_at = now()) AS counted`,
    [installId, day, mode, version],
  );
  if (row?.counted) await q(`INSERT INTO unscroll_app_opens (install_id) VALUES ($1)`, [installId]);
  return noContent();
};

/* ================= Route table ================= */

export const routes: Array<[method: string, pattern: string, handler: H]> = [
  ["POST", "auth/email/start", startEmail],
  ["POST", "auth/email/verify", verifyEmail],
  ["POST", "auth/refresh", refresh],
  ["POST", "auth/sign-out", signOut],
  ["GET", "me", me],
  ["PATCH", "me", updateMe],
  ["DELETE", "me", deleteMe],
  ["POST", "me/export", exportMe],
  ["DELETE", "me/usage", deleteUsage],
  ["POST", "me/push-token", userPushToken],
  ["GET", "family/children", listChildren],
  ["POST", "family/children", createChild],
  ["DELETE", "family/children/:childId", removeChild],
  ["POST", "family/children/:childId/pairing-codes", pairingCode],
  ["GET", "family/children/:childId/usage", childUsage],
  ["GET", "family/children/:childId/rules", getChildRules],
  ["PUT", "family/children/:childId/rules", putChildRules],
  ["GET", "family/extra-time-requests", listRequests],
  ["POST", "family/extra-time-requests/:requestId/decision", decideRequest],
  ["GET", "family/alerts", listAlerts],
  ["POST", "devices/pair", pairDevice],
  ["POST", "devices/pair-requests", createPairRequest],
  ["POST", "devices/pair-requests/:code/poll", pollPairRequest],
  ["POST", "family/pair-requests/claim", claimPairRequest],
  ["GET", "devices/me/rules", deviceRules],
  ["POST", "devices/me/usage", uploadUsage],
  ["POST", "devices/me/status", deviceStatus],
  ["POST", "devices/me/extra-time-requests", childRequest],
  ["GET", "devices/me/extra-time-requests", childRequests],
  ["POST", "devices/me/push-token", devicePushToken],
  ["GET", "subscription", subscription],
  ["POST", "subscription/google-play/verify", verifyPurchase],
  ["POST", "insights/weekly", weeklyInsights],
  ["POST", "app/ping", appPing],
  ["GET", "billing/plans", billingPlans],
  ["POST", "billing/razorpay/checkout", razorpayCheckout],
  ["POST", "billing/razorpay/cancel", razorpayCancel],
];
