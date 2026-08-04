"use client";

import {
  CheckCircle2,
  Heart,
  Leaf,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/lib/types";
import { cn, formatBDT } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const {
    addItem,
    setCartOpen,
    toggleWishlist,
    isWishlisted,
    addRecentlyViewed,
  } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const hasDiscount =
    product.oldPrice != null && product.oldPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.oldPrice! - product.price) / product.oldPrice!) * 100,
      )
    : 0;
  const stock = product.stock ?? 0;
  const lowStock = stock > 0 && stock <= 20;
  const tags = product.tags ?? [];
  const delivery = product.delivery ?? {
    insideDhaka: 80,
    outsideDhaka: 120,
    leadTimeBn: "",
    freeOver: 1000,
  };

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    setCartOpen(true);
  };

  return (
    <div className="flex flex-col">
      {/* Badges */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tags.includes("new") && <Badge tone="green">নতুন</Badge>}
        {tags.includes("bestseller") && <Badge tone="gold">বেস্টসেলার</Badge>}
        {hasDiscount && <Badge tone="terracotta">{discountPct}% ছাড়</Badge>}
      </div>

      {/* Title */}
      <h1 className="font-bengali text-3xl font-bold leading-tight text-brown-900 dark:text-cream md:text-4xl">
        {product.nameBn}
      </h1>
      <p className="mt-1.5 text-sm text-muted">{product.nameEn}</p>
      <p className="mt-3 font-bengali text-sm font-medium text-terracotta-600 dark:text-gold-300">
        {product.taglineBn}
      </p>

      {/* Rating */}
      <div className="mt-4">
        <RatingStars
          rating={product.rating ?? 0}
          reviewsCount={product.reviewsCount}
          size={18}
        />
      </div>

      {/* Price */}
      <div className="mt-6 flex flex-wrap items-end gap-3">
        <span className="text-4xl font-bold text-terracotta-600 dark:text-gold-300">
          {formatBDT(product.price)}
        </span>
        {hasDiscount && (
          <span className="pb-1 text-lg text-muted line-through">
            {formatBDT(product.oldPrice!)}
          </span>
        )}
        {hasDiscount && (
          <span className="mb-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700 dark:bg-green-900/50 dark:text-green-200">
            সাশ্রয় {formatBDT(product.oldPrice! - product.price)}
          </span>
        )}
      </div>

      {/* Weight */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted">ওজন</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brown-200 bg-white/70 px-4 py-2 text-sm font-semibold text-brown-800 dark:border-brown-700 dark:bg-brown-800/60 dark:text-cream">
          <Package size={15} />
          {product.weightLabel}
        </span>
        {stock > 0 ? (
          lowStock ? (
            <span className="text-xs font-semibold text-amber-600 dark:text-gold-300">
              মাত্র {stock}টি বাকি আছে!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-300">
              <CheckCircle2 size={14} />
              স্টকে আছে
            </span>
          )
        ) : (
          <span className="text-xs font-semibold text-red-500">
            বর্তমানে স্টক নেই
          </span>
        )}
      </div>

      {/* Quantity + Add to cart */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center justify-between gap-1 rounded-full border border-brown-200 bg-white/70 p-1.5 dark:border-brown-700 dark:bg-brown-800/60 sm:justify-start">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brown-600 transition-colors hover:bg-brown-100 dark:text-cream dark:hover:bg-white/5"
            aria-label="পরিমাণ কমান"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center font-bold text-brown-900 dark:text-cream">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brown-600 transition-colors hover:bg-brown-100 dark:text-cream dark:hover:bg-white/5"
            aria-label="পরিমাণ বাড়ান"
          >
            <Plus size={16} />
          </button>
        </div>

        <Button
          onClick={handleAdd}
          disabled={added || stock === 0}
          size="lg"
          className="flex-1"
        >
          {added ? (
            <>
              <CheckCircle2 size={18} /> যোগ হয়েছে
            </>
          ) : (
            <>
              <ShoppingBag size={18} /> কার্টে যোগ করুন
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300 self-end md:self-center",
            wishlisted
              ? "border-terracotta-500 bg-terracotta-500 text-white"
              : "border-brown-200 text-brown-500 hover:border-terracotta-500 hover:text-terracotta-500 dark:border-brown-700 dark:text-cream/70",
          )}
          aria-label={
            wishlisted
              ? `উইশলিস্ট থেকে সরান ${product.nameBn}`
              : `উইশলিস্টে যোগ করুন ${product.nameBn}`
          }
        >
          <Heart size={19} className={wishlisted ? "fill-current" : ""} />
        </button>
      </div>

      <Button
        variant="gold"
        size="lg"
        onClick={handleBuyNow}
        disabled={stock === 0}
        className="mt-3"
        fullWidth
      >
        <Zap size={18} />
        এখনই কিনুন
      </Button>

      {/* Trust row */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-2xl border border-brown-100 bg-white/60 px-3 py-3 dark:border-brown-800 dark:bg-brown-900/30">
          <ShieldCheck
            size={18}
            className="shrink-0 text-green-600 dark:text-green-300"
          />
          <span className="text-[11px] font-semibold leading-tight text-brown-700 dark:text-cream/80">
            প্রিমিয়াম প্যাকেজিং
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-brown-100 bg-white/60 px-3 py-3 dark:border-brown-800 dark:bg-brown-900/30">
          <Truck
            size={18}
            className="shrink-0 text-terracotta-500 dark:text-gold-300"
          />
          <span className="text-[11px] font-semibold leading-tight text-brown-700 dark:text-cream/80">
            {formatBDT(delivery.insideDhaka)} এর মধ্যে
            {delivery.freeOver > 0
              ? `, ${formatBDT(delivery.freeOver)}+ অর্ডারে ফ্রি`
              : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-brown-100 bg-white/60 px-3 py-3 dark:border-brown-800 dark:bg-brown-900/30">
          <RotateCcw size={18} className="shrink-0 text-gold-600" />
          <span className="text-[11px] font-semibold leading-tight text-brown-700 dark:text-cream/80">
            ফ্রেশ ডেলিভারি
          </span>
        </div>
      </div>

      {/* Delivery details */}
      <div className="mt-5 rounded-2xl border border-brown-100 bg-white/60 p-4 dark:border-brown-800 dark:bg-brown-900/30">
        <p className="text-sm font-bold text-brown-900 dark:text-cream">
          ডেলিভারি তথ্য
        </p>
        <div className="mt-3 space-y-2 text-xs text-muted">
          <div className="flex items-center justify-between">
            <span>ঢাকার ভেতরে</span>
            <span className="font-semibold text-brown-800 dark:text-cream/80">
              {formatBDT(delivery.insideDhaka)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>ঢাকার বাইরে</span>
            <span className="font-semibold text-brown-800 dark:text-cream/80">
              {formatBDT(delivery.outsideDhaka)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>সময়</span>
            <span className="font-semibold text-brown-800 dark:text-cream/80">
              {delivery.leadTimeBn}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>ফ্রি ডেলিভারি</span>
            <span className="font-semibold text-green-600 dark:text-green-300">
              {formatBDT(delivery.freeOver)}+ অর্ডারে
            </span>
          </div>
        </div>
      </div>

      {/* Ingredients teaser */}
      <div className="mt-5 flex items-start gap-2 rounded-2xl border border-green-100 bg-green-50/60 p-4 dark:border-green-900/40 dark:bg-green-950/30">
        <Leaf
          size={18}
          className="mt-0.5 shrink-0 text-green-600 dark:text-green-300"
        />
        <p className="text-xs leading-relaxed text-brown-700 dark:text-cream/70">
          ১০০% প্রাকৃতিক উপকরণ, কোনো প্রিজারভেটিভ নেই। উপকরণের সম্পূর্ণ তালিকা
          নিচের{" "}
          <span className="font-semibold text-green-700 dark:text-green-300">
            উপকরণ
          </span>{" "}
          ট্যাবে দেখুন।
        </p>
      </div>
    </div>
  );
}
