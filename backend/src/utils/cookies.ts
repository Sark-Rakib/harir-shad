import type { Response } from "express";
import { env } from "../config/env";

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

function maxAgeFromExpires(expiresIn: string): number {
  const value = Number.parseInt(expiresIn, 10);
  if (Number.isNaN(value)) return 7 * 24 * 60 * 60;
  const unit = expiresIn.replace(/\d+/g, "").toLowerCase();
  const seconds =
    unit === "m" ? 60 : unit === "h" ? 60 * 60 : unit === "d" ? 24 * 60 * 60 : unit === "w" ? 7 * 24 * 60 * 60 : 1;
  return value * seconds;
}

export function setAuthCookie(res: Response, token: string) {
  const maxAgeMs = maxAgeFromExpires(env.JWT_EXPIRES_IN) * 1000;
  res.cookie(env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.AUTH_COOKIE_SECURE,
    sameSite: env.AUTH_COOKIE_SAME_SITE === "lax" ? "lax" : env.AUTH_COOKIE_SAME_SITE === "strict" ? "strict" : "none",
    maxAge: maxAgeMs,
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