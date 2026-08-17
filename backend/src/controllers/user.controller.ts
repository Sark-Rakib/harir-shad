import type { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { HttpError } from "../utils/HttpError";

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["admin", "user"]).optional(),
  active: z.boolean().optional(),
  phone: z.string().min(6).optional(),
});

export async function listUsers(req: Request, res: Response) {
  const { q } = req.query as { q?: string };

  const filter: Record<string, unknown> = {};
  if (q) {
    const rx = new RegExp(q.trim(), "i");
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }];
  }

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .select("+active")
    .lean();

  const safeUsers = users.map((u) => ({
    ...u,
    id: String(u._id),
    passwordHash: undefined,
  }));

  return res.json({ users: safeUsers });
}

export async function getUser(req: Request, res: Response) {
  const user = await User.findById(req.params.id).select("+active");
  if (!user) throw new HttpError(404, "ব্যবহারকারী পাওয়া যায়নি।");
  return res.json({ user: user.toJSON() });
}

export async function updateUser(req: Request, res: Response) {
  const data = updateUserSchema.parse(req.body);

  if (req.params.id === (req as Request & { user?: { id: string } }).user?.id) {
    throw new HttpError(400, "নিজের রোল/স্ট্যাটাস পরিবর্তন করা যাবে না।");
  }

  const user = await User.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new HttpError(404, "ব্যবহারকারী পাওয়া যায়নি।");
  return res.json({ user: user.toJSON() });
}

export async function removeUser(req: Request, res: Response) {
  if (req.params.id === (req as Request & { user?: { id: string } }).user?.id) {
    throw new HttpError(400, "নিজেকে মুছে ফেলা যাবে না।");
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new HttpError(404, "ব্যবহারকারী পাওয়া যায়নি।");
  return res.json({ message: "ব্যবহারকারী মুছে ফেলা হয়েছে।" });
}
