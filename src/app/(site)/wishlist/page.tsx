"use client";

import { Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { fetchProducts } from "@/lib/product-api";
import type { Product } from "@/lib/types";
import { useCart } from "@/providers/cart-provider";

export default function WishlistPage() {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (wishlist.length === 0) {
        if (!cancelled) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }
      try {
        const r = await fetchProducts({ limit: 100 });
        if (!cancelled)
          setProducts(r.products.filter((p) => wishlist.includes(p.id)));
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "লোড করা যায়নি।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [wishlist]);

  return (
    <div className="bg-hero-gradient">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-600 dark:text-terracotta-400">
            Wishlist
          </p>
          <h1 className="font-bengali text-3xl font-bold text-brown-900 dark:text-cream md:text-5xl">
            আমার পছন্দের পণ্য
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted md:text-base">
            আপনার সংরক্ষিত পণ্যগুলো এখানে দেখা যাবে।
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-terracotta-600" />
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="font-bengali text-xl font-bold text-brown-800 dark:text-cream">
              {error}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brown-100 text-brown-400 dark:bg-brown-800">
              <Heart size={28} />
            </span>
            <p className="font-bengali text-xl font-bold text-brown-800 dark:text-cream">
              উইশলিস্টে কোনো পণ্য নেই
            </p>
            <p className="text-sm text-muted">
              পণ্যের কার্ডে হৃদয় আইকনে ক্লিক করে পছন্দের তালিকায় যোগ করুন।
            </p>
            <Button href="/products" variant="outline">
              পণ্য দেখুন
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
