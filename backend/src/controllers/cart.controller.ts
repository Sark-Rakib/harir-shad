import type { Request, Response } from "express";
import { z } from "zod";
import { Cart } from "../models/Cart";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().optional().default(""),
  nameBn: z.string().min(1),
  nameEn: z.string().optional().default(""),
  weightLabel: z.string().optional().default(""),
  image: z.string().optional().default(""),
  unitPrice: z.coerce.number().min(0),
  quantity: z.coerce.number().min(1),
});

const cartSchema = z.object({
  items: z.array(cartItemSchema).max(100).default([]),
  appliedCode: z.string().nullable().optional().default(""),
});

function userIdOf(req: Request): string {
  return (req as Request & { user?: { id: string } }).user?.id ?? "";
}

export async function getMyCart(req: Request, res: Response) {
  const cart = await Cart.findOne({ userId: userIdOf(req) }).lean();
  return res.json({
    items: cart?.items ?? [],
    appliedCode: cart?.appliedCode || null,
  });
}

export async function upsertMyCart(req: Request, res: Response) {
  const data = cartSchema.parse(req.body);
  const cart = await Cart.findOneAndUpdate(
    { userId: userIdOf(req) },
    { items: data.items, appliedCode: data.appliedCode },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return res.json({
    items: cart.items,
    appliedCode: cart.appliedCode || null,
  });
}

export async function clearMyCart(req: Request, res: Response) {
  await Cart.findOneAndDelete({ userId: userIdOf(req) });
  return res.json({ items: [], appliedCode: null });
}
