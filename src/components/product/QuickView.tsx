"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/lib/types";
import { formatBDT } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/illustrations/ProductImage";

interface QuickViewProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function QuickView({ product, open, onClose }: QuickViewProps) {
  const { addItem, setCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const hasDiscount =
    product.oldPrice != null && product.oldPrice > product.price;

  const handleAdd = () => {
    addItem(product, quantity);
    onClose();
    setQuantity(1);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    onClose();
    setCartOpen(true);
    setQuantity(1);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brown-950/60 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.nameBn} - quick view`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-lift dark:bg-brown-900 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brown-700 shadow-soft transition-colors hover:text-terracotta-600 dark:bg-brown-800 dark:text-cream"
              aria-label="Close quick view"
            >
              <X size={18} />
            </button>

            {/* Image */}
            <div className="flex items-center justify-center bg-gradient-to-br from-cream to-cream-dark p-8 dark:from-brown-800 dark:to-brown-900">
              <ProductImage image={product.image} size={260} />
            </div>

            {/* Info */}
            <div className="flex flex-col p-6 md:p-8">
              <div className="mb-2 flex gap-2">
                {product.tags?.includes("new") && <Badge tone="green">নতুন</Badge>}
                {product.tags?.includes("bestseller") && (
                  <Badge tone="gold">বেস্টসেলার</Badge>
                )}
              </div>
              <h3 className="font-bengali text-xl font-bold text-brown-900 dark:text-cream">
                {product.nameBn}
              </h3>
              <p className="text-xs text-muted">{product.nameEn}</p>
              <div className="mt-2">
                <RatingStars
                  rating={product.rating ?? 0}
                  reviewsCount={product.reviewsCount}
                />
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-terracotta-600 dark:text-gold-300">
                  {formatBDT(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted line-through">
                    {formatBDT(product.oldPrice!)}
                  </span>
                )}
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                {product.descriptionBn}
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full border border-brown-200 p-1 dark:border-brown-700">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-brown-600 hover:bg-brown-100 dark:text-cream dark:hover:bg-white/5"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-brown-900 dark:text-cream">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-brown-600 hover:bg-brown-100 dark:text-cream dark:hover:bg-white/5"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <Button onClick={handleAdd} className="flex-1">
                  <ShoppingBag size={16} />
                  কার্টে যোগ করুন
                </Button>
              </div>

              <Button
                variant="gold"
                onClick={handleBuyNow}
                className="mt-3"
                fullWidth
              >
                এখনই কিনুন
                <ArrowRight size={16} />
              </Button>

              <Link
                href={`/products/${product.slug}`}
                className="mt-4 text-center text-xs font-semibold text-terracotta-600 hover:underline dark:text-gold-300"
              >
                বিস্তারিত দেখুন →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
