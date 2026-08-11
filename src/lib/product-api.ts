import type { Product } from "./types";

export interface ProductQuery {
  q?: string;
  sort?: string;
  page?: number;
  limit?: number;
  weight?: number;
  maxPrice?: number;
  includeInactive?: boolean;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

// Callers pass absolute paths like "/api/products". On Vercel (same origin)
// NEXT_PUBLIC_API_URL is unset, so API_URL is empty and the path is used as-is.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function buildQuery(params: ProductQuery): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.sort) sp.set("sort", params.sort);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  if (params.limit && params.limit > 0) sp.set("limit", String(params.limit));
  if (params.weight && params.weight > 0) sp.set("weight", String(params.weight));
  if (params.maxPrice && params.maxPrice > 0)
    sp.set("maxPrice", String(params.maxPrice));
  if (params.includeInactive) sp.set("includeInactive", "true");
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

async function fetchJson<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  } catch {
    throw new Error("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
  }
  return parseJson<T>(res);
}

export async function fetchProducts(
  params: ProductQuery = {},
): Promise<ProductListResult> {
  const data = await fetchJson<{
    products: Product[];
    total: number;
    page: number;
    pages: number;
  }>(`/api/products${buildQuery(params)}`);
  return {
    products: data.products ?? [],
    total: data.total ?? 0,
    page: data.page ?? 1,
    pages: data.pages ?? 1,
  };
}

export async function fetchLatestProducts(limit = 8): Promise<Product[]> {
  const { products } = await fetchProducts({ sort: "newest", limit });
  return products;
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const data = await fetchJson<{ product: Product }>(
      `/api/products/slug/${encodeURIComponent(slug)}`,
    );
    return data.product ?? null;
  } catch {
    return null;
  }
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { products } = await fetchProducts({ includeInactive: false });
  return products;
}
