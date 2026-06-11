import crypto from "crypto";

export const ADMIN_COOKIE = "aivexa_admin";

// HMAC secret for signing the session cookie. The service-role key
// is server-only and stable, which makes it a usable signing secret.
function secret(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "aivexa-dev-secret"
  );
}

function sign(userId: string): string {
  return crypto.createHmac("sha256", secret()).update(userId).digest("hex");
}

export function makeToken(userId: string): string {
  return `${Buffer.from(userId).toString("base64url")}.${sign(userId)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return false;
  let userId: string;
  try {
    userId = Buffer.from(encoded, "base64url").toString();
  } catch {
    return false;
  }
  const expected = sign(userId);
  return (
    sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  );
}
