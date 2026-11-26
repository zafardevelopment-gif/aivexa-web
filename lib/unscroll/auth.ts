import { createHash, randomBytes, randomInt } from "crypto";
import { one, q } from "./db";
import { HttpError } from "./http";

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const token = (prefix: string) => `${prefix}_${randomBytes(32).toString("base64url")}`;
export const sixDigits = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

/** Same alphabet/length as the app (src/features/pairing/pairing.ts): no 0/O/1/I/L. */
export const PAIRING_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const pairingCode8 = () => Array.from({ length: 8 }, () => PAIRING_ALPHABET[randomInt(0, PAIRING_ALPHABET.length)]).join("");
export const normalisePairing = (s: string) => s.toUpperCase().replace(/[^0-9A-Z]/g, "");

const ACCESS_MS = 24 * 60 * 60 * 1000;
const REFRESH_MS = 120 * 24 * 60 * 60 * 1000;

export interface UserRow {
  id: string;
  email: string;
  display_name: string;
  role: "individual" | "parent";
  family_id: string | null;
}

export interface DeviceCtx {
  deviceId: string;
  childId: string;
  childName: string;
  familyId: string;
}

export async function issueSession(userId: string) {
  const accessToken = token("usr");
  const refreshToken = token("ref");
  const now = Date.now();
  await q(
    `INSERT INTO unscroll_sessions (user_id, access_hash, refresh_hash, access_expires_at, refresh_expires_at)
     VALUES ($1, $2, $3, to_timestamp($4 / 1000.0), to_timestamp($5 / 1000.0))`,
    [userId, sha256(accessToken), sha256(refreshToken), now + ACCESS_MS, now + REFRESH_MS],
  );
  return { accessToken, refreshToken, expiresAtMs: now + ACCESS_MS };
}

export async function refreshSession(refreshToken: string) {
  const s = await one<{ id: string; user_id: string }>(
    `UPDATE unscroll_sessions SET revoked_at = now()
     WHERE refresh_hash = $1 AND revoked_at IS NULL AND refresh_expires_at > now()
     RETURNING id, user_id`,
    [sha256(refreshToken)],
  );
  if (!s) throw new HttpError(401, "Session expired. Please sign in again.");
  return issueSession(s.user_id);
}

const bearer = (req: Request) => {
  const h = req.headers.get("authorization") ?? "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : "";
};

/** Signed-in parent / individual. */
export async function requireUser(req: Request): Promise<UserRow & { sessionId: string }> {
  const t = bearer(req);
  if (!t.startsWith("usr_")) throw new HttpError(401, "Unauthorized");
  const u = await one<UserRow & { session_id: string }>(
    `SELECT u.id, u.email, u.display_name, u.role, u.family_id, s.id AS session_id
     FROM unscroll_sessions s JOIN unscroll_users u ON u.id = s.user_id
     WHERE s.access_hash = $1 AND s.revoked_at IS NULL AND s.access_expires_at > now()`,
    [sha256(t)],
  );
  if (!u) throw new HttpError(401, "Unauthorized");
  void q(`UPDATE unscroll_users SET last_seen_at = now() WHERE id = $1`, [u.id]).catch(() => undefined);
  return { ...u, sessionId: u.session_id };
}

/** Parent with a family; creates the family on first use. */
export async function requireParent(req: Request): Promise<UserRow & { family_id: string }> {
  const u = await requireUser(req);
  if (u.family_id) return u as UserRow & { family_id: string };
  const f = await one<{ id: string }>(`INSERT INTO unscroll_families (owner_id) VALUES ($1) RETURNING id`, [u.id]);
  await q(`UPDATE unscroll_users SET family_id = $1, role = 'parent' WHERE id = $2`, [f!.id, u.id]);
  return { ...u, family_id: f!.id, role: "parent" };
}

/** The child's paired phone. */
export async function requireDevice(req: Request): Promise<DeviceCtx> {
  const t = bearer(req);
  if (!t.startsWith("dev_")) throw new HttpError(401, "Unauthorized");
  const d = await one<{ id: string; child_id: string; name: string; family_id: string }>(
    `SELECT d.id, d.child_id, c.name, c.family_id
     FROM unscroll_devices d JOIN unscroll_children c ON c.id = d.child_id
     WHERE d.token_hash = $1 AND d.revoked_at IS NULL`,
    [sha256(t)],
  );
  if (!d) throw new HttpError(401, "This phone is no longer connected. Ask your parent for a new code.");
  return { deviceId: d.id, childId: d.child_id, childName: d.name, familyId: d.family_id };
}

export const newDeviceToken = () => token("dev");
