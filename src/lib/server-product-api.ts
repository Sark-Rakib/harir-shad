import type { Product } from "./types";
import { ensureDbConnection } from "./server-db";

async function getProductModel() {
  await ensureDbConnection();
  const { Product } = await import("../../backend/src/models/Product");
  return Product;
}

function toProduct(doc: Record<string, unknown>): Product {
  doc.id = (doc._id ?? "").toString();
  delete doc._id;
  delete doc.__v;
  return doc as unknown as Product;
}

export async function fetchLatestProducts(limit = 8): Promise<Product[]> {
  const Model = await getProductModel();
  const docs = await Model.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return docs.map((d) => toProduct(d as unknown as Record<string, unknown>));
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const Model = await getProductModel();
  const doc = await Model.findOne({ slug }).lean();
  if (!doc) return null;
  return toProduct(doc as unknown as Record<string, unknown>);
}

export async function fetchAllProducts(): Promise<Product[]> {
  const Model = await getProductModel();
  const docs = await Model.find({ active: true }).lean();
  return docs.map((d) => toProduct(d as unknown as Record<string, unknown>));
}
