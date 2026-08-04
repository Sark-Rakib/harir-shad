import type { Response } from "express";
import { env } from "../config/env";

// Browsers cap cookie lifetimes around 400 days. The auth JWT never expires,
// so the cookie lives as long as possible — the session ends on logout.
const AUTH_COOKIE_MAX_AGE_MS = 400 * 24 * 60 * 60 * 1000;

export function parseCookieToken(req: { headers: Record<string, unknown> }): string {
  const cookieHeader = String(req.headers.cookie ?? "");
  if (!cookieHeader) return "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${env.AUTH_COOKIE_NAME}=`));
  if (!match) return "";
  return match.slice(env.AUTH_COOKIE_NAME.length + 1) || "";
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.AUTH_COOKIE_SECURE,
    sameSite: env.AUTH_COOKIE_SAME_SITE === "lax" ? "lax" : env.AUTH_COOKIE_SAME_SITE === "strict" ? "strict" : "none",
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(env.AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.AUTH_COOKIE_SECURE,
    sameSite: env.AUTH_COOKIE_SAME_SITE === "lax" ? "lax" : env.AUTH_COOKIE_SAME_SITE === "strict" ? "strict" : "none",
    path: "/",
  });
}