import { createSign } from "crypto";
import { readFileSync } from "fs";
import { q } from "./db";

/**
 * Firebase Cloud Messaging (HTTP v1) without the firebase-admin package.
 * Configure ONE of:
 *   UNSCROLL_FCM_SERVICE_ACCOUNT_FILE=/var/www/aivexa-web/secrets/unscroll-firebase.json
 *   UNSCROLL_FCM_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
 * When neither is set, pushes are skipped (alerts still appear in the app).
 */
interface ServiceAccount { project_id: string; client_email: string; private_key: string }

let account: ServiceAccount | null | undefined;
let cached: { token: string; exp: number } | null = null;

function serviceAccount(): ServiceAccount | null {
  if (account !== undefined) return account;
  try {
    const raw = process.env.UNSCROLL_FCM_SERVICE_ACCOUNT_JSON
      || (process.env.UNSCROLL_FCM_SERVICE_ACCOUNT_FILE ? readFileSync(process.env.UNSCROLL_FCM_SERVICE_ACCOUNT_FILE, "utf8") : "");
    account = raw ? (JSON.parse(raw) as ServiceAccount) : null;
  } catch (e) {
    console.error("[unscroll/push] bad service account", e);
    account = null;
  }
  return account;
}

async function accessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - 60 > now) return cached.token;
  const enc = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${enc({ alg: "RS256", typ: "JWT" })}.${enc({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  if (!res.ok) throw new Error(`FCM auth failed: ${res.status}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, exp: now + j.expires_in };
  return j.access_token;
}

export interface PushMessage {
  title: string;
  body: string;
  /** String values only (FCM rule). `type` lets the app open the right screen. */
  data?: Record<string, string>;
}

async function sendTo(tokens: string[], msg: PushMessage): Promise<void> {
  const sa = serviceAccount();
  if (!sa || !tokens.length) return;
  const at = await accessToken(sa);
  await Promise.all(tokens.map(async token => {
    const res = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${at}` },
      body: JSON.stringify({
        message: {
          token,
          notification: { title: msg.title, body: msg.body },
          data: msg.data ?? {},
          android: { priority: "high", notification: { channel_id: "unscroll_family", sound: "default" } },
        },
      }),
    });
    // Token no longer valid (app uninstalled / data cleared): forget it.
    if (res.status === 404 || res.status === 400) {
      const t = await res.text();
      if (/UNREGISTERED|INVALID_ARGUMENT|not a valid FCM registration token/i.test(t)) {
        await q(`DELETE FROM unscroll_push_tokens WHERE token = $1`, [token]).catch(() => undefined);
      }
    }
  }));
}

/** Push to every parent in a family. Never throws (alerts are saved regardless). */
export async function pushToFamily(familyId: string, msg: PushMessage): Promise<void> {
  try {
    const rows = await q<{ token: string }>(
      `SELECT t.token FROM unscroll_push_tokens t JOIN unscroll_users u ON u.id = t.user_id WHERE u.family_id = $1`,
      [familyId],
    );
    await sendTo(rows.map(r => r.token), msg);
  } catch (e) {
    console.error("[unscroll/push] family", e);
  }
}

/** Push to a child's paired phone (e.g. "extra time approved"). */
export async function pushToChild(childId: string, msg: PushMessage): Promise<void> {
  try {
    const rows = await q<{ token: string }>(
      `SELECT t.token FROM unscroll_push_tokens t JOIN unscroll_devices d ON d.id = t.device_id
       WHERE d.child_id = $1 AND d.revoked_at IS NULL`,
      [childId],
    );
    await sendTo(rows.map(r => r.token), msg);
  } catch (e) {
    console.error("[unscroll/push] child", e);
  }
}
