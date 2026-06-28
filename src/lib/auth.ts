import { cookies } from "next/headers";
import { redis } from "./redis";
import bcrypt from "bcryptjs";

const SESSION_COOKIE_NAME = "iyke_portfolio_session";
const SESSION_TTL = 86400; // 24 hours (in seconds)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(adminId: string): Promise<string> {
  // Generate a random high-entropy session token
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  const sessionKey = `session:${token}`;
  
  // Save mapping (token -> adminId) in Redis with 24h expiration
  await redis.set(sessionKey, adminId, { ex: SESSION_TTL });
  
  // Set httpOnly session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_TTL,
    path: "/",
  });
  
  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (token) {
    const sessionKey = `session:${token}`;
    await redis.del(sessionKey);
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionAdminId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) return null;
  
  const sessionKey = `session:${token}`;
  const adminId = await redis.get<string>(sessionKey);
  
  return adminId || null;
}
