import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User";
import { signToken, type AuthRequest } from "../middleware/auth";
import { findOrCreateUser } from "../services/auth.service";
import { HttpError } from "../utils/HttpError";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies";

const registerSchema = z.object({
  name: z.string().min(2, "নাম অন্তত ২ অক্ষরের হতে হবে।"),
  email: z.string().email("সঠিক ইমেইল দিন।"),
  phone: z.string().min(6, "সঠিক ফোন নম্বর দিন।"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"),
});

const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন।"),
  password: z.string().min(1, "পাসওয়ার্ড দিন।"),
});

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw new HttpError(409, "এই ইমেইলে আগে থেকেই অ্যাকাউন্ট আছে।");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    passwordHash,
    role: "user",
    provider: "credentials",
    lastLoginAt: new Date(),
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  setAuthCookie(res, token);

  return res.status(201).json({ user: user.toJSON(), token });
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const user = await User.findOne({
    email: data.email.toLowerCase(),
  }).select("+passwordHash");

  if (!user) {
    throw new HttpError(401, "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
  }

  if (
    !user.passwordHash ||
    !(await bcrypt.compare(data.password, user.passwordHash))
  ) {
    throw new HttpError(401, "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
  }

  if (user.active === false || user.status === "blocked") {
    throw new HttpError(403, "এই অ্যাকাউন্টটি ব্লক করা হয়েছে।");
  }

  // Integrate after successful login: upsert the user document in MongoDB.
  // Existing accounts are updated (lastLoginAt, name, image) — never duplicated —
  // and the stored role (e.g. admin) is always preserved.
  const { user: synced } = await findOrCreateUser({
    email: user.email,
    name: user.name,
    provider: "credentials",
  });

  const token = signToken({
    id: synced.id,
    email: synced.email,
    name: synced.name,
    role: synced.role,
  });

  setAuthCookie(res, token);

  return res.json({ user: synced.toJSON(), token });
}

export async function me(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  // Migrate legacy header-based sessions to the HTTP-only cookie so they stay
  // signed in after a browser restart.
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    setAuthCookie(res, header.slice(7));
  }
  const user = await User.findById(authReq.user?.id);
  if (!user) throw new HttpError(404, "ব্যবহারকারী পাওয়া যায়নি।");
  return res.json({ user: user.toJSON() });
}

export async function logout(req: Request, res: Response) {
  clearAuthCookie(res);
  return res.json({ message: "লগআউট সফল হয়েছে।" });
}

const updateMeSchema = z.object({
  name: z.string().min(2, "নাম অন্তত ২ অক্ষরের হতে হবে।").optional(),
  phone: z.string().min(6, "সঠিক ফোন নম্বর দিন।").optional(),
});

export async function updateMe(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const data = updateMeSchema.parse(req.body);

  const user = await User.findByIdAndUpdate(authReq.user?.id, data, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new HttpError(404, "ব্যবহারকারী পাওয়া যায়নি।");

  return res.json({ user: user.toJSON() });
}
