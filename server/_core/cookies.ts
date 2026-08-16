import { serialize, type SerializeOptions } from "cookie";
import type { ServerResponse } from "http";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import { ENV } from "./env.js";

export function getSessionCookieOptions(): SerializeOptions {
  return {
    httpOnly: true,
    secure: ENV.isProduction,
    sameSite: "lax",
    path: "/",
  };
}

export function setSessionCookie(res: ServerResponse, token: string) {
  const cookie = serialize(COOKIE_NAME, token, {
    ...getSessionCookieOptions(),
    maxAge: Math.floor(ONE_YEAR_MS / 1000),
  });
  res.setHeader("Set-Cookie", cookie);
}

export function clearSessionCookie(res: ServerResponse) {
  const cookie = serialize(COOKIE_NAME, "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
  res.setHeader("Set-Cookie", cookie);
}
