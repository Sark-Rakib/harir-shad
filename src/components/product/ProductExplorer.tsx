"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchProducts } from "@/lib/product-api";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type SortKey = "popular" | "new" | "price-asc" | "price-desc";

const PAGE_SIZE = 12;

const weightOptions = [
  { label: "সব", value: 0 },
  { label: "২৫০ গ্রাম", value: 250 },
  { label: "৫০০ গ্রাম", value: 500 },
  { label: "১ কেজি", value: 1000 },
  { label: "২ কেজি", value: 2000 },
];

const sortParam: Record<SortKey, string> = {
  popular: "popular",
  new: "newest",
  "price-asc": "priceAsc",
  "price-desc": "priceDesc",
};

export function ProductExplorer() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [weight, setWeight] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [maxAvailable, setMaxAvailable] = useState(0);

  const initialMaxRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
      setLoading(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (initialMaxRef.current) return;
    initialMaxRef.current = true;
    fetchProducts({ sort: "priceDesc", limit: 1 })
      .then((r) => {
        if (r.products.length > 0) {
          const top = Math.ceil(r.products[0].price / 10) * 10;
          setMaxAvailable(top);
          setMaxPrice(top);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const result = await fetchProducts({
          q: debouncedQuery || undefined,
          sort: sortParam[sort],
          weight: weight > 0 ? weight : undefined,
          maxPrice: maxPrice > 0 ? maxPrice : undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (cancelled) return;
        setProducts(result.products);
        setTotal(result.total);
        setPages(result.pages);
        setPage(result.page);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "পণ্য লোড করা যায়নি।");
        setProducts([]);
        setTotal(0);
        setPages(1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, sort, weight, maxPrice, page]);

  const clearFilters = () => {
    setQuery("");
    setWeight(0);
    setMaxPrice(maxAvailable);
    setSort("popular");
    setPage(1);
  };

  const hasActiveFilters =
    debouncedQuery !== "" || weight > 0 || maxPrice < maxAvailable || sort !== "popular";

  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="bg-hero-gradient">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-600 dark:text-terracotta-400">
            Products
          </p>
          <h1 className="font-bengali text-3xl font-bold text-brown-900 dark:text-cream md:text-5xl">
            আমাদের সব পণ্য
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted md:text-base">
            প্রতিটি হাঁড়িতে বগুড়ার ঐতিহ্য — খাঁটি, প্রাকৃতিক ও প্রিজারভেটিভ মুক্ত।
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brown-400 dark:text-cream/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন…"
              className="h-12 w-full rounded-2xl border border-brown-200/80 bg-white/70 pl-11 pr-10 text-sm text-ink-900 shadow-sm outline-none transition-all placeholder:text-brown-300 focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream dark:placeholder:text-brown-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-brown-400 hover:text-red-500"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setPage(1);
                setLoading(true);
              }}
              className="h-12 rounded-2xl border border-brown-200/80 bg-white/70 px-4 text-sm font-medium text-brown-700 shadow-sm outline-none focus:border-terracotta-500 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream"
              aria-label="Sort products"
            >
              <option value="popular">জনপ্রিয়</option>
              <option value="new">নতুন</option>
              <option value="price-asc">দাম (কম → বেশি)</option>
              <option value="price-desc">দাম (বেশি → কম)</option>
            </select>

            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className={cn(
                "flex h-12 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition-colors",
                filtersOpen || hasActiveFilters
                  ? "border-terracotta-500 bg-terracotta-50 text-terracotta-700 dark:bg-terracotta-900/30 dark:text-terracotta-200"
                  : "border-brown-200/80 bg-white/70 text-brown-700 shadow-sm dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream",
              )}
              aria-expanded={filtersOpen}
            >
              <Filter size={16} />
              ফিল্টার
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mb-8 grid gap-6 rounded-3xl border border-brown-100 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-brown-800 dark:bg-brown-900/50 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-bold text-brown-900 dark:text-cream">
                    ওজন
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weightOptions.map((w) => (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => {
                          setWeight(w.value);
                          setPage(1);
                          setLoading(true);
                        }}
                        className={cn(
                          "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                          weight === w.value
                            ? "border-terracotta-500 bg-terracotta-500 text-white"
                            : "border-brown-200 bg-white text-brown-600 hover:border-terracotta-300 dark:border-brown-700 dark:bg-brown-800 dark:text-cream",
                        )}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-brown-900 dark:text-cream">
                      সর্বোচ্চ দাম
                    </p>
                    <span className="rounded-lg bg-terracotta-100 px-2.5 py-1 text-xs font-bold text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-200">
                      ৳{maxPrice}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={maxAvailable || 100}
                    step={10}
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));
                      setPage(1);
                      setLoading(true);
                    }}
                    className="w-full accent-terracotta-600"
                    aria-label="Maximum price"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-muted">
                    <span>৳১০০</span>
                    <span>৳{maxAvailable || 100}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results meta */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> লোড হচ্ছে…
              </span>
            ) : (
              <>মোট {total} টি পণ্য পাওয়া গেছে</>
            )}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 hover:underline dark:text-gold-300"
            >
              <X size={14} />
              সব ফিল্টার মুছুন
            </button>
          )}
        </div>

        {/* Grid */}
        {error ? (
          <div className="py-20 text-center">
            <p className="font-bengali text-xl font-bold text-brown-800 dark:text-cream">
              {error}
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-terracotta-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-bengali text-xl font-bold text-brown-800 dark:text-cream">
              কোনো পণ্য পাওয়া যায়নি
            </p>
            <p className="mt-2 text-sm text-muted">
              ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    setLoading(true);
                  }}
                  disabled={page <= 1}
                  className="flex h-11 items-center gap-1.5 rounded-2xl border border-brown-200 bg-white/70 px-4 text-sm font-semibold text-brown-700 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream"
                >
                  <ChevronLeft size={16} />
                  আগে
                </button>
                <span className="text-sm font-semibold text-brown-700 dark:text-cream">
                  {showingFrom}–{showingTo} / {total}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPage((p) => Math.min(pages, p + 1));
                    setLoading(true);
                  }}
                  disabled={page >= pages}
                  className="flex h-11 items-center gap-1.5 rounded-2xl border border-brown-200 bg-white/70 px-4 text-sm font-semibold text-brown-700 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream"
                >
                  পরে
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
