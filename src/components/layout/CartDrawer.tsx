"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/providers/cart-provider";
import { formatBDT } from "@/lib/utils";
import { ProductImage } from "@/components/illustrations/ProductImage";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const {
    items,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    deliveryCharge,
    total,
    appliedCode,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const handleApplyCoupon = () => {
    const result = applyCoupon(code);
    setCouponMsg(result);
    if (result.ok) setCode("");
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setCartOpen(false);
    router.push("/checkout");
  };

  const handleViewCart = () => {
    setCartOpen(false);
    router.push("/cart");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-brown-950/50 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift dark:bg-brown-900"
            onClick={(e) => e.stopPropagation()}
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brown-100 px-5 py-4 dark:border-brown-800">
              <h2 className="flex items-center gap-2 font-bengali text-lg font-bold text-brown-900 dark:text-cream">
                <ShoppingBag size={20} className="text-terracotta-500" />
                আপনার কার্ট
              </h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-brown-500 hover:bg-brown-100 dark:text-cream/70 dark:hover:bg-white/5"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream dark:bg-brown-800">
                  <ShoppingBag size={32} className="text-brown-300 dark:text-brown-500" />
                </span>
                <p className="font-bengali text-lg font-semibold text-brown-800 dark:text-cream">
                  কার্ট খালি
                </p>
                <p className="text-sm text-muted">
                  বগুড়ার আসল স্বাদ উপভোগ করতে পণ্য যোগ করুন
                </p>
                <Button
                  href="/products"
                  onClick={() => setCartOpen(false)}
                  className="mt-2"
                >
                  পণ্য দেখুন
                </Button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-4 rounded-2xl border border-brown-100 bg-cream/50 p-3 dark:border-brown-800 dark:bg-brown-800/30"
                    >
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-brown-800"
                      >
                        <ProductImage image={item.image} size={72} />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="block truncate font-bengali text-sm font-semibold text-brown-900 hover:text-terracotta-600 dark:text-cream"
                            >
                              {item.nameBn}
                            </Link>
                            <span className="text-xs text-muted">
                              {item.weightLabel}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="shrink-0 rounded-lg p-1 text-brown-400 hover:bg-brown-100 hover:text-red-500 dark:text-cream/50 dark:hover:bg-white/5"
                            aria-label={`Remove ${item.nameBn}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-brown-200 bg-white p-0.5 dark:border-brown-700 dark:bg-brown-800">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full text-brown-600 hover:bg-brown-100 dark:text-cream dark:hover:bg-white/5"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-brown-900 dark:text-cream">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full text-brown-600 hover:bg-brown-100 dark:text-cream dark:hover:bg-white/5"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-terracotta-600 dark:text-gold-300">
                            {formatBDT(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="space-y-3 border-t border-brown-100 p-5 dark:border-brown-800">
                  {/* Coupon */}
                  {appliedCode ? (
                    <div className="flex items-center justify-between rounded-xl bg-green-100/70 px-4 py-2.5 dark:bg-green-900/30">
                      <span className="flex items-center gap-2 text-sm font-semibold text-green-800 dark:text-green-200">
                        <Tag size={15} /> {appliedCode}
                        <span className="font-normal">
                          ({formatBDT(discount)} ছাড়)
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs font-medium text-green-700 underline dark:text-green-300"
                      >
                        সরান
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="কুপন কোড"
                        className="h-11 flex-1 rounded-xl border border-brown-200 bg-white px-4 text-sm outline-none focus:border-terracotta-500 dark:border-brown-700 dark:bg-brown-800 dark:text-cream"
                        aria-label="Coupon code"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="h-11 rounded-xl bg-brown-800 px-4 text-sm font-semibold text-cream transition-colors hover:bg-brown-700 dark:bg-gold-500 dark:text-brown-950 dark:hover:bg-gold-400"
                      >
                        প্রয়োগ
                      </button>
                    </div>
                  )}
                  {couponMsg && (
                    <p
                      className={`text-xs ${
                        couponMsg.ok
                          ? "text-green-600 dark:text-green-300"
                          : "text-red-500"
                      }`}
                    >
                      {couponMsg.message}
                    </p>
                  )}

                  {/* Summary */}
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted">
                      <dt>সাবটোটাল</dt>
                      <dd>{formatBDT(subtotal)}</dd>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-300">
                        <dt>ছাড়</dt>
                        <dd>-{formatBDT(discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between text-muted">
                      <dt>ডেলিভারি চার্জ</dt>
                      <dd>{deliveryCharge === 0 ? "ফ্রি" : formatBDT(deliveryCharge)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-brown-100 pt-2 text-base font-bold text-brown-900 dark:border-brown-800 dark:text-cream">
                      <dt>মোট</dt>
                      <dd className="text-terracotta-600 dark:text-gold-300">
                        {formatBDT(total)}
                      </dd>
                    </div>
                  </dl>

                  <Button onClick={handleCheckout} size="lg" fullWidth>
                    চেকআউট করুন
                    <ArrowRight size={18} />
                  </Button>
                  <button
                    type="button"
                    onClick={handleViewCart}
                    className="w-full py-1 text-center text-sm font-medium text-muted transition-colors hover:text-terracotta-600"
                  >
                    কার্ট পেজ দেখুন
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
