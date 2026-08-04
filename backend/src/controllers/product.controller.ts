import type { Request, Response } from "express";
import { z } from "zod";
import { Product } from "../models/Product";
import { HttpError } from "../utils/HttpError";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const productSchema = z.object({
  slug: z.string().optional(),
  nameBn: z.string().min(1, "বাংলা নাম দিন।"),
  nameEn: z.string().min(1, "English name required"),
  taglineBn: z.string().optional().default(""),
  taglineEn: z.string().optional().default(""),
  descriptionBn: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  weight: z.coerce.number().min(1, "ওজন দিন।"),
  weightLabel: z.string().optional().default(""),
  price: z.coerce.number().min(1, "দাম দিন।"),
  oldPrice: z.coerce.number().optional().default(0),
  rating: z.coerce.number().min(0).max(5).optional().default(4.8),
  reviewsCount: z.coerce.number().min(0).optional().default(0),
  stock: z.coerce.number().min(0).optional().default(0),
  tags: z.array(z.string()).optional().default([]),
  image: z.string().optional().default(""),
  gallery: z.array(z.string()).optional().default([]),
  ingredientsBn: z.array(z.string()).optional().default([]),
  ingredientsEn: z.array(z.string()).optional().default([]),
  nutrition: z
    .object({
      serving: z.string().optional().default("100g"),
      energyKcal: z.coerce.number().optional().default(0),
      fat: z.coerce.number().optional().default(0),
      protein: z.coerce.number().optional().default(0),
      carbs: z.coerce.number().optional().default(0),
      sugar: z.coerce.number().optional().default(0),
      calciumMg: z.coerce.number().optional().default(0),
    })
    .optional()
    .default(() => ({
      serving: "100g",
      energyKcal: 0,
      fat: 0,
      protein: 0,
      carbs: 0,
      sugar: 0,
      calciumMg: 0,
    })),
  delivery: z
    .object({
      insideDhaka: z.coerce.number().optional().default(80),
      outsideDhaka: z.coerce.number().optional().default(120),
      leadTimeBn: z.string().optional().default(""),
      leadTimeEn: z.string().optional().default(""),
      freeOver: z.coerce.number().optional().default(1000),
    })
    .optional()
    .default(() => ({
      insideDhaka: 80,
      outsideDhaka: 120,
      leadTimeBn: "",
      leadTimeEn: "",
      freeOver: 1000,
    })),
  active: z.boolean().optional().default(true),
});

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || "product";
  let exists = await Product.exists({ slug, _id: { $ne: excludeId } });
  let i = 2;
  while (exists) {
    slug = `${base}-${i}`;
    exists = await Product.exists({ slug, _id: { $ne: excludeId } });
    i += 1;
  }
  return slug;
}

export async function listProducts(req: Request, res: Response) {
  const { q, sort, includeInactive, page, limit, weight, maxPrice } =
    req.query as {
      q?: string;
      sort?: string;
      includeInactive?: string;
      page?: string;
      limit?: string;
      weight?: string;
      maxPrice?: string;
    };

  const filter: Record<string, unknown> = {};
  if (includeInactive !== "true") filter.active = true;
  if (q) {
    const rx = new RegExp(q.trim(), "i");
    filter.$or = [{ nameBn: rx }, { nameEn: rx }, { slug: rx }, { taglineBn: rx }];
  }
  const weightNum = Number.parseInt(weight ?? "0", 10);
  if (weightNum > 0) filter.weight = weightNum;
  const maxPriceNum = Number.parseFloat(maxPrice ?? "0");
  if (maxPriceNum > 0) filter.price = { $lte: maxPriceNum };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    popular: { rating: -1 },
  };
  const sortQuery = sortMap[sort ?? "newest"] ?? sortMap.newest;

  const pageNum = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
  const limitNum = Number.parseInt(limit ?? "0", 10);
  const hasPagination = limitNum > 0;

  const total = await Product.countDocuments(filter);
  const query = Product.find(filter).sort(sortQuery);

  if (hasPagination) {
    query.skip((pageNum - 1) * limitNum).limit(limitNum);
  }

  const products = (await query.exec()).map((doc) => doc.toJSON());

  const pages = hasPagination ? Math.ceil(total / limitNum) : 1;

  return res.json({ products, total, page: pageNum, pages });
}

export async function getProductBySlug(req: Request, res: Response) {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new HttpError(404, "পণ্যটি পাওয়া যায়নি।");
  return res.json({ product: product.toJSON() });
}

export async function getProductById(req: Request, res: Response) {
  const product = await Product.findById(req.params.id);
  if (!product) throw new HttpError(404, "পণ্যটি পাওয়া যায়নি।");
  return res.json({ product: product.toJSON() });
}

export async function createProduct(req: Request, res: Response) {
  const data = productSchema.parse(req.body);
  const slug = await ensureUniqueSlug(
    data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.nameEn),
  );
  const product = await Product.create({ ...data, slug });
  return res.status(201).json({ product: product.toJSON() });
}

export async function updateProduct(req: Request, res: Response) {
  const data = productSchema.partial().parse(req.body);
  const existing = await Product.findById(req.params.id);
  if (!existing) throw new HttpError(404, "পণ্যটি পাওয়া যায়নি।");

  let slug = existing.slug;
  if (data.slug && data.slug.trim()) {
    slug = await ensureUniqueSlug(slugify(data.slug), existing.id);
  }

  const product = await Product.findByIdAndUpdate(
    existing.id,
    { ...data, slug },
    { new: true, runValidators: true },
  );
  return res.json({ product: product?.toJSON() });
}

export async function removeProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new HttpError(404, "পণ্যটি পাওয়া যায়নি।");
  return res.json({ message: "পণ্যটি মুছে ফেলা হয়েছে।" });
}
