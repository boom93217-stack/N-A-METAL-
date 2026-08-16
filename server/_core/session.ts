import { SignJWT, jwtVerify } from "jose";
import { createHash, timingSafeEqual } from "crypto";
import { ONE_YEAR_MS } from "../../shared/const.js";
import { ENV } from "./env.js";

/** The single admin account is identified by this constant instead of a real OAuth openId. */
export const ADMIN_OPEN_ID = "admin";

function getSecretKey() {
  if (!ENV.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(ENV.jwtSecret);
}

export async function signSession(openId: string): Promise<string> {
  const expirationSeconds = Math.floor((Date.now() + ONE_YEAR_MS) / 1000);
  return new SignJWT({ openId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<{ openId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    const { openId } = payload as Record<string, unknown>;
    if (typeof openId !== "string" || !openId) return null;
    return { openId };
  } catch (error) {
    console.warn("[Auth] Session verification failed", String(error));
    return null;
  }
}

function hashed(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Constant-time comparison against the single admin account configured via env vars. */
export function checkAdminCredentials(username: string, password: string): boolean {
  if (!ENV.adminUsername || !ENV.adminPassword) {
    console.error("[Auth] ADMIN_USERNAME / ADMIN_PASSWORD are not configured");
    return false;
  }
  const usernameMatches = timingSafeEqual(hashed(username), hashed(ENV.adminUsername));
  const passwordMatches = timingSafeEqual(hashed(password), hashed(ENV.adminPassword));
  return usernameMatches && passwordMatches;
}
