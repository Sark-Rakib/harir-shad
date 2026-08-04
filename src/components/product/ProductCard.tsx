"use client";

import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/lib/types";
import { formatBDT } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { ProductImage } from "@/components/illustrations/ProductImage";
import { QuickView } from "./QuickView";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, setCartOpen, toggleWishlist, isWishlisted } = useCart();
  const [quickOpen, setQuickOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const hasDiscount = product.oldPrice != null && product.oldPrice > product.price;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    addItem(product);
    setCartOpen(true);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-brown-100 bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift dark:border-brown-800"
      >
        {/* Image */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cream to-cream-dark dark:from-brown-800 dark:to-brown-900">
          <Link
            href={`/products/${product.slug}`}
            className="flex h-full w-full items-center justify-center"
            aria-label={product.nameBn}
          >
            <span className="transition-transform duration-500 group-hover:scale-110">
              <ProductImage image={product.image} size={200} />
            </span>
          </Link>

          {/* Badges */}
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
            {product.tags?.includes("new") && (
              <Badge tone="green">নতুন</Badge>
            )}
            {hasDiscount && (
              <Badge tone="terracotta">
                {Math.round(
                  ((product.oldPrice! - product.price) / product.oldPrice!) * 100,
                )}
                % ছাড়
              </Badge>
            )}
          </div>

          {/* Hover actions */}
          <div className="absolute inset-x-0 bottom-3 flex translate-y-14 items-center justify-center gap-2 transition-transform duration-300 group-hover:translate-y-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuickOpen(true);
              }}
              className="glass dark:glass-dark flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-brown-800 shadow-soft transition-colors hover:text-terracotta-600 dark:text-cream"
            >
              <Eye size={15} />
              কুইক ভিউ
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBuyNow();
              }}
              className="flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-br from-terracotta-500 to-terracotta-700 px-4 text-xs font-semibold text-white shadow-soft transition-transform hover:scale-105"
            >
              <Zap size={15} />
              এখনই কিনুন
            </button>
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
              wishlisted
                ? "bg-terracotta-500 text-white"
                : "bg-white/80 text-brown-500 backdrop-blur hover:text-terracotta-500 dark:bg-brown-800/80 dark:text-cream"
            }`}
            aria-label={
              wishlisted
                ? `Remove ${product.nameBn} from wishlist`
                : `Add ${product.nameBn} to wishlist`
            }
          >
            <Heart size={16} className={wishlisted ? "fill-current" : ""} />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col pt-4">
          <Link
            href={`/products/${product.slug}`}
            className="font-bengali text-base font-bold leading-snug text-brown-900 transition-colors hover:text-terracotta-600 dark:text-cream"
          >
            {product.nameBn}
          </Link>
          <p className="mt-0.5 text-xs text-muted">{product.weightLabel}</p>

          <div className="mt-2">
            <RatingStars
              rating={product.rating ?? 0}
              reviewsCount={product.reviewsCount}
            />
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-muted line-through">
                  {formatBDT(product.oldPrice!)}
                </span>
              )}
              <span className="text-lg font-bold text-terracotta-600 dark:text-gold-300">
                {formatBDT(product.price)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={added}
              className={`flex h-11 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition-all duration-300 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-brown-900 text-cream hover:bg-terracotta-600 dark:bg-gold-500 dark:text-brown-950 dark:hover:bg-gold-400"
              }`}
            >
              {added ? (
                <>
                  <ShoppingBag size={14} /> যোগ হয়েছে
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> কার্টে যোগ করুন
                </>
              )}
            </button>
          </div>
        </div>
      </motion.article>

      <QuickView
        product={product}
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}
