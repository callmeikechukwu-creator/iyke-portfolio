import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const SESSION_COOKIE_NAME = "iyke_portfolio_session";
const SESSION_TTL = 86400 * 7; // 7 days (in seconds)

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.ADMIN_INITIAL_PASSWORD ||
  process.env.STORAGE_API_KEY ||
  "iyke_portfolio_secure_session_key_2026_salt_981c";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function signSessionToken(adminId: string, ttlSeconds: number): string {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const data = `${adminId}.${expiresAt}`;
  const hmac = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${hmac}`;
}

function verifySessionToken(token: string): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [adminId, expiresAtStr, hmac] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return null;
  }

  const expectedHmac = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${adminId}.${expiresAtStr}`)
    .digest("base64url");

  if (hmac.length !== expectedHmac.length) return null;

  const hmacBuf = Buffer.from(hmac);
  const expectedBuf = Buffer.from(expectedHmac);

  if (!crypto.timingSafeEqual(hmacBuf, expectedBuf)) {
    return null;
  }

  return adminId;
}

export async function createSession(adminId: string): Promise<string> {
  const token = signSessionToken(adminId, SESSION_TTL);

  // Set httpOnly session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionAdminId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  return verifySessionToken(token);
}
