import type { NextFunction, Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

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

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "লগইন প্রয়োজন।" });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as unknown as AuthUser;
    (req as AuthRequest).user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
    return next();
  } catch {
    return res.status(401).json({ message: "অবৈধ বা মেয়াদোত্তীর্ণ টোকেন। আবার লগইন করুন।" });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET) as unknown as AuthUser;
    (req as AuthRequest).user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    // ignore invalid token — treat as anonymous
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
