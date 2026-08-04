import type { NextFunction, Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { parseCookieToken } from "../utils/cookies";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function signToken(user: { id: string; email: string; name: string; role: "admin" | "user" }): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    env.JWT_SECRET,
    options,
  );
}

function tokenFrom(req: Request): string {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return parseCookieToken(req);
}

function verifyToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as unknown as AuthUser;
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = tokenFrom(req);
  if (!token) {
    return res.status(401).json({ message: "লগইন প্রয়োজন।" });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ message: "অবৈধ বা মেয়াদোত্তীর্ণ টোকেন। আবার লগইন করুন।" });
  }
  (req as AuthRequest).user = user;
  return next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = tokenFrom(req);
  if (token) {
    const user = verifyToken(token);
    if (user) (req as AuthRequest).user = user;
  }
  return next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as AuthRequest).user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "এই কাজটি করার অনুমতি আপনার নেই।" });
  }
  return next();
}
