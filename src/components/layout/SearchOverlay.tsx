"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fetchProducts } from "@/lib/product-api";
import { formatBDT } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/illustrations/ProductImage";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setQuery("");
        setResults([]);
        setSearched(false);
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        setSearched(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      fetchProducts({ q: query.trim(), limit: 8 })
        .then(({ products }) => {
          setResults(products);
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
          setSearched(true);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-brown-950/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="mx-auto mt-20 w-[92%] max-w-xl overflow-hidden rounded-3xl bg-white shadow-lift dark:bg-brown-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-brown-100 px-5 py-4 dark:border-brown-800">
              <Search size={20} className="shrink-0 text-terracotta-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="দই খুঁজুন… (যেমন: মিষ্টি দই)"
                className="w-full bg-transparent text-base text-ink-900 outline-none placeholder:text-brown-300 dark:text-cream dark:placeholder:text-brown-500"
              />
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-brown-500 hover:bg-brown-100 dark:text-cream/70 dark:hover:bg-white/5"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-3">
              {loading && (
                <p className="flex items-center justify-center gap-2 px-4 py-10 text-center text-sm text-muted">
                  <Loader2 size={16} className="animate-spin" /> খোঁজা হচ্ছে…
                </p>
              )}
              {!loading && query && searched && results.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-muted">
                  &ldquo;{query}&rdquo; — কোনো পণ্য পাওয়া যায়নি
                </p>
              )}
              {!loading && !query && (
                <p className="px-4 py-10 text-center text-sm text-muted">
                  পণ্যের নাম লিখে খুঁজুন…
                </p>
              )}
              <ul className="space-y-1">
                {results.map((product, i) => (
                  <motion.li
                    key={product.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-cream dark:hover:bg-white/5"
                    >
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cream dark:bg-brown-800">
                        <ProductImage image={product.image} size={56} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bengali text-sm font-semibold text-brown-900 dark:text-cream">
                          {product.nameBn}
                        </span>
                        <span className="block text-xs text-muted">
                          {product.weightLabel} • ★ {product.rating}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-terracotta-600 dark:text-gold-300">
                        {formatBDT(product.price)}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
